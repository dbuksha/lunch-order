import { createAsyncThunk } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';

import { Order, OrderFirebase } from 'entities/Order';
import { isTimeForTodayLunch } from 'utils/time-helper';
import { User } from 'entities/User';
import { UsersState } from '../users/users-reducer';
import { DishesState } from '../dishes';

type DocumentReference = firebase.firestore.DocumentReference;

enum ActionTypes {
  FETCH_ORDERS = 'orders/fetchOrders',
  ADD_ORDER = 'orders/addOrder',
  GET_USER_ORDER = 'orders/getUserOrder',
}

// If today is later then 10:30 return condition of getting tomorrow order otherwise today's order
const isOrderForToday = (date: number) => {
  const today = Date.now();
  const tomorrow = new Date().setHours(24, 0, 0, 0);

  return isTimeForTodayLunch() ? date <= today : date >= tomorrow;
};

const collectionRef = firebaseInstance.collection(Collections.Orders);

export const addOrder = createAsyncThunk(
  ActionTypes.ADD_ORDER,
  async ({ id, ...payload }: OrderFirebase, { rejectWithValue }) => {
    try {
      // FIXME: how can I handle it without null?
      let result: DocumentReference | null = null;
      if (id) {
        await collectionRef.doc(id).update(payload);
      }
      result = await collectionRef.add(payload);

      return {
        id: result?.id || id,
        date: payload.date.toMillis(),
        dishes: payload.dishes.map(({ quantity, dishRef }) => ({
          id: dishRef.id,
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
  async (_, { getState }) => {
    const {
      users: { currentUser },
    } = getState() as { users: UsersState };

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
        date: order.date.toMillis(),
      }),
    );

    // TODO: check date condition
    const selectedOrder = orders.find((order) => isOrderForToday(order.date));
    if (!selectedOrder) return null;

    return {
      ...selectedOrder,
      dishes: selectedOrder.dishes.map((d) => ({
        id: d.dishRef.id,
        quantity: d.quantity,
      })),
    } as Order;
  },
);

export const fetchOrders = createAsyncThunk(
  ActionTypes.FETCH_ORDERS,
  async (_, { getState }) => {
    const {
      dishes: { dishesMap },
      users: { currentUser },
    } = getState() as { users: UsersState; dishes: DishesState };

    // FIXME: should I show an error message?
    if (!currentUser) return null;

    const startTime = new Date(new Date().setHours(8, 0, 0, 0));
    const endTime = new Date(new Date().setHours(10, 30, 0, 0));

    const result = await collectionRef
      .where('date', '>=', startTime)
      .where('date', '<=', endTime)
      .get();

    const orders = getCollectionEntries<OrderFirebase>(result);

    const usersCollection = firebaseInstance.collection(Collections.Users);
    const usersResult = getCollectionEntries<User>(await usersCollection.get());
    console.log(
      orders.map((order) => {
        const person = usersResult.find((u) => u.id === order.person.id);
        const dishes = order.dishes.map(({ quantity, dishRef }) => ({
          quantity,
          dish: dishesMap[dishRef.id],
        }));
        return { ...order, date: order.date.toMillis(), dishes, person };
      }),
    );

    return orders.map((order) => {
      const person = usersResult.find((u) => u.id === order.person.id);
      const dishes = order.dishes.map(({ quantity, dishRef }) => ({
        quantity,
        dish: dishesMap[dishRef.id],
      }));
      return { ...order, date: order.date.toMillis(), dishes, person };
    });
  },
);
