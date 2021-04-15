import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DishesMap } from 'entities/Dish';
import { fetchDishes } from './dishes-actions';

export type DishesState = {
  dishesMap: DishesMap;
};

const initialState: DishesState = {
  dishesMap: {},
};

const dishesSlice = createSlice({
  name: 'dishes',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      fetchDishes.fulfilled,
      (state: DishesState, { payload }: PayloadAction<DishesMap>) => {
        state.dishesMap = payload;
      },
    );
  },
});

export default dishesSlice.reducer;
