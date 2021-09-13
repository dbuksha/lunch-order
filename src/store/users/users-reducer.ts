import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserNew } from 'entities/User';
import { addNewUser, fetchUserInfo, fetchAllUsers } from './users-actions';

export type UsersState = {
  currentUser: UserNew | null;
  users: Array<UserNew> | [];
};

const initialState: UsersState = {
  currentUser: null,
  users: [],
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
      );
  },
});

export default usersState.reducer;
