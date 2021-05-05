import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, { Collections } from 'utils/firebase';
import { setLocalStorageValue } from 'utils/local-storage';
import { showLoader, showSnackBar, hideLoader, StatusTypes } from 'store/app';

import { User } from 'entities/User';

enum ActionTypes {
  ADD_USER = 'users/addUser',
}

const collectionRef = firebaseInstance.collection(Collections.Users);

export const addUser = createAsyncThunk(
  ActionTypes.ADD_USER,
  async (payload: Omit<User, 'id'>, { dispatch }) => {
    try {
      dispatch(showLoader());
      const result = await collectionRef.add(payload);
      dispatch(hideLoader());
      dispatch(
        showSnackBar({
          status: StatusTypes.success,
          message: 'Вы успешно зарегистировались!',
        }),
      );
      const userData = { ...payload, id: result.id };
      setLocalStorageValue('user', userData);

      return userData;
    } catch (err) {
      dispatch(hideLoader());

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
