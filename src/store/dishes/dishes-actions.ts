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

export const addNewDishes = createAsyncThunk('add', async () => {
  const data = [
    {
      name: 'Суп с зеленым горошком',
      price: 60,
      weight: 250,
    },
    {
      name: 'Суп пюре грибной',
      price: 60,
      weight: 250,
    },
    {
      name: 'Суп с вермишелью',
      price: 60,
      weight: 250,
    },
    {
      name: 'Борщ со свининой',
      price: 60,
      weight: 250,
    },
    {
      name: 'Суп из цветной капусты',
      price: 60,
      weight: 250,
    },

    {
      name: 'Соус куриный',
      price: 60,
      weight: 250,
    },
  ];

  data.forEach((d) => {
    dishesCollection.add(d);
  });
});
