import { createAsyncThunk } from '@reduxjs/toolkit';

import { categoryServices } from '@/services/category/category.services';

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await categoryServices.getCategories();
      if (error) {
        return rejectWithValue(error);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
