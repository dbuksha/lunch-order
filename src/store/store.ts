import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import lunches from './lunches';
import users from './users';
import orders from './orders';

const rootReducer = combineReducers({
  lunches,
  users,
  orders,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
