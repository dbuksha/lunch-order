import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from '../../entities/Settings';
import { fetchSettings, setDeposit } from './settings-actions';

export type SettingsState = {
  id: string;
  deposit: boolean;
};

const initialState: SettingsState = {
  id: '',
  deposit: false,
};

const settingsSlice = createSlice({
  name: 'settings',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchSettings.fulfilled,
        (state: SettingsState, { payload }: PayloadAction<Settings>) => {
          state.id = payload.id;
          state.deposit = payload.deposit;
        },
      )
      .addCase(
        setDeposit.fulfilled,
        (state: SettingsState, { payload }: PayloadAction<boolean>) => {
          state.deposit = payload;
        },
      );
  },
});

export default settingsSlice.reducer;
