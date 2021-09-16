import React, { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateOrder,
  updateDishesQuantity,
  UpdateQuantityAction,
} from 'store/orders';
import { selectedOrderDishesIdsSet } from 'store/orders/orders-selectors';

import ListDishes from 'components/ListDishes';

// entities
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';
import { useTodayLunches } from 'use/useTodayLunches';

const findLunchById = (lunches: Lunch[], lunchId: string): Lunch | null =>
  lunches.find((lunch: Lunch) => lunch.id === lunchId) || null;

const TodayLunches: FC = () => {
  const dispatch = useDispatch();
  const todayLunches = useTodayLunches();
  const selectedDishes = useSelector(selectedOrderDishesIdsSet);

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

  return (
    <>
      {todayLunches?.map((lunch: Lunch) => (
        <Grid item xs={12} sm={6} md={4} key={lunch.name}>
          <Typography component="div" variant="subtitle1" color="textSecondary">
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
    </>
  );
};

export default TodayLunches;
