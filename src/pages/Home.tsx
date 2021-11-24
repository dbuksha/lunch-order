import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Box,
  Button,
} from '@material-ui/core';

import MainLayout from 'components/SiteLayout/MainLayout';

import { getUserSelector } from 'store/users';
import {
  fetchOrders,
  getCurrentOrder,
  getTodayOrders,
  getUserOrder,
} from 'store/orders';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';

import Ruble from 'components/Ruble';

import { colors } from 'utils/colors';

import { useGroupedDishes } from './OrdersDelivery/useGroupedDishes';
import { useCalculatedDeliveryPrice } from './OrdersDelivery/useCalculatedDeliveryPrice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      '& .MuiButton-root': {
        marginTop: theme.spacing(3),
      },
    },
    pinInfo: {
      display: 'block',
      padding: '0 8px',
      marginLeft: 12,
      backgroundColor: '#fff',
      color: colors.blue,
      borderRadius: 6,
      fontWeight: 700,
      textTransform: 'lowercase',
    },
  }),
);

export const Home: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUserSelector);
  const gropedDishes = useGroupedDishes();
  const deliveryPrice = useCalculatedDeliveryPrice(gropedDishes);
  const userOrder = useSelector(getCurrentOrder);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const todayOrders = useSelector(getTodayOrders);

  useEffect(() => {
    dispatch(fetchOrders());

    if (currentUser && currentUser.id) {
      dispatch(getUserOrder());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (userOrder) {
      const price = deliveryDataHelper.calculateDeliveryPrice(userOrder.dishes);
      setCalculatedPrice(price);
    }
  }, [userOrder]);

  return (
    <MainLayout>
      <Container className={classes.root} maxWidth="xs">
        <Box>
          <Button
            component={Link}
            to="/orders/new"
            fullWidth
            variant="contained"
            color="primary"
          >
            Сделать Заказ
            {userOrder && userOrder.dishes.length ? (
              <span className={classes.pinInfo}>
                {calculatedPrice}
                <Ruble />
              </span>
            ) : null}
          </Button>

          <Button
            component={Link}
            to="/orders"
            fullWidth
            variant="contained"
            color="primary"
          >
            Список заказов
            {todayOrders && todayOrders.length > 0 ? (
              <span className={classes.pinInfo}>{todayOrders.length}</span>
            ) : null}
          </Button>

          <Button
            component={Link}
            to="/orders/delivery"
            fullWidth
            variant="contained"
            color="primary"
          >
            Заказать доставку
            {todayOrders && todayOrders.length > 0 ? (
              <span className={classes.pinInfo}>
                {deliveryPrice}
                <Ruble />
              </span>
            ) : null}
          </Button>

          {currentUser?.role === 'admin' ? (
            <Button
              component={Link}
              to="/admin"
              fullWidth
              variant="contained"
              color="primary"
            >
              Администрирование
            </Button>
          ) : null}
        </Box>
      </Container>
    </MainLayout>
  );
};
