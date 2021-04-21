import { createSlice } from '@reduxjs/toolkit';

export const statusesTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
};

export type LoadingState = {
  isLoading: boolean;
  snackbar: {
    status: 'success' | 'error' | 'warning';
    message: string;
  } | null;
};

const initialState: LoadingState = {
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
