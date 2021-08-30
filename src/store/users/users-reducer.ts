import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageValue } from 'utils/local-storage';

import { User, UserNew } from 'entities/User';
import { addUser, addNewUser, fetchUserInfo } from './users-actions';

export type UsersState = {
  currentUser: User | null;
  user: UserNew | null;
};

const initialState: UsersState = {
  currentUser: getLocalStorageValue('user'),
  user: null,
};

const usersState = createSlice({
  name: 'users',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        addUser.fulfilled,
        (state: UsersState, { payload }: PayloadAction<User>) => {
          state.currentUser = payload;
        },
      )
      .addCase(
        addNewUser.fulfilled,
        (state: UsersState, { payload }: PayloadAction<UserNew>) => {
          state.user = payload;
        },
      )
      .addCase(
        fetchUserInfo.fulfilled,
        (state: UsersState, { payload }: PayloadAction<UserNew>) => {
          state.user = payload;
        },
      );
  },
});

export default usersState.reducer;
