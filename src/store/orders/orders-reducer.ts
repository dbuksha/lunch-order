import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { Order } from 'entities/Order';
import { Dish, OrderDish } from 'entities/Dish';
import {
  addOrder,
  deleteOrder,
  fetchOrders,
  fetchHistoryOrders,
  getUserOrder,
  getOptionOrder,
  resetOrder,
} from './orders-actions';

const initOrder = {
  dishes: [],
};

export enum UpdateQuantityAction {
  ADD,
  REMOVE,
}

export type OrderState = {
  currentOrder: Order;
  orders: Order[];
  historyOrders: Order[];
  optionOrder: Order;
};

const initialState: OrderState = {
  currentOrder: initOrder,
  orders: [],
  historyOrders: [],
  optionOrder: initOrder,
};

// preparing data to update currentOrder when quantity is changed
const getUpdatedQuantityDishesList = (
  orderDishes: OrderDish[],
  selectedDishes: Dish[],
  type: UpdateQuantityAction,
) => {
  const newDishes: OrderDish[] = [...orderDishes];
  const selectedDishesIds = selectedDishes.map((dish) => dish.id);

  return newDishes.map(({ dish, quantity }) => {
    if (selectedDishesIds.indexOf(dish.id) > -1) {
      quantity =
        type === UpdateQuantityAction.ADD ? quantity + 1 : quantity - 1;
    }

    return { dish, quantity };
  });
};

// preparing data to update currentOrder when checkbox is clicked
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
      if (dishIndex === -1) newDishes.push({ dish, quantity });
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

    updateOptionOrder(
      state: OrderState,
      {
        payload: { dishes, selected, quantity },
      }: PayloadAction<{
        dishes: Dish[];
        selected: boolean;
        quantity: number;
      }>,
    ) {
      const order = { ...current(state.optionOrder) };
      const newDishes = getUpdatedDishesList(
        order.dishes,
        selected,
        quantity,
        dishes,
      );

      return {
        ...state,
        optionOrder: {
          ...state.optionOrder,
          dishes: newDishes,
        },
      };
    },

    updateDishesQuantity(
      state: OrderState,
      {
        payload: { dishes, type },
      }: PayloadAction<{ dishes: Dish[]; type: UpdateQuantityAction }>,
    ) {
      const order = { ...current(state.currentOrder) };

      const newDishes = getUpdatedQuantityDishesList(
        order.dishes,
        dishes,
        type,
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
      .addCase(getOptionOrder.fulfilled, (state: OrderState, action) => {
        if (action.payload) state.optionOrder = action.payload;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state: OrderState, { payload }: PayloadAction<Order[]>) => {
          state.orders = payload;
        },
      )
      .addCase(
        fetchHistoryOrders.fulfilled,
        (state: OrderState, { payload }: PayloadAction<Order[]>) => {
          state.historyOrders = payload;
        },
      )
      .addCase(deleteOrder.fulfilled, (state: OrderState) => {
        state.currentOrder = initOrder;
      })
      .addCase(resetOrder, (state: OrderState) => {
        state.currentOrder = initOrder;
        state.optionOrder = initOrder;
      });
  },
});

export const {
  updateOrder,
  updateOptionOrder,
  clearOrdersList,
  updateDishesQuantity,
} = ordersSlice.actions;
export default ordersSlice.reducer;
