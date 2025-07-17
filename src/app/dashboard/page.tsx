'use client';

import CardTransaction from '@/components/transaction/CardTransaction';
import TransactionList from '@/components/transaction/TransactionList';
import TransactionStats from '@/components/transaction/TransactionStats';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchTransactions,
  fetchTransactionStats,
} from '@/store/slices/transactionSlice';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchTransactionStats(user.id));
    }
  }, [user]);

  return (
    <div>
      {/* Transaction Stats */}
      <TransactionStats />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Transaction Form */}
        <div>
          <CardTransaction />
        </div>

        {/* Transaction List */}
        <div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
