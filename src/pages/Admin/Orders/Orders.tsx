import React, { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import firebaseInstance from 'utils/firebase';
import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import {
  fetchOrders,
  clearOrdersList,
  getOrdersList,
  resetOrder,
  clearOptionOrder,
} from 'store/orders';

import { getIsLoading } from 'store/app';
import { getUserSelector } from 'store/users';
import { getDeliveryInfoSelector } from 'store/delivery';
import { getDepositModeSelector } from 'store/settings';

import AdminLayout from 'components/AdminComponents/Layout/AdminLayout';
import OrderCard from 'components/Cards/OrderCard';

const AddButton = () => (
  <Button
    component={Link}
    to="/admin/order-new"
    variant="contained"
    color="primary"
  >
    Добавить
  </Button>
);

const Orders: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const orders = useSelector(getOrdersList);
  const currentUser = useSelector(getUserSelector);
  const depositMode = useSelector(getDepositModeSelector);
  const deliveryStatus = useSelector(getDeliveryInfoSelector);
  const ordersCollection = firebaseInstance.collection(
    depositMode ? 'orders_deposit' : 'orders',
  );

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(clearOptionOrder());

    return () => {
      dispatch(clearOrdersList());
    };
  }, [dispatch]);

  const deleteOrderHandler = async (id: string, personID: string) => {
    await ordersCollection.doc(id).delete();
    await dispatch(fetchOrders());
    if (currentUser && currentUser.id === personID) {
      await dispatch(resetOrder());
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Текущие заказы</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {!orders.length && !isLoading ? (
            <Box display="flex" justifyContent="space-between">
              <Alert variant="outlined" severity="info">
                Текущие заказы отсутствуют
              </Alert>
              <AddButton />
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Текущие заказы</Typography>
                <AddButton />
              </Box>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {orders?.map((order) => (
                    <Grid item key={order.id} xs={12} sm={6} lg={4}>
                      <OrderCard
                        order={order}
                        adminMode
                        deleteMode={!deliveryStatus}
                        deleteOrder={deleteOrderHandler}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default Orders;
