import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
  DocumentReference,
  DocumentData,
} from 'utils/firebase';
import {
  isTimeForTodayLunch,
  todayEndOrderTime,
  todayStartOrderTime,
} from 'utils/time-helper';
import dayjs from 'utils/dayjs';
// store
import { DishesState } from 'store/dishes';
import { showLoader, hideLoader, showSnackBar, StatusTypes } from 'store/app';
import { UsersState } from 'store/users';
// entities
import { Order, OrderFirebase } from 'entities/Order';
import { UserNew } from 'entities/User';

enum ActionTypes {
  FETCH_ORDERS = 'orders/fetchOrders',
  FETCH_HISTORY_ORDERS = 'orders/fetchHistoryOrders',
  ADD_ORDER = 'orders/addOrder',
  GET_USER_ORDER = 'orders/getUserOrder',
  GET_OPTION_ORDER = 'orders/getOptionOrder',
  DELETE_ORDER = 'orders/deleteOrder',
  RESET_ORDER = 'orders/resetOrder',
}

// If today is later then 10:30 return condition of getting tomorrow order otherwise today's order
const isTodayOrTomorrowOrderExists = (date: number) => {
  const tomorrow = dayjs().add(1, 'd').startOf('d');

  return isTimeForTodayLunch()
    ? dayjs(date).isBetween(todayStartOrderTime, todayEndOrderTime)
    : dayjs(date).isSameOrAfter(tomorrow);
};

const collectionRef = firebaseInstance.collection(Collections.Orders);

export const addOrder = createAsyncThunk(
  ActionTypes.ADD_ORDER,
  async (
    { id, ...payload }: OrderFirebase,
    { rejectWithValue, getState, dispatch },
  ) => {
    const {
      dishes: { dishesMap },
    } = getState() as { dishes: DishesState };

    try {
      let result: DocumentReference<DocumentData> | null = null;
      dispatch(showLoader());
      if (id) {
        await collectionRef.doc(id).update(payload);
      } else {
        result = await collectionRef.add(payload);
      }
      dispatch(
        showSnackBar({
          status: StatusTypes.success,
          message: 'Заказ был создан успешно.',
        }),
      );
      dispatch(hideLoader());

      return {
        id: result?.id || id,
        date: payload.date.toMillis(),
        dishes: payload.dishes.map(({ quantity, dishRef }) => ({
          dish: dishesMap[dishRef.id],
          quantity,
        })),
      } as Order;
    } catch (err) {
      dispatch(hideLoader());
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message: err.response.data.message,
        }),
      );
      return rejectWithValue(err.response.data);
    }
  },
);

export const getUserOrder = createAsyncThunk(
  ActionTypes.GET_USER_ORDER,
  async (_, { getState, dispatch }) => {
    const {
      users: { currentUser },
      dishes: { dishesMap },
    } = getState() as { users: UsersState; dishes: DishesState };

    // FIXME: should I show an error message?
    if (!currentUser) return null;

    dispatch(showLoader());

    const result = await collectionRef
      .where(
        'person',
        '==',
        firebaseInstance.doc(`${Collections.Users}/${currentUser.id}`),
      )
      .get();

    dispatch(hideLoader());

    const orders = getCollectionEntries<OrderFirebase>(result).map(
      ({ person, ...order }) => {
        return {
          ...order,
          date: order.date.toMillis(),
        };
      },
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

export const getOptionOrder = createAsyncThunk(
  ActionTypes.GET_OPTION_ORDER,
  async (id: string, { getState, dispatch }) => {
    const {
      dishes: { dishesMap },
    } = getState() as { dishes: DishesState };

    // FIXME: should I show an error message?
    if (!id) return null;

    dispatch(showLoader());

    const result = await collectionRef
      .where('person', '==', firebaseInstance.doc(`${Collections.Users}/${id}`))
      .get();

    dispatch(hideLoader());

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

export const fetchOrders = createAsyncThunk(
  ActionTypes.FETCH_ORDERS,
  async (_, { getState, dispatch }) => {
    const {
      dishes: { dishesMap },
    } = getState() as { users: UsersState; dishes: DishesState };

    dispatch(showLoader());

    const result = await collectionRef
      .where('date', '>=', todayStartOrderTime.toDate())
      .get();

    dispatch(hideLoader());

    const orders = getCollectionEntries<OrderFirebase>(result);
    if (!orders.length) return [];

    const usersCollection = firebaseInstance.collection(Collections.Users);
    const usersResult = getCollectionEntries<UserNew>(
      await usersCollection.get(),
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

export const fetchHistoryOrders = createAsyncThunk(
  ActionTypes.FETCH_HISTORY_ORDERS,
  async (_, { getState, dispatch }) => {
    const {
      dishes: { dishesMap },
    } = getState() as { users: UsersState; dishes: DishesState };

    dispatch(showLoader());

    const result = await collectionRef
      .where('date', '<', todayStartOrderTime.toDate())
      .orderBy('date', 'desc')
      .limit(100)
      .get();

    dispatch(hideLoader());

    const orders = getCollectionEntries<OrderFirebase>(result);
    if (!orders.length) return [];

    const usersCollection = firebaseInstance.collection(Collections.Users);
    const usersResult = getCollectionEntries<UserNew>(
      await usersCollection.get(),
    );

    return orders.map((order) => {
      const person = usersResult.find((u) => u.id === order.person.id);
      const dishes = order.dishes.map(({ quantity, dishRef }) => ({
        quantity,
        dish: dishesMap[dishRef.id],
      }));
      return { ...order, date: order.date.toMillis(), dishes, person };
    });

    // return orderWithPerson.filter((el) => el.person);
  },
);

export const deleteOrder = createAsyncThunk(
  ActionTypes.DELETE_ORDER,
  async (id: string, { dispatch }) => {
    dispatch(showLoader());
    try {
      await collectionRef.doc(id).delete();
      dispatch(hideLoader());
    } catch ({
      response: {
        data: { message },
      },
    }) {
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message,
        }),
      );
      dispatch(hideLoader());
    }
  },
);

export const resetOrder = createAction(ActionTypes.RESET_ORDER);
