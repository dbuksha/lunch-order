import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, { Collections } from 'utils/firebase';

import { Order } from 'entities/Order';

enum ActionTypes {
  ADD_ORDER = 'users/addOrder',
}

const collectionRef = firebaseInstance.collection(Collections.Orders);

export const addOrder = createAsyncThunk(
  ActionTypes.ADD_ORDER,
  async (payload: Omit<Order, 'id'>, { rejectWithValue }) => {
    try {
      const result = await collectionRef.add(payload);

      await setTimeout(() => {
        console.log('----');
      }, 5000);

      // FIXME: prepare user reference before save to state
      const orderData = { ...payload, id: result.id };

      return orderData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);
