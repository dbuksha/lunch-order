import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DeliveryData } from 'entities/Delivery';
import { fetchDeliveryInfo, fetchDeliveries } from './delivery-actions';

export type DeliveryState = {
  deliveryInfo: DeliveryData | null;
  deliveries: Array<DeliveryData> | null;
};

const initialState: DeliveryState = {
  deliveryInfo: null,
  deliveries: null,
};

const deliveryState = createSlice({
  name: 'delivery',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDeliveryInfo.fulfilled,
        (state: DeliveryState, { payload }: PayloadAction<DeliveryData>) => {
          state.deliveryInfo = payload;
        },
      )
      .addCase(
        fetchDeliveries.fulfilled,
        (
          state: DeliveryState,
          { payload }: PayloadAction<Array<DeliveryData>>,
        ) => {
          state.deliveries = payload;
        },
      );
  },
});

export default deliveryState.reducer;
