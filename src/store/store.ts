import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import app from './app';
import settings from './settings';
import dishes from './dishes';
import lunches from './lunches';
import users from './users';
import orders from './orders';
import delivery from './delivery';
import transactions from './transactions';

const rootReducer = combineReducers({
  app,
  settings,
  dishes,
  lunches,
  users,
  orders,
  delivery,
  transactions,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
