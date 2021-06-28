import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { setTodayDelivery } from 'store/deliveries';
import { getTodayDelivery } from 'store/deliveries/deliveries-selectors';
import { Alert } from '@material-ui/lab';

const CompleteDeliveryButton = () => {
  const dispatch = useDispatch();
  const todayDelivery = useSelector(getTodayDelivery);

  const completeOrder = () => {
    dispatch(setTodayDelivery());
  };

  if (todayDelivery) {
    return <Alert severity="success">Заказ был успешно создан</Alert>;
  }

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={completeOrder}
      fullWidth
    >
      Завершить заказ
    </Button>
  );
};

export default CompleteDeliveryButton;
