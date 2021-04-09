import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, { Collections } from 'utils/firebase';
import { setLocalStorageValue } from 'utils/local-storage';

import { User } from 'entities/User';

enum ActionTypes {
  ADD_USER = 'users/addUser',
}

const collectionRef = firebaseInstance.collection(Collections.Users);

export const addUser = createAsyncThunk(
  ActionTypes.ADD_USER,
  async (payload: Omit<User, 'id'>) => {
    const result = await collectionRef.add(payload);
    const userData = { ...payload, id: result.id };
    setLocalStorageValue('user', userData);

    return userData;
  },
);
