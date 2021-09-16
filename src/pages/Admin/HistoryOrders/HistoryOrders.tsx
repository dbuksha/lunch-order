import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { Alert, Pagination } from '@material-ui/lab';

import { Order } from 'entities/Order';

import { getIsLoading } from 'store/app';
import { fetchHistoryOrders, getHistoryOrdersList } from 'store/orders';

import AdminLayout from 'components/AdminComponents/Layout/AdminLayout';
import OrderCard from 'components/Cards/OrderCard';

const perPage = 20;

const getTotalPage = (arr: Order[]) => {
  return +(arr.length / perPage).toFixed();
};

const getCurrentOrders = (arr: Order[], currentPage: number) => {
  const begin = (currentPage - 1) * perPage;
  const end = begin + perPage;

  const personWithPerson = arr.filter((el) => el.person);

  return personWithPerson.slice(begin, end);
};

const HistoryOrders: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const orders = useSelector(getHistoryOrdersList);
  const [page, setPage] = useState(1);
  const [total] = useState(getTotalPage(orders));
  const [currentOrders, setCurrentOrders] = useState(
    getCurrentOrders(orders, page),
  );

  useEffect(() => {
    dispatch(fetchHistoryOrders());
  }, [dispatch]);

  useEffect(() => {
    setCurrentOrders(getCurrentOrders(orders, page));
  }, [orders]);

  const changePageHandler = async (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    await setPage(page);
    await setCurrentOrders(getCurrentOrders(orders, page));
    window.scrollTo(0, 0);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>История заказов</title>
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
              Завершенные заказы отсутствуют
            </Alert>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Завершенные заказы</Typography>
              </Box>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {currentOrders.map((order) => (
                    <Grid item key={order.id} xs={12} sm={6} lg={4}>
                      <OrderCard order={order} adminMode={false} historyMode />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              {total > 1 ? (
                <Box display="flex" justifyContent="flex-end" sx={{ pt: 3 }}>
                  <Pagination
                    count={total}
                    page={page}
                    onChange={changePageHandler}
                  />
                </Box>
              ) : null}
            </>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default HistoryOrders;
