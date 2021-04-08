import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchDishes } from './dishes-actions';
import { Dish } from '../../entities/Dish';

type DishState = {
  dishes: Dish[];
};

const initialState: DishState = {
  dishes: [],
};

const dishesSlice = createSlice({
  name: 'dishes',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      fetchDishes.fulfilled,
      (state: DishState, { payload }: PayloadAction<Dish[]>) => {
        state.dishes = payload;
      },
    );
  },
});

export default dishesSlice.reducer;
