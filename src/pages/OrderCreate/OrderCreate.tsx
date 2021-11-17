import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import dayjs from 'dayjs';

import firebaseInstance, { Collections } from 'utils/firebase';

import {
  addOrder,
  deleteOrder,
  getCurrentOrder,
  getUserOrder,
} from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';
import { getUserSelector } from 'store/users/users-selectors';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';

import MainLayout from 'components/SiteLayout/MainLayout';
import StyledPaper from 'components/StyledPaper';
import TodayLunches from 'components/TodayLunches';

import { OrderFirebase } from 'entities/Order';
import {
  getDayName,
  getOrderDayNumberNew,
  isTimeForTodayLunch,
} from 'utils/time-helper';
import { fetchUserInfo } from 'store/users';
import { getDeliveryInfoSelector } from 'store/delivery';
import Ruble from 'components/Ruble';
import AccountBalanceWalletOutlined from '@material-ui/icons/AccountBalanceWalletOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'inherit',
      },
    },
    item: {
      margin: theme.spacing(1),
    },
    total: {
      width: 120,
    },
    pageTitle: {
      '&:first-letter': {
        textTransform: 'capitalize',
      },
      wordWrap: 'break-word',
    },
    main: {
      margin: '40px auto',
      [theme.breakpoints.down('sm')]: {
        margin: '0',
      },
    },
    attention: {
      border: '1px solid #f50057',
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,.2)',
      padding: '15px 30px',
      marginBottom: 20,
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
      },
    },
    attentionText: {
      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
      },
    },
    balance: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    balanceText: {},
  }),
);

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const currentUser = useSelector(getUserSelector);
  const order = useSelector(getCurrentOrder);
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);
  const deliveryStatus = useSelector(getDeliveryInfoSelector);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getUserOrder());
    }
  }, [dispatch, currentUser]);

  // recalculate order sum
  useEffect(() => {
    if (order && selectedDishes) {
      const price = deliveryDataHelper.calculateDeliveryPrice(order.dishes);
      setCalculatedPrice(price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if (!currentUser || !selectedDishes) return;

    if (!currentUser.id) {
      alert('Пользователь не был найден, попробуйте снова');
      dispatch(fetchUserInfo(currentUser.email!));
      return;
    }

    const preparedDishes: any[] = [];

    setSendLoading(true);

    selectedDishes.forEach((quantity, id) => {
      preparedDishes.push({
        dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
        quantity,
      });
    });

    // if lunch not for today: set tomorrow (9 a.m.)
    const time = isTimeForTodayLunch()
      ? dayjs()
      : dayjs().add(1, 'day').hour(9).startOf('h');

    const orderData: OrderFirebase = {
      date: firebase.firestore.Timestamp.fromDate(time.toDate()),
      dishes: preparedDishes,
      person: firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
    };

    if (order) orderData.id = order.id;

    try {
      await dispatch(addOrder(orderData));
      setSendLoading(false);
      history.push('/');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
      setSendLoading(false);
    }
  };

  const onDeleteOrder = () => {
    async function handleDeleteOrder() {
      if (order?.id) {
        await dispatch(deleteOrder(order.id));
        history.push('/');
      }
    }

    handleDeleteOrder();
  };

  const otherDayFlag =
    dayjs().day() !== getOrderDayNumberNew(deliveryStatus !== null);

  return (
    <MainLayout>
      <StyledPaper className={classes.main}>
        <Box className={classes.balance}>
          <AccountBalanceWalletOutlined color="primary" />
          <Typography variant="body1" className={classes.balanceText}>
            {currentUser?.balance}
            <Ruble />
          </Typography>
        </Box>
        {currentUser && currentUser?.balance < 0 ? (
          <Box className={classes.attention}>
            <Typography variant="body1" className={classes.attentionText}>
              На вашем счете отрицательный баланс. К сожалению, заказ еды
              недоступен.
            </Typography>
          </Box>
        ) : (
          <>
            {otherDayFlag || deliveryStatus ? (
              <Box className={classes.attention}>
                <Typography variant="body1" className={classes.attentionText}>
                  {`Внимание! На сегодня заказы больше не принимаются, но можно
                  сделать предварительный заказ на ${getDayName(
                    deliveryStatus !== null,
                  )}.`}
                </Typography>
              </Box>
            ) : null}
            <Typography
              className={classes.pageTitle}
              component="div"
              variant="h6"
            >
              {getDayName(deliveryStatus !== null)}
              {otherDayFlag || deliveryStatus ? '(предварительный заказ)' : ''}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <TodayLunches />
              <Grid
                item
                className={classes.root}
                container
                sm={12}
                md={12}
                lg={12}
                justifyContent="flex-end"
                alignItems="baseline"
              >
                <Typography
                  component="span"
                  variant="h6"
                  className={(classes.item, classes.total)}
                >
                  Итого:{' '}
                  <strong>
                    {calculatedPrice}
                    <Ruble />
                  </strong>
                </Typography>
                {order?.id && (
                  <Button
                    className={classes.item}
                    variant="outlined"
                    color="secondary"
                    onClick={onDeleteOrder}
                  >
                    Отменить заказ
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.item}
                  disabled={!calculatedPrice || sendLoading || !currentUser}
                  onClick={onCreateOrderSubmit}
                >
                  {order?.id ? 'Обновить заказ' : 'Заказать'}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </StyledPaper>
    </MainLayout>
  );
};

export default OrderCreate;
