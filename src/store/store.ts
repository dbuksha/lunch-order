import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import dishes from './dishes';
import lunches from './lunches';
import loading from './loading';
import users from './users';
import orders from './orders';

const rootReducer = combineReducers({
  dishes,
  lunches,
  loading,
  users,
  orders,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
