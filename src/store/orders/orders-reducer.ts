import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Order } from 'entities/Order';
import { addOrder, getUserOrder } from './orders-actions';

type OrderState = {
  currentOrder: Order | null;
};

const initialState: OrderState = {
  currentOrder: null,
};

const usersState = createSlice({
  name: 'orders',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // .addCase(
      //   addOrder.fulfilled,
      //   (state: OrderState, { payload }: PayloadAction<Order>) => {
      //     state.currentOrder = payload;
      //   },
      // )
      .addCase(getUserOrder.fulfilled, (state: OrderState, action) => {
        if (action.payload) state.currentOrder = action.payload;
      });
  },
});

export default usersState.reducer;
