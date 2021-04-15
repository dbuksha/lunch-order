import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Dish } from 'entities/Dish';

enum ActionTypes {
  FETCH_DISHES = 'dishes/fetchDishes',
}

const dishesCollection = firebaseInstance.collection(Collections.Dishes);

export const fetchDishes = createAsyncThunk(
  ActionTypes.FETCH_DISHES,
  async () => {
    const data = await dishesCollection.get();
    const dishes = getCollectionEntries<Dish>(data);

    return dishes.reduce((acc: Record<string, Dish>, dish) => {
      acc[dish.id] = dish;
      return acc;
    }, {});
  },
);
