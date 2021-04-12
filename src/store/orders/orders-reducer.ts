import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { addOrder } from './orders-actions';
import { Order } from '../../entities/Order';

type OrderState = {
  order: Order | null;
};

const initialState: OrderState = {
  order: null,
};

const usersState = createSlice({
  name: 'orders',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addOrder.fulfilled,
      (state: OrderState, { payload }: PayloadAction<Order>) => {
        state.order = payload;
      },
    );
  },
});

export default usersState.reducer;
