import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash/fp';

import { Lunch } from '../../entities/Lunch';
import { fetchLunches } from './lunches-actions';
import { Dish } from '../../entities/Dish';

type LunchesState = {
  lunches: Lunch[];
};

const initialState: LunchesState = {
  lunches: [],
};

const lunchesSlice = createSlice({
  name: 'lunches',

  initialState,

  reducers: {
    updateSelectedLunches(
      state: LunchesState,
      {
        payload: { lunchId, selected, dishId },
      }: PayloadAction<{ lunchId: string; selected: boolean; dishId?: string }>,
    ) {
      // ? do not do like that. Use lodash _.deepClone
      const lunches = cloneDeep(state.lunches);
      const selectedLunch = lunches.find(
        (lunch: Lunch) => lunch.id === lunchId,
      );
      if (!selectedLunch) return;

      selectedLunch.dishes = selectedLunch.dishes.map((dish: Dish) =>
        !dishId || dishId === dish.id ? { ...dish, selected } : dish,
      );

      state.lunches = lunches;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchLunches.fulfilled,
      (state: LunchesState, { payload }: PayloadAction<Lunch[]>) => {
        state.lunches = payload;
      },
    );
  },
});

export const { updateSelectedLunches } = lunchesSlice.actions;
export default lunchesSlice.reducer;
