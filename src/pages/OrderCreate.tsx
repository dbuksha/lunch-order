import React, { FC, useEffect } from 'react';
import { Grid, Button, Box, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import firebaseInstance from 'utils/firebase';
// store
import { RootState } from 'store';
import { fetchLunches, updateSelectedLunches } from 'store/lunches';
import {
  calculatedOrderPriceSelector,
  selectedLunchDishesSelector,
} from 'store/lunches/lunches-selectors';

import { addOrder } from 'store/orders';
// components
import ListDishes from 'components/orders/List-Dishes';
// entities
import { Lunch } from 'entities/Lunch';
import { Order } from 'entities/Order';

const dayNumber = new Date().getDay();

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state: RootState) => state.users.user);

  const lunches = useSelector((state: RootState) => state.lunches.lunches);
  const selectedDishes = useSelector(selectedLunchDishesSelector);
  const calculatedPrice = useSelector(calculatedOrderPriceSelector);

  useEffect(() => {
    dispatch(fetchLunches(dayNumber));
  }, [dispatch]);

  const onCreateOrderSubmit = async () => {
    if (!currentUser) return;

    const preparedDishes = selectedDishes.map((d) => ({
      dish: firebaseInstance.doc(`dishes/${d.id}`),
      quantity: 1, // TODO: add quantity selection to the form
    }));

    const order: Omit<Order, 'id'> = {
      date: new Date(),
      order: preparedDishes,
      person: firebaseInstance.doc(`persons/${currentUser.id}`),
    };

    try {
      await dispatch(addOrder(order));
      history.push('/');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
    }
  };

  const onDishSelect = (lunchId: string, dishId: string, value: boolean) => {
    dispatch(updateSelectedLunches({ lunchId, dishId, selected: value }));
  };

  const onSelectFullLunch = (lunchId: string, value: boolean) => {
    dispatch(updateSelectedLunches({ lunchId, selected: value }));
  };

  return (
    <Grid container spacing={2}>
      {lunches.map((lunch: Lunch) => (
        <ListDishes
          key={lunch.name}
          lunch={lunch}
          selectFullLunch={(value) => onSelectFullLunch(lunch.id, value)}
          selectDish={(dishId, value) => onDishSelect(lunch.id, dishId, value)}
        />
      ))}
      <Typography component="h6" variant="h5">
        Общая стоимость заказа: {calculatedPrice}&#8381;
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!calculatedPrice}
        onClick={onCreateOrderSubmit}
      >
        Заказать
      </Button>
    </Grid>
  );
};

export default OrderCreate;
