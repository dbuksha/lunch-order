import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import AdminLayout from '../../components/AdminComponenets/Layout/AdminLayout';
// import LatestOrders from 'src/components/dashboard//LatestOrders';
// import Sales from 'src/components/dashboard//Sales';
// import TotalCustomers from 'src/components/dashboard//TotalCustomers';
// import TotalProfit from 'src/components/dashboard//TotalProfit';

const Dashboard: FC = () => (
  <AdminLayout>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
    <Box
      sx={{
        // backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
          </Grid> */}
          {/* <Grid
            item
            lg={6}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid> */}
          {/* <Grid item lg={12} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </AdminLayout>
);

export default Dashboard;
