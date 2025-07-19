import { creditCardServices } from '@/services/credit/creditCard.services';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCreditCards = createAsyncThunk(
  'creditCard/fetchCreditCards',
  async (userId: string) => {
    const response = await creditCardServices.getCreditCards(userId);
    return response.data;
  }
);
