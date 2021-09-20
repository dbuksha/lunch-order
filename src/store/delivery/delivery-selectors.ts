import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { DeliveryState } from 'store/delivery/delivery-reducer';
import { DeliveryData } from 'entities/Delivery';

export const getDeliveryInfoSelector = createSelector<
  RootState,
  DeliveryState,
  DeliveryData | null
>(
  (state) => state.delivery,
  (state) => state.deliveryInfo,
);
