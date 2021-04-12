import { createSelector } from '@reduxjs/toolkit';
import { calculateDishesPrice } from 'utils/orders';
import { RootState } from 'store';
import { Dish } from 'entities/Dish';
import { selectedLunchDishesSelector } from '../lunches/lunches-selectors';

export const calculatedOrderPriceSelector = createSelector<
  RootState,
  Dish[],
  number
>(selectedLunchDishesSelector, (dishes) => calculateDishesPrice(dishes));
