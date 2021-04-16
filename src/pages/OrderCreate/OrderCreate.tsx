import React, { FC, useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Typography,
  ListSubheader,
  Paper,
  Box,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import dayjs from 'dayjs';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import { RootState } from 'store';
import { addOrder, getUserOrder, updateOrder } from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';
import { calculateDishesPrice } from 'utils/orders';

// components
import ListDishes from 'components/orders/List-Dishes';
import StyledPaper from 'components/StyledPaper';

// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { OrderFirebase } from 'entities/Order';
import { isTimeForTodayLunch, weekdaysNames } from 'utils/time-helper';
import { useTodayLunches } from './useTodayLunches';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
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
      ? dayjs()
      : dayjs().add(1, 'day').hour(8).startOf('h');

    const orderData: OrderFirebase = {
      date: firebase.firestore.Timestamp.fromDate(time.toDate()),
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
    <StyledPaper>
      <Grid container spacing={2} justify="center">
        {todayLunches?.map((lunch: Lunch) => (
          <Grid item xs={12} sm={6} md={4} key={lunch.name}>
            <Typography
              component="div"
              variant="subtitle1"
              color="textSecondary"
            >
              {lunch.name}
            </Typography>
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
        <Grid
          item
          container
          sm={12}
          md={12}
          lg
          justify="flex-end"
          spacing={2}
          alignItems="baseline"
        >
          <Grid item xs={12} md={2}>
            <Typography component="span" variant="h6">
              Итого: <strong>{calculatedPrice}&#8381;</strong>
            </Typography>
          </Grid>
          <Grid item container xs={12} md lg sm justify="flex-end">
            <Button
              variant="contained"
              color="primary"
              disabled={!calculatedPrice}
              onClick={onCreateOrderSubmit}
            >
              {order?.id ? 'Обновить заказ' : 'Заказать'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCreateOrderSubmit}
            >
              Отменить заказ
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default OrderCreate;
