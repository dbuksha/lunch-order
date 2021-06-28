import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Delivery } from 'entities/Delivery';
import { fetchTodayDelivery, setTodayDelivery } from './deliveries-actions';

export type DeliveryState = {
  todayDelivery: Delivery | null;
};

const initialState: DeliveryState = {
  todayDelivery: null,
};

const dishesSlice = createSlice({
  name: 'deliveries',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchTodayDelivery.fulfilled,
        (state: DeliveryState, { payload }: PayloadAction<Delivery | null>) => {
          state.todayDelivery = payload;
        },
      )
      .addCase(
        setTodayDelivery.fulfilled,
        (state: DeliveryState, { payload }: PayloadAction<Delivery>) => {
          state.todayDelivery = payload;
        },
      );
  },
});

export default dishesSlice.reducer;
