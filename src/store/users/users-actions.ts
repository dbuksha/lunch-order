import { createAsyncThunk } from '@reduxjs/toolkit';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { showLoader, showSnackBar, hideLoader, StatusTypes } from 'store/app';

import { UserNew } from 'entities/User';

enum ActionTypes {
  ADD_NEW_USER = 'users/addNewUser',
  FETCH_USER_INFO = 'users/fetchUserInfo',
  FETCH_ALL_USERS = 'users/fetchAllUsers',
}

const collectionRef = firebaseInstance.collection(Collections.Users);

export const addNewUser = createAsyncThunk(
  ActionTypes.ADD_NEW_USER,
  async (user: UserNew, { dispatch }) => {
    try {
      dispatch(showLoader());
      const checkUser = await collectionRef
        .where('email', '==', user.email)
        .get();
      const usersWithCurrentEmail = getCollectionEntries<UserNew>(checkUser);

      !usersWithCurrentEmail.length && collectionRef.add(user);

      dispatch(hideLoader());

      dispatch(
        showSnackBar({
          status: StatusTypes.success,
          message: 'Вы успешно авторизовались!',
        }),
      );

      return user;
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

export const fetchUserInfo = createAsyncThunk(
  ActionTypes.FETCH_USER_INFO,
  async (email: string, { dispatch }) => {
    try {
      const data = await collectionRef.where('email', '==', email).get();
      const userData = getCollectionEntries<UserNew>(data);

      return userData[0];
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

export const fetchAllUsers = createAsyncThunk(
  ActionTypes.FETCH_ALL_USERS,
  async (_, { dispatch }) => {
    try {
      const data = await collectionRef.get();
      const users = getCollectionEntries<UserNew>(data);

      return users;
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
