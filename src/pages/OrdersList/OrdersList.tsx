import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, clearOrdersList, getOrdersList } from 'store/orders';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { getIsLoading } from 'store/app';
import OrderCard from 'pages/OrdersList/OrderCard';

const OrdersList: FC = () => {
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
      <Alert variant="outlined" severity="info">
        На сегодня еще нет заказов.
      </Alert>
    );
  }

  console.log('Orders - ', orders);

  return (
    <Grid container spacing={3} alignItems="stretch">
      {orders?.map((order) => (
        <Grid item key={order.id} xs={12} sm={6} lg={3}>
          <OrderCard order={order} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OrdersList;
