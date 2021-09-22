import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { showSnackBar, StatusTypes } from 'store/app';
import { DeliveryData, DeliveryDataFirebase } from 'entities/Delivery';
import { UserNew } from 'entities/User';
import dayjs from 'utils/dayjs';

enum ActionTypes {
  FETCH_DELIVERY_INFO = 'users/fetchDeliveryInfo',
  FETCH_DELIVERIES = 'users/fetchDeliveries',
}

const collectionRef = firebaseInstance.collection(Collections.Delivery);
const usersCollection = firebaseInstance.collection(Collections.Users);

export const fetchDeliveryInfo = createAsyncThunk(
  ActionTypes.FETCH_DELIVERY_INFO,
  async (_, { dispatch }) => {
    try {
      const data = await collectionRef
        .orderBy('createDate', 'desc')
        .limit(1)
        .get();

      const deliveryData = getCollectionEntries<DeliveryData>(data);

      const deliveryDataCreateDate = deliveryData[0].createDate.toMillis();

      if (
        dayjs(deliveryDataCreateDate).format('DD/MM/YYYY') !==
        dayjs().format('DD/MM/YYYY')
      ) {
        return null;
      }

      return deliveryData[0];
    } catch (err) {
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message: err.message.data.message,
        }),
      );
      return err.message.data;
    }
  },
);

export const fetchDeliveries = createAsyncThunk(
  ActionTypes.FETCH_DELIVERIES,
  async (_, { dispatch }) => {
    try {
      const data = await collectionRef.limit(10).get();
      const deliveries = getCollectionEntries<DeliveryDataFirebase>(data);

      const usersCollection = firebaseInstance.collection(Collections.Users);
      const usersResult = getCollectionEntries<UserNew>(
        await usersCollection.get(),
      );

      const deliveriesWithPayer = deliveries.map((delivery) => {
        const payer = delivery.payer
          ? usersResult.find((u) => u.id === delivery!.payer!.id)
          : null;
        return { ...delivery, payer };
      });

      return deliveriesWithPayer || null;
    } catch (err) {
      dispatch(
        showSnackBar({
          status: StatusTypes.error,
          message: err.message.data.message,
        }),
      );
      return err.message.data;
    }
  },
);
