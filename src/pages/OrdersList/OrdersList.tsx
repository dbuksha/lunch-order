import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, clearOrdersList } from 'store/orders';
import { Grid } from '@material-ui/core';
import { RootState } from 'store';

import OrderCard from 'pages/OrdersList/OrderCard';

const OrdersList: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);
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
