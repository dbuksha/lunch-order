import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Lunch } from 'entities/Lunch';
import { DishesState } from '../dishes/dishes-reducer';

enum ActionTypes {
  FETCH_LUNCHES = 'dishes/fetchLunches',
}

const collectionRef = firebaseInstance.collection(Collections.Lunches);
const dishesCollection = firebaseInstance.collection(Collections.Dishes);

export const fetchLunches = createAsyncThunk(
  ActionTypes.FETCH_LUNCHES,
  async () => {
    const data = await collectionRef.get();
    const dishSetCollection = getCollectionEntries<Lunch>(data);

    return dishSetCollection.map((lunch) => {
      return {
        ...lunch,
        dishes: lunch.dishes.map((d) => d.id),
      };
    });
  },
);
