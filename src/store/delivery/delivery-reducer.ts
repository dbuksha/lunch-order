import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DeliveryData } from 'entities/Delivery';
import { fetchDeliveryInfo } from './delivery-actions';

export type DeliveryState = {
  deliveryInfo: DeliveryData | null;
};

const initialState: DeliveryState = {
  deliveryInfo: null,
};

const deliveryState = createSlice({
  name: 'delivery',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      fetchDeliveryInfo.fulfilled,
      (state: DeliveryState, { payload }: PayloadAction<DeliveryData>) => {
        state.deliveryInfo = payload;
      },
    );
  },
});

export default deliveryState.reducer;
