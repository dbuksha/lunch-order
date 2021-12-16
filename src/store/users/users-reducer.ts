import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserNew } from 'entities/User';
import {
  addNewUser,
  fetchUserInfo,
  fetchAllUsers,
  fetchOtherUser,
  resetOtherUser,
} from './users-actions';

export type UsersState = {
  currentUser: UserNew | null;
  users: Array<UserNew> | [];
  otherUser: UserNew | null;
};

const initialState: UsersState = {
  currentUser: null,
  users: [],
  otherUser: null,
};

const usersState = createSlice({
  name: 'users',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        addNewUser.fulfilled,
        (state: UsersState, { payload }: PayloadAction<UserNew>) => {
          state.currentUser = payload;
        },
      )
      .addCase(
        fetchUserInfo.fulfilled,
        (state: UsersState, { payload }: PayloadAction<UserNew>) => {
          state.currentUser = payload;
        },
      )
      .addCase(
        fetchAllUsers.fulfilled,
        (state: UsersState, { payload }: PayloadAction<Array<UserNew>>) => {
          state.users = payload;
        },
      )
      .addCase(
        fetchOtherUser.fulfilled,
        (state: UsersState, { payload }: PayloadAction<UserNew>) => {
          state.otherUser = payload;
        },
      )
      .addCase(resetOtherUser, (state: UsersState) => {
        state.otherUser = null;
      });
  },
});

export default usersState.reducer;
