import React, { FC, useEffect, useState } from 'react';
import { Grid, Button, Typography, ListSubheader } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import { RootState } from 'store';
import { addOrder, getUserOrder } from 'store/orders';

import { calculateDishesPrice } from 'utils/orders';

// components
import ListDishes from 'components/orders/List-Dishes';
// entities
import { Lunch, LunchState } from 'entities/Lunch';
import { OrderFirebase } from 'entities/Order';
import { Dish } from '../entities/Dish';

import { useTodayLunches } from './useTodayLunches';

const toggleDishesSelection = (
  dishes: Dish[],
  selected: boolean,
  dishId?: string,
): Dish[] => {
  return dishes.map((dish: Dish) =>
    !dishId || dishId === dish.id ? { ...dish, selected } : dish,
  );
};

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );
  const allDishes = useSelector((state: RootState) => state.dishes.dishes);
  const order = useSelector((state: RootState) => state.orders.currentOrder);

  const todayLunches = useTodayLunches();
  const [preparedSelectedDishes, setPreparedSelectedDishes] = useState<Lunch[]>(
    [],
  );
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    const prepOrder: Lunch[] = todayLunches.map((lunch: LunchState) => {
      const dishes: Dish[] = lunch.dishes.map((i: string) => ({
        ...allDishes[i],
        selected: false,
      }));
      return { ...lunch, dishes };
    });

    setPreparedSelectedDishes(prepOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(todayLunches)]);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  // FIXME: depths
  // what we need to do when we don't need to be ifluenced of object we change?
  // calls twice
  useEffect(() => {
    console.log('useEffect');
    if (order) {
      const selected = order.dishes.map((d) => d.id);
      const prepOrder: Lunch[] = preparedSelectedDishes.map((lunch: Lunch) => {
        const dishes: Dish[] = lunch.dishes.map((dish) => ({
          ...dish,
          selected: selected.indexOf(dish.id) > -1,
        }));
        return { ...lunch, dishes };
      });

      setPreparedSelectedDishes(prepOrder);
    }
    //  FIXME: array depth
  }, [order, preparedSelectedDishes]);

  // recalculate order sum
  useEffect(() => {
    if (preparedSelectedDishes) {
      const selectedDishes = preparedSelectedDishes
        .flatMap((l) => l.dishes)
        .filter((d) => d.selected);
      setCalculatedPrice(calculateDishesPrice(selectedDishes));
    }
    // FIXME: complex dept
  }, [JSON.stringify(preparedSelectedDishes)]);

  const onCreateOrderSubmit = async () => {
    // FIXME: why we need everytime this checking?
    if (!currentUser || !preparedSelectedDishes) return;

    // get selected dishes
    const selectedDishes = preparedSelectedDishes
      .flatMap((l) => l.dishes)
      .filter((d) => d.selected);

    // convert for firebase
    const preparedDishes = selectedDishes.map((d) => ({
      dishRef: firebaseInstance.doc(`${Collections.Dishes}/${d.id}`),
      quantity: 1, // TODO: add quantity selection to the form
    }));

    // TODO: add date by condition: if not for today: set date tomorrow (8 a.m.)
    const orderData: OrderFirebase = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
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
    if (!preparedSelectedDishes) return;
    const orderToUpdate: Lunch[] = [...preparedSelectedDishes];
    const selectedLunch = findLunchById(orderToUpdate, lunchId);
    if (!selectedLunch) return;

    selectedLunch.dishes = toggleDishesSelection(
      selectedLunch.dishes,
      selected,
      dishId,
    );

    setPreparedSelectedDishes(orderToUpdate);
  };

  return (
    <Grid container spacing={2}>
      {preparedSelectedDishes &&
        preparedSelectedDishes.map((lunch: Lunch) => (
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
