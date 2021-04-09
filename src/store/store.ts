import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import dishesReducer from './dishes';
import lunchesReducer from './lunches';
import usersReducer from './users';

const rootReducer = combineReducers({
  dishes: dishesReducer,
  lunches: lunchesReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
