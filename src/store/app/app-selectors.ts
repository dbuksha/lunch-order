import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { AppState } from 'store/app/app-reducer';

export const getIsLoading = createSelector<RootState, AppState, boolean>(
  (state: RootState) => state.app,
  (state) => state.isLoading,
);
