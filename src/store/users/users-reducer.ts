import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageValue } from 'utils/local-storage';

import { User } from 'entities/User';
import { addUser } from './users-actions';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: getLocalStorageValue('user'),
};

const usersState = createSlice({
  name: 'users',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addUser.fulfilled,
      (state: UserState, { payload }: PayloadAction<User>) => {
        state.user = payload;
      },
    );
  },
});

export default usersState.reducer;
