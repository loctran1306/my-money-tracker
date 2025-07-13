import { useState, useEffect, useCallback } from 'react';
import {
  getTransactions,
  addTransactions,
  TransactionInput,
} from '@/lib/supabase-db';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    console.log('Fetching transactions for user:', user.id);

    try {
      const { notes, error } = await getTransactions();
      if (error) {
        setError(error);
      } else {
        setTransactions(notes);
        console.log('Loaded transactions:', notes);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const addNewTransaction = useCallback(
    async (transactionData: TransactionInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await addTransactions(transactionData);
      if (error) {
        throw new Error(error);
      }

      // Refresh transactions after adding
      await fetchTransactions();
      return data;
    },
    [user?.id, fetchTransactions]
  );

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    addNewTransaction,
    refetch: fetchTransactions,
  };
};
