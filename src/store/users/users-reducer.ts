import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageValue } from 'utils/local-storage';

import { User } from 'entities/User';
import { addUser } from './users-actions';

export type UsersState = {
  currentUser: User | null;
};

const initialState: UsersState = {
  currentUser: getLocalStorageValue('user'),
};

const usersState = createSlice({
  name: 'users',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addUser.fulfilled,
      (state: UsersState, { payload }: PayloadAction<User>) => {
        state.currentUser = payload;
      },
    );
  },
});

export default usersState.reducer;
