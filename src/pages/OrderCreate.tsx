import React, { FC, useEffect, useState } from 'react';
import { Grid, Button, Typography, ListSubheader } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import { RootState } from 'store';
import { addOrder, getUserOrder } from 'store/orders';
import {
  updateSelectedLunches,
  selectedLunchDishesSelector,
} from 'store/lunches';

import { calculateDishesPrice } from 'utils/orders';

// components
import ListDishes from 'components/orders/List-Dishes';
// entities
import { Lunch } from 'entities/Lunch';
import { OrderFirebase } from 'entities/Order';
import { useTodayLunches } from './useTodayLunches';
import { isTimeForTodayLunch } from '../utils/time-helper';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const todayLunches = useTodayLunches();
  const order = useSelector((state: RootState) => state.orders.currentOrder);
  const selectedDishes = useSelector(selectedLunchDishesSelector);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  useEffect(() => {
    if (order) {
      const dishIds = order.dishes.map(
        (d: { id: string; quantity: number }) => d.id,
      );
      const lunchIds = todayLunches.map((l) => l.id);

      dispatch(updateSelectedLunches({ lunchIds, selected: true, dishIds }));
    }
    //  FIXME: array depth
    // it required todayLunches, but I don't need it
  }, [dispatch, order]);

  // recalculate order sum
  useEffect(() => {
    if (selectedDishes) {
      setCalculatedPrice(calculateDishesPrice(selectedDishes));
    }

    // FIXME: complex dept
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if (!currentUser || !selectedDishes.length) return;

    // convert dishIds to refs for firebase
    const preparedDishes = selectedDishes.map((d) => ({
      dishRef: firebaseInstance.doc(`${Collections.Dishes}/${d.id}`),
      quantity: 1, // TODO: add quantity selection to the form
    }));

    // if lunch not for today: set tomorrow (8 a.m.)
    const time = isTimeForTodayLunch()
      ? new Date()
      : new Date(new Date().setHours(32, 0, 0, 0));

    const orderData: OrderFirebase = {
      date: firebase.firestore.Timestamp.fromDate(time),
      dishes: preparedDishes,
      person: firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
    };

    if (order) orderData.id = order.id;

    try {
      await dispatch(addOrder(orderData));
      history.push('/');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
    }
  };

  const onDishSelect = (
    lunchId: string,
    selected: boolean,
    dishId?: string,
  ) => {
    let dishIds = [];

    if (!dishId) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishIds = selectedLunch.dishes.map((d) => d.id);
    } else {
      dishIds = [dishId];
    }

    dispatch(updateSelectedLunches({ lunchIds: [lunchId], selected, dishIds }));
  };

  return (
    <Grid container spacing={2}>
      {todayLunches &&
        todayLunches.map((lunch: Lunch) => (
          <Grid item xs={12} sm={6} key={lunch.name}>
            <ListSubheader component="div">{lunch.name}</ListSubheader>
            <ListDishes
              key={lunch.name}
              dishes={lunch.dishes}
              selectDish={(selected, dishId) =>
                onDishSelect(lunch.id, selected, dishId)
              }
            />
          </Grid>
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
        {order ? 'Обновить заказ' : 'Заказать'}
      </Button>
    </Grid>
  );
};

export default OrderCreate;
