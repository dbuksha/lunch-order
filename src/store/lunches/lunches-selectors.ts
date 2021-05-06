import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { LunchesState } from 'store/lunches/lunches-reducer';
import { Lunch } from 'entities/Lunch';

export const getLunches = createSelector<RootState, LunchesState, Lunch[]>(
  (state) => state.lunches,
  (state) => state.lunches,
);
