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
import dayjs from 'dayjs';

import firebaseInstance, { Collections } from 'utils/firebase';
// store
import {
  addOrder,
  deleteOrder,
  getCurrentOrder,
  getUserOrder,
  updateOrder,
  updateDishesQuantity,
  UpdateQuantityAction,
} from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';
import { getUserSelector } from 'store/users/users-selectors';
import * as deliveryDataHelper from 'pages/OrdersDelivery/collectDeliveryDataHelper';

// components
import MainLayout from 'components/SiteLayout/MainLayout';
import ListDishes from 'pages/OrderCreate/ListDishes';
import StyledPaper from 'components/StyledPaper';

// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { OrderFirebase } from 'entities/Order';
import { getOrderDayNumber, isTimeForTodayLunch } from 'utils/time-helper';
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
    total: {
      width: 120,
    },
    pageTitle: {
      '&:first-letter': {
        textTransform: 'capitalize',
      },
      wordWrap: 'break-word',
    },
    main: {
      margin: '40px auto',
    },
  }),
);

const OrderCreate: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const currentUser = useSelector(getUserSelector);
  const todayLunches = useTodayLunches();
  const order = useSelector(getCurrentOrder);
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getUserOrder());
    }
  }, [currentUser]);

  // recalculate order sum
  useEffect(() => {
    if (order && selectedDishes) {
      const price = deliveryDataHelper.calculateDeliveryPrice(order.dishes);
      setCalculatedPrice(price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const onCreateOrderSubmit = async () => {
    // TODO: show an error popup
    if (!currentUser || !selectedDishes) return;
    const preparedDishes: any[] = [];

    setSendLoading(true);

    selectedDishes.forEach((quantity, id) => {
      preparedDishes.push({
        dishRef: firebaseInstance.doc(`${Collections.Dishes}/${id}`),
        quantity,
      });
    });

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
      setSendLoading(false);
      history.push('/');
    } catch (e) {
      // TODO: handle an error
      console.log(e);
      setSendLoading(false);
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
    lunchId: string,
    type: UpdateQuantityAction,
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

    dispatch(updateDishesQuantity({ dishes, type }));
  };

  const dayName = dayjs()
    .weekday(getOrderDayNumber() - 1)
    .format('dddd');

  return (
    <MainLayout>
      <StyledPaper className={classes.main}>
        <Typography className={classes.pageTitle} component="div" variant="h6">
          {dayName}
          {dayjs().day() !== getOrderDayNumber() && '(предварительный заказ)'}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
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
                selectDish={(selected, quantity, dish) =>
                  onDishSelect(lunch.id, selected, quantity, dish)
                }
                updateDishQuantity={(type, dish) =>
                  onChangeDishQuantity(lunch.id, type, dish)
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
            justifyContent="flex-end"
            alignItems="baseline"
          >
            <Typography
              component="span"
              variant="h6"
              className={(classes.item, classes.total)}
            >
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
              disabled={!calculatedPrice || sendLoading || !currentUser}
              onClick={onCreateOrderSubmit}
            >
              {order?.id ? 'Обновить заказ' : 'Заказать'}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </MainLayout>
  );
};

export default OrderCreate;
