import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDishes } from './dishes-actions';
import { Dish } from '../../entities/Dish';

type DishMap = Record<string, Dish>;

export type DishesState = {
  dishesMap: DishMap;
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
      (state: DishesState, { payload }: PayloadAction<DishMap>) => {
        state.dishesMap = payload;
      },
    );
  },
});

export default dishesSlice.reducer;
