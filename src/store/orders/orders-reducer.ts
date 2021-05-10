import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { Order } from 'entities/Order';
import { Dish, OrderDish } from 'entities/Dish';
import {
  addOrder,
  deleteOrder,
  fetchOrders,
  getUserOrder,
} from './orders-actions';

const initOrder = {
  dishes: [],
};

export type OrderState = {
  currentOrder: Order;
  orders: Order[];
};

const initialState: OrderState = {
  currentOrder: initOrder,
  orders: [],
};

// preparing data to update currentOrder
const getUpdatedDishesList = (
  orderDishes: OrderDish[],
  selected: boolean,
  quantity: number,
  dishes: Dish[],
): OrderDish[] => {
  const newDishes: OrderDish[] = [...orderDishes];
  const dishesMap: Map<string, Dish> = new Map(
    dishes.map((dish) => [dish.id, dish]),
  );

  if (selected) {
    dishesMap.forEach((dish, dishId) => {
      const dishIndex = newDishes.findIndex((d) => d.dish.id === dishId);
      if (dishIndex > -1) {
        const oldQuantity = newDishes[dishIndex].quantity;
        const newQuantity =
          oldQuantity > quantity ? oldQuantity - 1 : oldQuantity + 1;

        newDishes.splice(dishIndex, 1, { dish, quantity: newQuantity });
      } else {
        newDishes.push({ dish, quantity });
      }
    });

    return newDishes;
  }

  return newDishes.filter((dish) => !dishesMap.has(dish.dish.id));
};

const ordersSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    updateOrder(
      state: OrderState,
      {
        payload: { dishes, selected, quantity },
      }: PayloadAction<{
        dishes: Dish[];
        selected: boolean;
        quantity: number;
      }>,
    ) {
      const order = { ...current(state.currentOrder) };
      const newDishes = getUpdatedDishesList(
        order.dishes,
        selected,
        quantity,
        dishes,
      );

      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          dishes: newDishes,
        },
      };
    },

    clearOrdersList(state) {
      state.orders = [];
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
      })
      .addCase(
        fetchOrders.fulfilled,
        (state: OrderState, { payload }: PayloadAction<Order[]>) => {
          state.orders = payload;
        },
      )
      .addCase(deleteOrder.fulfilled, (state: OrderState) => {
        state.currentOrder = initOrder;
      });
  },
});

export const { updateOrder, clearOrdersList } = ordersSlice.actions;
export default ordersSlice.reducer;
