import { createAsyncThunk } from '@reduxjs/toolkit';

import firebaseInstance, {
  Collections,
  getCollectionEntries,
} from 'utils/firebase';
import { Dish } from 'entities/Dish';
// import { hideLoader, showLoader, showSnackBar, StatusTypes } from 'store/app';

enum ActionTypes {
  FETCH_DISHES = 'dishes/fetchDishes',
  // ADD_DISH = 'dishes/addDish',
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

// export const addDish = createAsyncThunk(
//   ActionTypes.ADD_DISH,
//   async (newDish: Dish, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(showLoader());
//       await dishesCollection.add(newDish);

//       dispatch(
//         showSnackBar({
//           status: StatusTypes.success,
//           message: 'Новое блюдо успешно создано.',
//         }),
//       );

//       dispatch(hideLoader());
//     } catch (err) {
//       dispatch(hideLoader());
//       dispatch(
//         showSnackBar({
//           status: StatusTypes.error,
//           message: err.response.data.message,
//         }),
//       );
//       return rejectWithValue(err.response.data);
//     }
//   },
// );
