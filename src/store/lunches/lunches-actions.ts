import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Lunch } from 'entities/Lunch';
import { Dish } from 'entities/Dish';

enum ActionTypes {
  FETCH_LUNCHES = 'dishes/fetchLunches',
}

const collectionRef = firebaseInstance.collection(Collections.Lunches);
const dishesCollection = firebaseInstance.collection(Collections.Dishes);

const fetchFilteredDishes = async (ids: string[]) => {
  const data = await dishesCollection.where('id', 'in', ids).get();

  return getCollectionEntries<Dish>(data);
};

export const fetchLunches = createAsyncThunk(
  ActionTypes.FETCH_LUNCHES,
  async (dayNumber: number) => {
    const data = await collectionRef.where('dayNumber', '==', dayNumber).get();

    const dishSetCollection = getCollectionEntries<Lunch>(data);

    const promises = dishSetCollection.map(async (lunch) => {
      const dishesIds: string[] = lunch.dishes.map((dish: any) => dish.id);
      let dishes = await fetchFilteredDishes(dishesIds);
      dishes = dishes.map((d) => ({ ...d, selected: false }));

      return { ...lunch, dishes };
    });

    return Promise.all(promises);
  },
);
