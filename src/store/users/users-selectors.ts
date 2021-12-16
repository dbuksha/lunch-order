import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { UserNew } from 'entities/User';
import { UsersState } from 'store/users/users-reducer';

export const getUserSelector = createSelector<
  RootState,
  UsersState,
  UserNew | null
>(
  (state) => state.users,
  (state) => state.currentUser,
);

export const getAllUserSelector = createSelector<
  RootState,
  UsersState,
  Array<UserNew> | []
>(
  (state) => state.users,
  (state) => state.users,
);

export const getOtherUserSelector = createSelector<
  RootState,
  UsersState,
  UserNew | null
>(
  (state) => state.users,
  (state) => state.otherUser,
);
