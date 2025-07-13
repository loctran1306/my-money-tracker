'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  addNewTransaction,
  fetchTransactions,
  Transaction,
} from '@/store/slices/transactionSlice';
import { selectUser } from '@/store/selectors/userSelectors';
import { useEffect, useState } from 'react';
import { TransactionInput, updateTransaction } from '@/lib/supabase-db';

export interface TransactionData {
  type: 'income' | 'expense';
  amount: number;
  note: string;
  category_id?: string;
  date: string;
  user_id: string;
}

const CardTransaction = () => {
  const [tab, setTab] = useState<'expense' | 'income'>('expense');

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );

  // Fetch transactions when user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
    }
  }, [user?.id, dispatch]);

  const handleSubmit = async (transactionData: TransactionData) => {
    if (transactionEdit) {
      const newTransactionData = {
        ...transactionData,
        updated_at: new Date().toISOString(),
      };
      const result = await updateTransaction(
        transactionEdit.id,
        newTransactionData
      );
      if (result.error) {
        console.error('Lỗi khi cập nhật giao dịch:', result.error);
      } else {
        console.log('Giao dịch đã được cập nhật thành công:', result.data);
      }
    } else {
      try {
        const result = await dispatch(addNewTransaction(transactionData));
        if (addNewTransaction.fulfilled.match(result)) {
          console.log('Giao dịch đã được thêm thành công:', result.payload);
        } else {
          console.error('Lỗi khi thêm giao dịch:', result.payload);
        }
      } catch (error) {
        console.error('Lỗi khi thêm giao dịch:', error);
      }
    }
  };

  useEffect(() => {
    if (transactionEdit) {
      setTab(transactionEdit.type);
    }
  }, [transactionEdit]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span>Thêm giao dịch mới</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="expense"
              className="flex items-center gap-2"
              onClick={() => setTab('expense')}
            >
              <TrendingDown className="w-4 h-4" />
              Chi tiêu
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="flex items-center gap-2"
              onClick={() => setTab('income')}
            >
              <TrendingUp className="w-4 h-4" />
              Thu nhập
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <ExpenseForm onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="income">
            <IncomeForm onSubmit={handleSubmit} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CardTransaction;
