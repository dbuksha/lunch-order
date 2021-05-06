import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { User } from 'entities/User';
import { UsersState } from 'store/users/users-reducer';

export const getCurrentUser = createSelector<
  RootState,
  UsersState,
  User | null
>(
  (state) => state.users,
  (state) => state.currentUser,
);
