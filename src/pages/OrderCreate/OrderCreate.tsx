import React, { FC, useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import {
  addOrder,
  deleteOrder,
  getCurrentOrder,
  getUserOrder,
  updateOrder,
} from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';
import { getCurrentUser } from 'store/users/users-selectors';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';

// components
import ListDishes from 'pages/OrderCreate/ListDishes';
import StyledPaper from 'components/StyledPaper';

// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { OrderFirebase } from 'entities/Order';
import {
  getOrderDayNumber,
  getDaysToAdd,
  isTimeForTodayLunch,
} from 'utils/time-helper';
import dayjs from 'utils/dayjs';
import { useTodayLunches } from 'use/useTodayLunches';
import Ruble from 'components/Ruble';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'inherit',
      },
    },
    item: {
      margin: theme.spacing(1),
    },
    h6: {
      '&:first-letter': {
        textTransform: 'capitalize',
      },
      wordWrap: 'break-word',
    },
  }),
);

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const currentUser = useSelector(getCurrentUser);
  const todayLunches = useTodayLunches();
  const order = useSelector(getCurrentOrder);
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  // recalculate order sum
  useEffect(() => {
    if (order && selectedDishes) {
      const price = deliveryDataHelper.calculateDeliveryPrice(order.dishes);
      setCalculatedPrice(price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup ?
    if (!currentUser || !selectedDishes) return;
    const preparedDishes: any[] = [];

    selectedDishes.forEach((quantity, id) => {
      preparedDishes.push({
        dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
        quantity,
      });
    });

    // if lunch not for today: set tomorrow (8 a.m.)
    const time = isTimeForTodayLunch()
      ? dayjs()
      : dayjs().add(getDaysToAdd(), 'day').hour(8).startOf('h');

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

  const onDishSelect = (
    lunchId: string,
    selected: boolean,
    quantity: number,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }

    dispatch(updateOrder({ dishes, selected, quantity }));
  };

  // TODO: show alerts
  const onDeleteOrder = () => {
    async function handleDeleteOrder() {
      if (order?.id) {
        await dispatch(deleteOrder(order.id));
        history.push('/');
      }
    }

    handleDeleteOrder();
  };

  const onChangeDishQuantity = (
    quantity: number,
    lunchId: string,
    dish?: Dish,
  ) => {
    let dishes = [];
    if (!dish) {
      const selectedLunch = findLunchById(todayLunches, lunchId);
      if (!selectedLunch) return;
      dishes = selectedLunch.dishes;
    } else {
      dishes = [dish];
    }
    dispatch(updateOrder({ dishes, selected: true, quantity }));
    //   TODO:!!
  };

  const dayName = dayjs()
    .weekday(getOrderDayNumber() - 1)
    .format('dddd');

  return (
    <StyledPaper>
      <Typography className={classes.h6} component="div" variant="h6">
        {dayName}
        {dayjs().day() !== getOrderDayNumber() && '(предварительный заказ)'}
      </Typography>

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
              changeDishQuantity={(quantity, dish) =>
                onChangeDishQuantity(quantity, lunch.id, dish)
              }
              selectedDishes={selectedDishes}
              selectDish={(selected, quantity, dish) =>
                onDishSelect(lunch.id, selected, quantity, dish)
              }
            />
          </Grid>
        ))}
        <Grid
          item
          className={classes.root}
          container
          sm={12}
          md={12}
          lg={12}
          justify="flex-end"
          alignItems="baseline"
        >
          <Typography component="span" variant="h6" className={classes.item}>
            Итого:{' '}
            <strong>
              {calculatedPrice}
              <Ruble />
            </strong>
          </Typography>
          {order?.id && (
            <Button
              className={classes.item}
              variant="outlined"
              color="secondary"
              onClick={onDeleteOrder}
            >
              Отменить заказ
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            className={classes.item}
            disabled={!calculatedPrice}
            onClick={onCreateOrderSubmit}
          >
            {order?.id ? 'Обновить заказ' : 'Заказать'}
          </Button>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default OrderCreate;
