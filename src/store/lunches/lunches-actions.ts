import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Lunch } from 'entities/Lunch';
import { DishesState } from '../dishes';

enum ActionTypes {
  FETCH_LUNCHES = 'dishes/fetchLunches',
}

const lunchesCollection = firebaseInstance.collection(Collections.Lunches);

export const fetchLunches = createAsyncThunk(
  ActionTypes.FETCH_LUNCHES,
  async (_, { getState }) => {
    const {
      dishes: { dishesMap },
    } = getState() as { dishes: DishesState };

    const data = await lunchesCollection.get();
    const lunches = getCollectionEntries<Lunch>(data);

    return lunches.map((lunch) => {
      return { ...lunch, dishes: lunch.dishes.map((d) => dishesMap[d.id]) };
    });
  },
);
