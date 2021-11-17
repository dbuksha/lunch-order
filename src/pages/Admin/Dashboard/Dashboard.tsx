import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

import { getDepositModeSelector, setDeposit } from 'store/settings';

import DeleteAlert from 'components/AdminComponents/Alerts/DeleteAlert';
import AdminLayout from '../../../components/AdminComponents/Layout/AdminLayout';

const Dashboard: FC = () => {
  const dispatch = useDispatch();
  const depositMode = useSelector(getDepositModeSelector);
  const [confirmStatus, setConfirmStatus] = useState(false);
  // const [depositMode, setDepositMode] = useState(currentDepositMode);

  const toggleConfirm = () => {
    setConfirmStatus(!confirmStatus);
  };

  const changeDepositMode = async () => {
    console.log(!depositMode);
    await dispatch(setDeposit(!depositMode));
    // await setDepositMode(!depositMode);
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
