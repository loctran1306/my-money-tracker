import {
  addTransaction,
  deleteTransaction,
  getCategories,
  getTransactions,
  getTransactionStats,
  TransactionInput,
  updateTransaction,
} from '@/lib/supabase-db';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  date: string;
  amount: number;
  note: string;
  category_id: string | null;
  categories: {
    name: string;
  };
  user_id: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface TransactionState {
  transactions: Transaction[];
  transactionEdit: Transaction | null;
  categories: Category[];
  stats: TransactionStats | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  transactionEdit: null,
  categories: [],
  stats: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await getTransactions(userId);
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await getCategories();
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addNewTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData: TransactionInput, { rejectWithValue }) => {
    try {
      const { data, error } = await addTransaction(transactionData);
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateExistingTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (
    { id, updates }: { id: string; updates: Partial<TransactionInput> },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await updateTransaction(id, updates);
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await deleteTransaction(id);
      if (error) {
        return rejectWithValue(error);
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTransactionStats = createAsyncThunk(
  'transactions/fetchStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { stats, error } = await getTransactionStats(userId);
      if (error) {
        return rejectWithValue(error);
      }
      return stats;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
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
