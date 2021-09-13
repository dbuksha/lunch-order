import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Typography } from '@material-ui/core';

import AdminLayout from '../../components/AdminComponents/Layout/AdminLayout';

const Dashboard: FC = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Главная</title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Typography>Раздел еще не наполнен</Typography>
          </Grid>
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default Dashboard;
