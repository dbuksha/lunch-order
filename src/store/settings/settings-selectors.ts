import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { SettingsState } from 'store/settings';

export const getDepositModeSelector = createSelector<
  RootState,
  SettingsState,
  boolean
>(
  (state) => state.settings,
  (state) => state.deposit,
);
