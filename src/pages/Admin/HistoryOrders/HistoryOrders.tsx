import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { getIsLoading } from 'store/app';
import { fetchDeliveries, getDeliveriesSelector } from 'store/delivery';

import AdminLayout from 'components/AdminComponents/Layout/AdminLayout';
import DeliveryCard from 'components/AdminComponents/Cards/DeliveryCard';

const HistoryOrders: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const deliveries = useSelector(getDeliveriesSelector);

  useEffect(() => {
    if (deliveries === null) {
      dispatch(fetchDeliveries());
    }
  }, [dispatch]);

  console.log(deliveries);

  return (
    <AdminLayout>
      <Helmet>
        <title>История доставки</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {deliveries === null && !isLoading ? (
            <Alert variant="outlined" severity="info">
              История доставки пуста
            </Alert>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">История доставки</Typography>
              </Box>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {deliveries?.map((delivery) => (
                    <Grid item key={delivery.id} xs={12} sm={6} lg={4}>
                      <DeliveryCard delivery={delivery} />
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

export default HistoryOrders;
