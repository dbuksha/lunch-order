import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import firebaseInstance, { Collections } from 'utils/firebase';
import {
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  TableBody,
  TableRow,
  createStyles,
  makeStyles,
  Checkbox,
  Select,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import dayjs from 'utils/dayjs';
import axios from 'axios';

import { DeliveryData, DeliveryDataFirebase } from 'entities/Delivery';
import { UserNew } from 'entities/User';
import { Order } from 'entities/Order';

import { getIsLoading } from 'store/app';
import { fetchDeliveryInfo, getDeliveryInfoSelector } from 'store/delivery';
import {
  fetchAllUsers,
  fetchUserInfo,
  getAllUserSelector,
  getUserSelector,
} from 'store/users';
import { fetchOrders, getOrdersList } from 'store/orders';
import { getDepositModeSelector } from 'store/settings';

import { getMessage } from 'utils/message';
import { calculatePriceCard } from 'utils/orders';

import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';
import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';
import DeliveryItem from './DeliveryItem';

import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const deliveryCollection = firebaseInstance.collection(Collections.Delivery);
const usersCollection = firebaseInstance.collection(Collections.Users);

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 600,
      margin: '30px auto',
    },
    caption: {
      fontSize: 16,
      color: '#000',
    },
    alert: {
      margin: '20px auto',
    },
    count: {
      minWidth: 80,
    },
  }),
);

async function updateUsersBalances(orders: Array<Order>) {
  // eslint-disable-next-line no-restricted-syntax
  for (const order of orders) {
    // eslint-disable-next-line no-await-in-loop
    usersCollection.doc(order.person?.id).update({
      balance: order!.person!.balance - calculatePriceCard(order.dishes),
    });
  }
}

const OrdersDeliveryDeposit: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = useSelector(getIsLoading);
  const currentUser = useSelector(getUserSelector);
  const depositMode = useSelector(getDepositModeSelector);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);

  const globalDelivery = useSelector(getDeliveryInfoSelector);
  const users = useSelector(getAllUserSelector);
  const orders = useSelector(getOrdersList);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [payer, setPayer] = useState('83o4aNGJBk6lLLNlR6KN');
  const [dialogStatus, setDialogStatus] = useState('');

  useEffect(() => {
    if (globalDelivery === null) {
      dispatch(fetchDeliveryInfo());
    }

    dispatch(fetchOrders());

    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (globalDelivery && globalDelivery.id) {
      setDeliveryCompleted(true);

      if (globalDelivery.payer && globalDelivery.payer.id) {
        setPayer(globalDelivery.payer.id);
      }
    }
  }, [globalDelivery]);

  if (!deliveryData.length && !isLoading) {
    return (
      <MainLayout>
        <Alert variant="outlined" severity="info" className={classes.alert}>
          ???? ?????????????? ?????? ?????? ??????????????.
        </Alert>
      </MainLayout>
    );
  }

  const toggleDialogHandler = (state: string) => () => {
    if (deliveryCompleted && state === 'delivery') return;

    setDialogStatus(state);
  };

  const payerChange = (event: React.ChangeEvent<any>) => {
    setPayer(event.target.value as string);
  };

  const confirmDeliveryCompleted = async () => {
    await setDeliveryCompleted(true);
    await toggleDialogHandler('')();

    const deliveryRecord: DeliveryDataFirebase = {
      createDate: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      payer: firebaseInstance.doc(`${Collections.Users}/${payer}`),
      dishes: deliveryData,
      total: deliveryPrice,
    };

    await deliveryCollection.add(deliveryRecord);

    await dispatch(fetchDeliveryInfo());

    await updateUsersBalances(orders);

    currentUser && (await dispatch(fetchUserInfo(currentUser.email as string)));

    try {
      const data = {
        text: getMessage(payer, deliveryPrice, orders, users, depositMode),
      };

      await axios.post(
        `${process.env.REACT_APP_SLACK_URL}`,
        JSON.stringify(data),
      );
    } catch {
      console.log('slack: ?????????????????? ???? ??????????????????????');
    }
  };

  const cancelSelectedPayer = () => {
    toggleDialogHandler('')();
  };

  return (
    <MainLayout>
      <TableContainer component={Paper} className={classes.root}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <b>????????????????????????</b>
              </TableCell>
              <TableCell align="right" className={classes.count}>
                <b>??????-????</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveryData?.map((deliveryItem) => (
              <DeliveryItem
                name={deliveryItem.name}
                quantity={deliveryItem.quantity}
                key={deliveryItem.name}
              />
            ))}
            <TableRow>
              <TableCell align="left">
                <b>????????????????????:</b>
              </TableCell>
              <TableCell align="right">
                <Select
                  native
                  value={payer}
                  onChange={payerChange}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    name: 'user',
                  }}
                  disabled={deliveryCompleted}
                >
                  {users.length
                    ? users.map((el: UserNew) => (
                        <option value={el.id}>{el.name}</option>
                      ))
                    : null}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                <b className={classes.caption}>
                  ??????????: {deliveryPrice}
                  <Ruble />
                </b>
              </TableCell>
              <TableCell align="right">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={deliveryCompleted}
                      onChange={toggleDialogHandler('delivery')}
                      color="primary"
                    />
                  }
                  label="?????????? ????????????"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteAlert
        status={dialogStatus !== ''}
        title="???? ??????????????, ?????? ???? ???????????????? ?????? ???? ?????????????????"
        desc={`${
          dialogStatus === 'delivery'
            ? '?????????? ????????, ?????? ?????????????????????? ????????????????, ?????????? ?????? ???? ?????????????????????? ???????? ?????????? ????????????????????'
            : '?????????? ????????, ?????? ?????????????????????? ???????????????? ???????????????? ???????????????????? ?????????? ????????????????????'
        }`}
        closeAlert={
          dialogStatus === 'delivery'
            ? toggleDialogHandler('')
            : cancelSelectedPayer
        }
        confirmEvent={confirmDeliveryCompleted}
      />
    </MainLayout>
  );
};

export default OrdersDeliveryDeposit;
