import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import firebaseInstance, { Collections } from 'utils/firebase';
import { Helmet } from 'react-helmet';
import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { fetchLunches } from 'store/lunches';
import { getLunches } from 'store/lunches/lunches-selectors';
import { getIsLoading } from 'store/app';

import ComplexCard from 'components/AdminComponents/Cards/ComplexCard';
import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';

const lunchesCollection = firebaseInstance.collection(Collections.Lunches);

const ComplexList: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);
  const lunches = useSelector(getLunches);

  const deleteLunchHandler = async (id: string) => {
    await lunchesCollection.doc(id).delete();
    await dispatch(fetchLunches());
  };

  const sortLunches = lunches.slice().sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <AdminLayout>
      <Helmet>
        <title>Комплексы</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {!lunches.length && !isLoading ? (
            <Alert variant="outlined" severity="info">
              Список комплексов отсутствует
            </Alert>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4">Комплексы</Typography>
                <Button
                  component={Link}
                  to="/admin/complex-new"
                  variant="contained"
                  color="primary"
                >
                  Добавить
                </Button>
              </Box>
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {sortLunches.map((el) => (
                    <Grid item key={el.id} lg={6} md={6} xs={12}>
                      <ComplexCard data={el} deleteLunch={deleteLunchHandler} />
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

export default ComplexList;
