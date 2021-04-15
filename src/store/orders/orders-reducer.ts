import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { Order } from 'entities/Order';
import { Dish } from 'entities/Dish';
import { addOrder, getUserOrder } from './orders-actions';

const initOrder = {
  dishes: [],
};

type OrderState = {
  currentOrder: Order;
};

const initialState: OrderState = {
  currentOrder: initOrder,
};

const ordersSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    updateOrder(
      state: OrderState,
      {
        payload: { dishes, selected },
      }: PayloadAction<{
        dishes: Dish[];
        selected: boolean;
      }>,
    ) {
      const order = { ...current(state.currentOrder) };
      if (!order) return;

      const dishesMap: Map<string, Dish> = new Map(
        dishes.map((dish) => [dish.id, dish]),
      );

      if (selected) {
        const selectedDishesIds = new Set(order.dishes.map((d) => d.dish.id));

        dishesMap.forEach((dish, dishId) => {
          if (!selectedDishesIds.has(dishId)) {
            order.dishes.push({ dish, quantity: 1 });
          }
        });
      } else {
        order.dishes = order.dishes.filter((dish) => {
          return !dishesMap.has(dish.dish.id);
        });
      }

      state.currentOrder = order;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        addOrder.fulfilled,
        (state: OrderState, { payload }: PayloadAction<Order>) => {
          state.currentOrder = payload;
        },
      )
      .addCase(getUserOrder.fulfilled, (state: OrderState, action) => {
        if (action.payload) state.currentOrder = action.payload;
      });
  },
});

export const { updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
