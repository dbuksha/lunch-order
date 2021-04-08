import { configureStore, combineReducers } from '@reduxjs/toolkit';

// modules
import dishesReducer from './dishes';
import usersReducer from './users';

const rootReducer = combineReducers({
  dishes: dishesReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
