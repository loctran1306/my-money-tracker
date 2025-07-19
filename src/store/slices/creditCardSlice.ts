import { CreditCard } from '@/services/credit/creditCard.type';
import { createSlice } from '@reduxjs/toolkit';
import { fetchCreditCards } from '../thunks/creditCardThunk';

export interface CreditCardState {
  creditCards: CreditCard[];
  loading: boolean;
  error: string | null;
}

const initialState: CreditCardState = {
  creditCards: [],
  loading: false,
  error: null,
};

const creditCardSlice = createSlice({
  name: 'creditCard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditCards.fulfilled, (state, action) => {
        state.loading = false;
        state.creditCards = action.payload as unknown as CreditCard[];
      })
      .addCase(fetchCreditCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = creditCardSlice.actions;
export default creditCardSlice.reducer;
