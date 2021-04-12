import { createSelector } from '@reduxjs/toolkit';
import { calculateDishesPrice } from 'utils/orders';
import { RootState } from 'store';
import { Dish } from 'entities/Dish';
import { Lunch } from 'entities/Lunch';

export const selectedLunchDishesSelector = createSelector<
  RootState,
  Lunch[],
  Dish[]
>(
  (state) => state.lunches.lunches,
  (lunches) => lunches.flatMap((l) => l.dishes).filter((d) => d.selected),
);

export const calculatedOrderPriceSelector = createSelector<
  RootState,
  Dish[],
  number
>(selectedLunchDishesSelector, (dishes) => calculateDishesPrice(dishes));
