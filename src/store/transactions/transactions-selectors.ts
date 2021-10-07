import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { TransactionsState } from 'store/transactions';
import { Transaction } from 'entities/Transaction';

export const getTransactionsSelector = createSelector<
  RootState,
  TransactionsState,
  Transaction[]
>(
  (state) => state.transactions,
  (state) => state.transactions,
);
