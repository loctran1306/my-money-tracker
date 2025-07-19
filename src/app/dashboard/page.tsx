'use client';

import CreditStats from '@/components/credit/CreditStats';
import CardTransaction from '@/components/transaction/CardTransaction';
import TransactionList from '@/components/transaction/TransactionList';
import TransactionStats from '@/components/transaction/TransactionStats';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchTransactions,
  fetchTransactionStats,
} from '@/store/slices/transactionSlice';
import { fetchCreditCards } from '@/store/thunks/creditCardThunk';
import { useContext, useEffect } from 'react';

export default function DashboardPage() {
  const { dateRange, timeRefresh } = useContext(FilterContext);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(
        fetchTransactions({
          userId: user.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
      );
      dispatch(
        fetchTransactionStats({
          userId: user.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
      );
      dispatch(fetchCreditCards(user.id));
    }
  }, [user, dispatch, dateRange, timeRefresh]);

  return (
    <div className="flex flex-col gap-4">
      <TransactionStats />
      <CreditStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList />
        <div className="hidden sm:block">
          <CardTransaction />
        </div>
      </div>
    </div>
  );
}
