'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, TrendingUp } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';

import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateTransaction } from '@/lib/supabase-db';
import { showToast } from '@/lib/toast';
import { addNewTransaction } from '@/store/slices/transactionSlice';
import { useContext, useEffect, useState } from 'react';
import LoadingChildScreen from '../shared/LoadingChildScreen';

export interface TransactionData {
  type: 'income' | 'expense';
  amount: number;
  note: string;
  category_id?: string;
  date: string;
  user_id: string;
}

const CardTransaction = () => {
  const { setTimeRefresh } = useContext(FilterContext);
  const [tab, setTab] = useState<'expense' | 'income'>('expense');

  const dispatch = useAppDispatch();
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );
  const loading = useAppSelector((state) => state.transactions.loading);
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
        showToast.error('Lỗi khi cập nhật giao dịch');
      } else {
        showToast.success('Giao dịch đã được cập nhật thành công');
        setTimeRefresh(Date.now());
      }
    } else {
      try {
        const result = await dispatch(addNewTransaction(transactionData));
        setTimeRefresh(Date.now());
        if (addNewTransaction.fulfilled.match(result)) {
          showToast.success('Giao dịch đã được thêm thành công');
        } else {
          showToast.error('Lỗi khi thêm giao dịch');
        }
      } catch (error: unknown) {
        if (error) {
          showToast.error('Lỗi khi thêm giao dịch');
        }
      }
    }
  };

  useEffect(() => {
    if (transactionEdit) {
      setTab(transactionEdit.type);
    }
  }, [transactionEdit]);

  return (
    <Card className="w-full relative">
      {loading && <LoadingChildScreen />}
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
