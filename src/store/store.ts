import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import app from './app';
import dishes from './dishes';
import lunches from './lunches';
import users from './users';
import orders from './orders';
import delivery from './delivery';

const rootReducer = combineReducers({
  app,
  dishes,
  lunches,
  users,
  orders,
  delivery,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
