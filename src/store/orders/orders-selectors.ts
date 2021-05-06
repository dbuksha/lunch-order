import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { OrderState } from 'store/orders';
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

export const getCurrentOrder = createSelector<RootState, OrderState, Order>(
  (state) => state.orders,
  (state) => state.currentOrder,
);

export const getOrdersList = createSelector<RootState, OrderState, Order[]>(
  (state) => state.orders,
  (state) => state.orders,
);
