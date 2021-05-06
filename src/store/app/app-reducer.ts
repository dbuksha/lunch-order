import { createSlice } from '@reduxjs/toolkit';

export enum StatusTypes {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export type SnackbarType = {
  status: 'success' | 'error' | 'warning';
  message: string;
};

export type AppState = {
  isLoading: boolean;
  snackbar: SnackbarType | null;
};

const initialState: AppState = {
  isLoading: false,
  snackbar: null,
};

const loadingSlice = createSlice({
  name: 'loading',

  initialState,

  reducers: {
    showLoader(state) {
      state.isLoading = true;
    },
    hideLoader(state) {
      state.isLoading = false;
    },
    showSnackBar(state, { payload }) {
      state.snackbar = payload;
    },
    clearSnackBar(state) {
      state.snackbar = null;
    },
  },
});

export const {
  showLoader,
  hideLoader,
  clearSnackBar,
  showSnackBar,
} = loadingSlice.actions;
export default loadingSlice.reducer;
