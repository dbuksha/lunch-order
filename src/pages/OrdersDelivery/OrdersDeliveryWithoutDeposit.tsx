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

import { DeliveryData } from 'entities/Delivery';
import { UserNew } from 'entities/User';

import { getIsLoading } from 'store/app';
import { fetchDeliveryInfo, getDeliveryInfoSelector } from 'store/delivery';
import { fetchAllUsers, getAllUserSelector } from 'store/users';
import { fetchOrders, getOrdersList } from 'store/orders';
import { getDepositModeSelector } from 'store/settings';

import { getMessage } from 'utils/message';

import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';
import MainLayout from 'components/SiteLayout/MainLayout';
import Ruble from 'components/Ruble';
import DeliveryItem from './DeliveryItem';

import { useGroupedDishes } from './useGroupedDishes';
import { usePreparedDeliveryData } from './usePreparedDeliveryData';
import { useCalculatedDeliveryPrice } from './useCalculatedDeliveryPrice';

const deliveryCollection = firebaseInstance.collection(Collections.Delivery);

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

const getNameUser = (arr: Array<UserNew>, id: string) => {
  return arr.reduce((acc: string, el: UserNew) => {
    if (el.id === id) {
      acc = el.name || '';
    }

    return acc;
  }, '');
};

const OrdersDeliveryWithoutDeposit: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = useSelector(getIsLoading);
  const depositMode = useSelector(getDepositModeSelector);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const deliveryData = usePreparedDeliveryData(gropedDishes);

  const globalDelivery = useSelector(getDeliveryInfoSelector);
  const users = useSelector(getAllUserSelector);
  const orders = useSelector(getOrdersList);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [tempPayer, setTempPayer] = useState('');
  const [payer, setPayer] = useState('default');
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
    setTempPayer(event.target.value as string);
    setDialogStatus('payer');
  };

  const confirmDeliveryCompleted = async () => {
    await setDeliveryCompleted(true);
    await toggleDialogHandler('')();
    const deliveryRecord: DeliveryData = {
      createDate: firebase.firestore.Timestamp.fromDate(dayjs().toDate()),
      payer: null,
      dishes: deliveryData,
      total: deliveryPrice,
    };
    await deliveryCollection.add(deliveryRecord);
    await dispatch(fetchDeliveryInfo());
  };

  const confirmSelectPayer = async () => {
    await setPayer(tempPayer);
    await setTempPayer('');
    await toggleDialogHandler('')();

    await deliveryCollection.doc(globalDelivery!.id).update({
      payer: firebaseInstance.doc(`${Collections.Users}/${tempPayer}`),
    });

    try {
      const data = {
        text: getMessage(tempPayer, deliveryPrice, orders, users, depositMode),
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
    if (dialogStatus === 'payer') {
      setTempPayer('');
      setPayer('default');
    }
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
                  disabled={payer !== 'default' || !deliveryCompleted}
                >
                  <option value="default">???????????????? ????????????????????????</option>
                  {users.length
                    ? users.map((el: UserNew) => (
                        <option value={el.id}>{el.name}</option>
                      ))
                    : null}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteAlert
        status={dialogStatus !== ''}
        title={`${
          dialogStatus === 'delivery'
            ? '???? ??????????????, ?????? ???? ???????????????? ?????? ???? ?????????????????'
            : `???? ??????????????, ?????? ???????????? ?????????????? ${
                users ? getNameUser(users, tempPayer) : '?????????? ????????????????????????'
              }?`
        }`}
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
        confirmEvent={
          dialogStatus === 'delivery'
            ? confirmDeliveryCompleted
            : confirmSelectPayer
        }
      />
    </MainLayout>
  );
};
export default OrdersDeliveryWithoutDeposit;
