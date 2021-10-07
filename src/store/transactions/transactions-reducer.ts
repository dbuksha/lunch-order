import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Transaction } from 'entities/Transaction';
import { getTransactions } from './transactions-actions';

export type TransactionsState = {
  transactions: Array<Transaction> | [];
};

const initialState: TransactionsState = {
  transactions: [],
};

const transactionsState = createSlice({
  name: 'transactions',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      getTransactions.fulfilled,
      (
        state: TransactionsState,
        { payload }: PayloadAction<Array<Transaction>>,
      ) => {
        state.transactions = payload;
      },
    );
  },
});

export default transactionsState.reducer;
