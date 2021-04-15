import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Order } from 'entities/Order';

export const selectedOrderDishesIdsSet = createSelector<
  RootState,
  Order | null,
  Set<string>
>(
  (state) => state.orders.currentOrder,
  (order) =>
    new Set(order ? Array.from(order.dishes.map(({ dish }) => dish.id)) : []),
);
