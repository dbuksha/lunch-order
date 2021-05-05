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

type OrderState = {
  currentOrder: Order;
  orders: Order[];
};

const initialState: OrderState = {
  currentOrder: initOrder,
  orders: [],
};

// preparing data to update currentOrder
const getUpdatedDishesList = (
  oldDishes: OrderDish[],
  selected: boolean,
  dishes: Dish[],
): OrderDish[] => {
  let newDishes: OrderDish[] = [];
  const dishesMap: Map<string, Dish> = new Map(
    dishes.map((dish) => [dish.id, dish]),
  );

  if (selected) {
    const selectedDishesIds = new Set(oldDishes.map((d) => d.dish.id));
    const dishesToAdd: OrderDish[] = Object.assign([], oldDishes);

    dishesMap.forEach((dish, dishId) => {
      if (!selectedDishesIds.has(dishId)) {
        dishesToAdd.push({ dish, quantity: 1 });
      }

      newDishes = dishesToAdd;
    });
  } else {
    newDishes = newDishes.filter((dish) => {
      return !dishesMap.has(dish.dish.id);
    });
  }

  return newDishes;
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
      const newDishes = getUpdatedDishesList(order.dishes, selected, dishes);

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
