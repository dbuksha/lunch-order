import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { DishesState } from 'store/dishes';
import { Dish } from 'entities/Dish';

export const getDishesList = createSelector<RootState, DishesState, Dish[]>(
  (state) => state.dishes,
  (state) => Object.values(state.dishesMap),
);
