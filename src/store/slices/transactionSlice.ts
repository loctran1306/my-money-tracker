import {
  Transaction,
  TransactionState,
} from '@/services/transaction/transaction.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addNewTransaction,
  fetchTransactions,
  fetchTransactionStats,
  removeTransaction,
  updateExistingTransaction,
} from '../thunks/transactionThunk';

// Types

// Initial state
const initialState: TransactionState = {
  transactions: [],
  transactionEdit: null,
  stats: null,
  loading: false,
  error: null,
};

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactionEdit: (state, action: PayloadAction<Transaction | null>) => {
      state.transactionEdit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload as unknown as Transaction[];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add transaction
      .addCase(addNewTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Add new transaction to the beginning of the array
        state.transactions.unshift(action.payload);
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update transaction
      .addCase(updateExistingTransaction.fulfilled, (state, action) => {
        state.transactions = [action.payload, ...state.transactions];
      })

      // Delete transaction
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch stats
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, clearTransactions, setTransactionEdit } =
  transactionSlice.actions;
export default transactionSlice.reducer;
