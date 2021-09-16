import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, clearOrdersList, getOrdersList } from 'store/orders';
import { Grid, makeStyles, createStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { getIsLoading } from 'store/app';
import MainLayout from 'components/SiteLayout/MainLayout';
import OrderCard from 'components/Cards/OrderCard';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 20,
    },
    alert: {
      margin: '20px auto',
    },
  }),
);

const OrdersList: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const orders = useSelector(getOrdersList);

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  if (!orders.length && !isLoading) {
    return (
      <MainLayout>
        <Alert variant="outlined" severity="info" className={classes.alert}>
          На сегодня еще нет заказов.
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Grid container spacing={3} alignItems="stretch" className={classes.root}>
        {orders?.map((order) => (
          <Grid item key={order.id} xs={12} sm={6} lg={4}>
            <OrderCard order={order} adminMode={false} />
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
};

export default OrdersList;
