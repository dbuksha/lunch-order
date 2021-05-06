import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { AppState, SnackbarType } from 'store/app/app-reducer';

export const getIsLoading = createSelector<RootState, AppState, boolean>(
  (state) => state.app,
  (state) => state.isLoading,
);

export const getSnackBar = createSelector<
  RootState,
  AppState,
  SnackbarType | null
>(
  (state) => state.app,
  (state) => state.snackbar,
);
