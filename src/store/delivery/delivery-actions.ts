import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { showSnackBar, StatusTypes } from 'store/app';
import { DeliveryData } from 'entities/Delivery';
// import { todayStartOrderTime } from 'utils/time-helper';
import dayjs from 'utils/dayjs';
import delivery from '.';

enum ActionTypes {
  FETCH_DELIVERY_INFO = 'users/fetchDeliveryInfo',
}

const collectionRef = firebaseInstance.collection(Collections.Delivery);

export const fetchDeliveryInfo = createAsyncThunk(
  ActionTypes.FETCH_DELIVERY_INFO,
  async (_, { dispatch }) => {
    try {
      const data = await collectionRef
        // .orderBy('createDate', 'desc')
        // .limit(1)
        .get();

      console.log('data = ', data);

      const deliveryData = getCollectionEntries<DeliveryData>(data);

      console.log('deliveryData = ', deliveryData);

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
