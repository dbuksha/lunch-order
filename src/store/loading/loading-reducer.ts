import { createSlice } from '@reduxjs/toolkit';

export type LoadingState = {
  isLoading: boolean;
};

const initialState: LoadingState = {
  isLoading: false,
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
  },
});

export const { showLoader, hideLoader } = loadingSlice.actions;
export default loadingSlice.reducer;
