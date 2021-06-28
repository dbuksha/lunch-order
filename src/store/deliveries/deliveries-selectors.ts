import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { Delivery } from 'entities/Delivery';
import { DeliveryState } from 'store/deliveries/deliveries-reducer';

export const getTodayDelivery = createSelector<
  RootState,
  DeliveryState,
  Delivery | null
>(
  (state) => state.deliveries,
  (state) => state.todayDelivery,
);
