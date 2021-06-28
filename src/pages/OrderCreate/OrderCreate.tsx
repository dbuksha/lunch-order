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
import dayjs from 'dayjs';

import { getOrderDayNumber } from 'utils/time-helper';
import { calculateOrderPrice } from 'utils/orders';
// store
import { getCurrentOrder, getUserOrder } from 'store/orders';

// selectors
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';

// components
import ListDishes from 'pages/OrderCreate/ListDishes';
import StyledPaper from 'components/StyledPaper';
import Ruble from 'components/Ruble';

// entities
import { Lunch } from 'entities/Lunch';

import { useTodayLunches } from 'use/useTodayLunches';
import { useHandleOrder } from 'pages/OrderCreate/useHandleOrder';
import { useUpdateOrder } from 'pages/OrderCreate/useUpadteOrder';
import { getTodayDelivery } from 'store/deliveries/deliveries-selectors';
import { Alert } from '@material-ui/lab';

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
    pageTitle: {
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
  const todayLunches = useTodayLunches();
  const todayDelivery = useSelector(getTodayDelivery);
  const order = useSelector(getCurrentOrder);
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);
  const { onCreateOrderSubmit, onDeleteOrder } = useHandleOrder(
    selectedDishes,
    todayLunches,
    order,
  );
  const { onChangeDishQuantity, onDishSelect } = useUpdateOrder(todayLunches);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getUserOrder());
  }, [dispatch]);

  // recalculate order sum
  useEffect(() => {
    if (order && selectedDishes) {
      const price = calculateOrderPrice(order.dishes);
      setCalculatedPrice(price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDishes]);

  const dayName = dayjs()
    .weekday(getOrderDayNumber() - 1)
    .format('dddd');
  const isOrderInAdvance = dayjs().day() !== getOrderDayNumber();
  const isOrderDisabledForToday = !!todayDelivery && !isOrderInAdvance;

  return (
    <StyledPaper>
      <Typography className={classes.pageTitle} component="div" variant="h6">
        {dayName}
        {isOrderInAdvance && '(предварительный заказ)'}
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
          justify="flex-end"
          alignItems="baseline"
        >
          {isOrderDisabledForToday && (
            <Typography component="span" className="secondary">
              <Alert severity="warning">
                Заказ на сегодня уже был выполнен.
              </Alert>
            </Typography>
          )}
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
            disabled={!calculatedPrice || isOrderDisabledForToday}
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
