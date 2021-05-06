import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { OrderState } from 'store/orders';
import { Order } from 'entities/Order';
import { SelectedDishes } from 'entities/Dish';

export const selectedOrderDishesIdsSet = createSelector<
  RootState,
  Order | null,
  SelectedDishes
>(
  (state) => state.orders.currentOrder,
  (order) => {
    const selectedDishesMap = new Map();
    if (!order) return selectedDishesMap;
    order.dishes.forEach((dish) => {
      selectedDishesMap.set(dish.dish.id, dish.quantity);
    });

    return selectedDishesMap;
  },
);

export const getCurrentOrder = createSelector<RootState, OrderState, Order>(
  (state) => state.orders,
  (state) => state.currentOrder,
);

export const getOrdersList = createSelector<RootState, OrderState, Order[]>(
  (state) => state.orders,
  (state) => state.orders,
);
