import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import dayjs from 'utils/dayjs';
import { DeliveryFirebase, Delivery } from 'entities/Delivery';
import { hideLoader, showLoader, showSnackBar, StatusTypes } from 'store/app';
import firebase from 'firebase';

const dayStart = dayjs().startOf('day').toDate();
const dayEnd = dayjs().endOf('day').toDate();

enum ActionTypes {
  FETCH_TODAY_DELIVERY = 'deliveries/fetchTodayDelivery',
  SET_TODAY_DELIVERY = 'deliveries/setTodayDelivery',
}

const deliveriesCollection = firebaseInstance.collection(
  Collections.Deliveries,
);

export const fetchTodayDelivery = createAsyncThunk(
  ActionTypes.FETCH_TODAY_DELIVERY,
  async (_, { dispatch }) => {
    dispatch(showLoader());

    const data = await deliveriesCollection
      .where('date', '>=', dayStart)
      .where('date', '<=', dayEnd)
      .get();
    dispatch(hideLoader());
    const deliveries = getCollectionEntries<DeliveryFirebase>(data);

    if (!deliveries.length) return null;
    const todayDelivery = deliveries[0];
    return {
      ...todayDelivery,
      date: todayDelivery.date.toMillis(),
    } as Delivery;
  },
);

export const setTodayDelivery = createAsyncThunk(
  ActionTypes.SET_TODAY_DELIVERY,
  async (_, { dispatch }) => {
    const today = dayjs();
    dispatch(showLoader());
    const data = {
      date: firebase.firestore.Timestamp.fromDate(today.toDate()),
    };
    const result = await deliveriesCollection.add(data);
    dispatch(hideLoader());
    dispatch(
      showSnackBar({
        status: StatusTypes.success,
        message: 'Заказ был успешно завершен.',
      }),
    );

    return {
      id: result.id,
      date: today.valueOf(),
    } as Delivery;
  },
);
