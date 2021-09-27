import React, { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import firebaseInstance, { Collections } from 'utils/firebase';
import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import {
  fetchOrders,
  clearOrdersList,
  getOrdersList,
  resetOrder,
} from 'store/orders';

import { getIsLoading } from 'store/app';
import { getUserSelector } from 'store/users';

import AdminLayout from 'components/AdminComponents/Layout/AdminLayout';
import OrderCard from 'components/Cards/OrderCard';
import { getDeliveryInfoSelector } from 'store/delivery';

const ordersCollection = firebaseInstance.collection(Collections.Orders);

const Orders: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const orders = useSelector(getOrdersList);
  const currentUser = useSelector(getUserSelector);
  const deliveryStatus = useSelector(getDeliveryInfoSelector);

  useEffect(() => {
    dispatch(fetchOrders());

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
            <Alert variant="outlined" severity="info">
              Текущие заказы отсутствуют
            </Alert>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Текущие заказы</Typography>
                <Button
                  component={Link}
                  to="/admin/order-new"
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
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
