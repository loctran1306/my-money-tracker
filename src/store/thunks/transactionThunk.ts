import transactionServices from '@/services/transaction/transaction.services';
import { TransactionInput } from '@/services/transaction/transaction.type';
import { createAsyncThunk } from '@reduxjs/toolkit';

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
      const { data, error } = await transactionServices.getTransactions(
        userId,
        startDate,
        endDate
      );
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
      const { data, error } =
        await transactionServices.addTransaction(transactionData);
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
      const { data, error } = await transactionServices.updateTransaction(
        id,
        updates
      );
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
      const { error } = await transactionServices.deleteTransaction(id);
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
      const { stats, error } = await transactionServices.getTransactionStats(
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
