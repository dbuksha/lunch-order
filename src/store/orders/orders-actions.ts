import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
  DocumentReference,
  DocumentData,
} from 'utils/firebase';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';

import { Order, OrderFirebase } from 'entities/Order';
import { isTimeForTodayLunch } from 'utils/time-helper';
import { DishesState } from 'store/dishes';
import { UsersState } from '../users/users-reducer';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

enum ActionTypes {
  ADD_ORDER = 'orders/addOrder',
  GET_USER_ORDER = 'orders/getUserOrder',
}

// If today is later then 10:30 return condition of getting tomorrow order otherwise today's order
const isTodayOrTomorrowOrderExists = (date: number) => {
  const todayEndTime = dayjs().hour(10).minute(30).second(0);
  const todayStartTime = dayjs().hour(8).startOf('h');
  const tomorrow = dayjs().add(1, 'd').startOf('d');

  if (isTimeForTodayLunch()) {
    dayjs.extend(isBetween);
    return dayjs(date).isBetween(todayStartTime, dayjs(todayEndTime));
  }

  return isTimeForTodayLunch()
    ? dayjs(date).isBetween(todayStartTime, dayjs(todayEndTime))
    : dayjs(date).isSameOrAfter(tomorrow);
};

const collectionRef = firebaseInstance.collection(Collections.Orders);

export const addOrder = createAsyncThunk(
  ActionTypes.ADD_ORDER,
  async ({ id, ...payload }: OrderFirebase, { rejectWithValue, getState }) => {
    const {
      dishes: { dishesMap },
    } = getState() as { dishes: DishesState };

    try {
      let result: DocumentReference<DocumentData> | null = null;
      if (id) {
        await collectionRef.doc(id).update(payload);
      } else {
        result = await collectionRef.add(payload);
      }

      return {
        id: result?.id || id,
        date: payload.date.toMillis(),
        dishes: payload.dishes.map(({ quantity, dishRef }) => ({
          dish: dishesMap[dishRef.id],
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
      dishes: { dishesMap },
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
        date: order.date.toMillis(),
      }),
    );

    const selectedOrder = orders.find((order) =>
      isTodayOrTomorrowOrderExists(order.date),
    );
    if (!selectedOrder) return null;

    return {
      ...selectedOrder,
      dishes: selectedOrder.dishes.map((d) => ({
        dish: dishesMap[d.dishRef.id],
        quantity: d.quantity,
      })),
    } as Order;
  },
);
