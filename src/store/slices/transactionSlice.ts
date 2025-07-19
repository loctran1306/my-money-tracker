import { STATS_MENU } from '@/constants';
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
  credit_card_id: string | null;
  credit_cards: {
    card_name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface TransactionStats {
  [STATS_MENU.INCOME]: number;
  [STATS_MENU.EXPENSE]: number;
  [STATS_MENU.BALANCE]: number;
  [STATS_MENU.TRANSACTION]: number;
}

export interface CreditCard {
  id: string;
  card_name: string;
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
  async (
    {
      userId,
      startDate,
      endDate,
    }: {
      userId: string;
      startDate: string | Date | null;
      endDate: string | Date | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await getTransactions(userId, startDate, endDate);
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
  async (
    {
      userId,
      startDate,
      endDate,
    }: {
      userId: string;
      startDate: string | Date | null;
      endDate: string | Date | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const { stats, error } = await getTransactionStats(
        userId,
        startDate,
        endDate
      );
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

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload as unknown as Category[];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
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
