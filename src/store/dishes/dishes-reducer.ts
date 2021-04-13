import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Dish } from 'entities/Dish';
import { fetchDishes } from './dishes-actions';

export type DishesState = {
  dishes: Record<string, Dish>;
};

const initialState: DishesState = {
  dishes: {},
};

const dishesSlice = createSlice({
  name: 'dishes',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      fetchDishes.fulfilled,
      (state: DishesState, { payload }: PayloadAction<Dish[]>) => {
        const dishesMap: Record<string, Dish> = payload.reduce(
          (acc: Record<string, Dish>, dish) => {
            acc[dish.id] = dish;
            return acc;
          },
          {},
        );

        state.dishes = dishesMap;
      },
    );
  },
});

export default dishesSlice.reducer;
