import { createAsyncThunk } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import Cookies from 'js-cookie';
import { setLocalStorageValue } from 'utils/local-storage';
import { showLoader, showSnackBar, hideLoader, StatusTypes } from 'store/app';

import { User, UserNew } from 'entities/User';
import { logout } from '../../utils/checkAuth';

enum ActionTypes {
  ADD_USER = 'users/addUser',
  ADD_NEW_USER = 'users/addNewUser',
  FETCH_USER_INFO = 'users/fetchUserInfo',
}

const collectionRef = firebaseInstance.collection(Collections.UsersNew);

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
  async (_, { dispatch }) => {
    try {
      const token = Cookies.get('token');
      let userData;

      if (token) {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            const data = await collectionRef
              .where('email', '==', user.email)
              .get();
            const currentUser = getCollectionEntries<UserNew>(data);

            console.log(currentUser);
          } else {
            // logout
            await logout();
            userData = null;
          }
        });
      } else {
        // logout
        await logout();
        userData = null;
      }

      return userData;
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
