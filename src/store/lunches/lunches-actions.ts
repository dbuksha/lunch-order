import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Lunch } from 'entities/Lunch';
import { DishesState } from '../dishes/dishes-reducer';
import { Dish } from '../../entities/Dish';

enum ActionTypes {
  FETCH_LUNCHES = 'dishes/fetchLunches',
}

const lunchesColleaction = firebaseInstance.collection(Collections.Lunches);
const dishesCollection = firebaseInstance.collection(Collections.Dishes);

const fetchAllDishes = async () => {
  const data = await dishesCollection.get();

  return getCollectionEntries<Dish>(data);
};

// const dishesMap: Record<string, Dish> = payload.reduce(
//   (acc: Record<string, Dish>, dish) => {
//     acc[dish.id] = dish;
//     return acc;
//   },
//   {},
// );

export const fetchLunches = createAsyncThunk(
  ActionTypes.FETCH_LUNCHES,
  async () => {
    const dishes = await fetchAllDishes();
    const data = await lunchesColleaction.get();
    const lunches = getCollectionEntries<Lunch>(data);

    const dishesMap = dishes.reduce((acc: Record<string, Dish>, dish) => {
      acc[dish.id] = dish;
      return acc;
    }, {});

    return lunches.map((lunch) => {
      return { ...lunch, dishes: lunch.dishes.map((d) => dishesMap[d.id]) };
    });
  },
);
