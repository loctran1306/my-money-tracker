import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
