import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Lunch } from 'entities/Lunch';
import { fetchLunches } from './lunches-actions';

export type LunchesState = {
  lunches: Lunch[];
  isPreloaded: boolean;
};

const initialState: LunchesState = {
  lunches: [],
  isPreloaded: false,
};

const lunchesSlice = createSlice({
  name: 'lunches',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      fetchLunches.fulfilled,
      (state: LunchesState, { payload }: PayloadAction<Lunch[]>) => {
        state.lunches = payload;
        state.isPreloaded = true;
      },
    );
  },
});

export default lunchesSlice.reducer;
