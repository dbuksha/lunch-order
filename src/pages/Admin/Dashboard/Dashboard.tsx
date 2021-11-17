import React, { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';
import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';

const Dashboard: FC = () => {
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [depositMode, setDepositMode] = useState(false);

  const toggleConfirm = () => {
    setConfirmStatus(!confirmStatus);
  };

  const changeDepositMode = () => {
    setDepositMode(!depositMode);
    toggleConfirm();
  };

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
            <FormControlLabel
              control={
                <Checkbox
                  checked={depositMode}
                  onChange={toggleConfirm}
                  color="primary"
                />
              }
              label="Режим с депозитами"
            />
          </Grid>
        </Container>
      </Box>
      <DeleteAlert
        status={confirmStatus}
        title={`Вы уверены, что хотите ${
          depositMode ? 'выключить' : 'включить'
        } режим заказа обедов через депозит?`}
        desc=""
        closeAlert={toggleConfirm}
        confirmEvent={changeDepositMode}
      />
    </AdminLayout>
  );
};

export default Dashboard;
