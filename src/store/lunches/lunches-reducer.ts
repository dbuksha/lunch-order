import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash/fp';

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

  reducers: {
    updateSelectedLunches(
      state: LunchesState,
      {
        payload: { lunchIds, selected, dishIds },
      }: PayloadAction<{
        lunchIds: string[];
        selected: boolean;
        dishIds: string[];
      }>,
    ) {
      const lunches = cloneDeep(state.lunches);

      lunches.forEach((lunch) => {
        if (lunchIds.indexOf(lunch.id) > -1) {
          lunch.dishes = lunch.dishes.map((dish) =>
            dishIds.indexOf(dish.id) > -1 ? { ...dish, selected } : dish,
          );
        }
      });

      state.lunches = lunches;
    },
  },

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

export const { updateSelectedLunches } = lunchesSlice.actions;
export default lunchesSlice.reducer;
