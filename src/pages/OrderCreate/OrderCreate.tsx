import React, { FC, useEffect, useState } from 'react';
import { Grid, Button, Typography, ListSubheader } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import { RootState } from 'store';
import { addOrder, getUserOrder, updateOrder } from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';
import { calculateDishesPrice } from 'utils/orders';

// components
import ListDishes from 'components/orders/List-Dishes';
// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { OrderFirebase } from 'entities/Order';
import { isTimeForTodayLunch, weekdaysNames } from 'utils/time-helper';
import { useTodayLunches } from './useTodayLunches';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const [todayNumber, todayLunches] = useTodayLunches();
  const order = useSelector((state: RootState) => state.orders.currentOrder);
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  // recalculate order sum
  useEffect(() => {
    if (order && selectedDishes) {
      const dishes = order.dishes.map((d) => d.dish);
      setCalculatedPrice(calculateDishesPrice(dishes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if (!currentUser || !selectedDishes) return;

    const preparedDishes = [...selectedDishes].map((id) => ({
      dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
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

  const onDishSelect = (lunchId: string, selected: boolean, dish?: Dish) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateOrder({ dishes, selected }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <Typography gutterBottom variant="subtitle1">
          Меню на {weekdaysNames[todayNumber - 1]}
        </Typography>
      </Grid>
      {todayLunches &&
        todayLunches.map((lunch: Lunch) => (
          <Grid item xs={12} sm={6} key={lunch.name}>
            <ListSubheader component="div">{lunch.name}</ListSubheader>
            <ListDishes
              key={lunch.name}
              dishes={lunch.dishes}
              selectedDishes={selectedDishes}
              selectDish={(selected, dish) =>
                onDishSelect(lunch.id, selected, dish)
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
        {order && order.id ? 'Обновить заказ' : 'Заказать'}
      </Button>
    </Grid>
  );
};

export default OrderCreate;
