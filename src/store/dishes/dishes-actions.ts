import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from '../../utils/firebase';
import { Dish } from '../../entities/Dish';

enum ActionTypes {
  FECH_DISHES = 'dishes/fetchDishes',
}

const collectionRef = firebaseInstance.collection(Collections.Dishes);

export const fetchDishes = createAsyncThunk(
  ActionTypes.FECH_DISHES,
  async () => {
    const data = await collectionRef.get();

    return getCollectionEntries<Dish>(data);
  },
);
