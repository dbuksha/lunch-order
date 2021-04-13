import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';

import { Order, OrderFirebase } from 'entities/Order';
import { UsersState } from '../users/users-reducer';
import { DishesState } from '../dishes/dishes-reducer';

enum ActionTypes {
  ADD_ORDER = 'orders/addOrder',
  GET_USER_ORDER = 'orders/getUserOrder',
}

// If today is later then 10:30 return condition of getting tomorrow order otherwise today's order
const isOrderForToday = (date: number) => {
  const currentDate = Date.now();
  const endLunchOrderTime = new Date().setHours(10, 30, 0, 0);
  const tomorrow = new Date().setHours(24, 0, 0, 0);

  return currentDate < endLunchOrderTime
    ? date <= currentDate
    : date >= tomorrow;
};

const collectionRef = firebaseInstance.collection(Collections.Orders);

export const addOrder = createAsyncThunk(
  ActionTypes.ADD_ORDER,
  async (payload: OrderFirebase, { rejectWithValue, getState }) => {
    const {
      dishes: { dishes },
    } = getState() as { dishes: DishesState };

    try {
      const result = await collectionRef.add(payload);

      return {
        id: result.id,
        date: payload.date.getTime(),
        dishes: payload.dishes.map(({ quantity, dishRef }) => ({
          ...dishes[dishRef.id],
          quantity,
        })),
      } as Order;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const getUserOrder = createAsyncThunk(
  ActionTypes.GET_USER_ORDER,
  async (payload: Order | null, { getState }) => {
    const {
      users: { currentUser },
      dishes: { dishes },
    } = getState() as { users: UsersState; dishes: DishesState };

    // FIXME: should I show an error message?
    if (!currentUser) return null;

    const result = await collectionRef
      .where(
        'person',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
      )
      .get();
    const orders = getCollectionEntries<OrderFirebase>(result).map(
      ({ person, ...order }) => ({
        ...order,
        date: order.date.getDate(),
      }),
    );

    const selectedOrder = orders.find((order) => isOrderForToday(order.date));
    if (!selectedOrder) return null;

    return {
      ...selectedOrder,
      dishes: selectedOrder.dishes.map((d) => ({
        ...dishes[d.dishRef.id],
        quantity: d.quantity,
      })),
    } as Order;
  },
);
