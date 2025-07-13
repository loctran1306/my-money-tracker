'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, TrendingUp } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateTransaction } from '@/lib/supabase-db';
import { selectUser } from '@/store/selectors/userSelectors';
import {
  addNewTransaction,
  fetchTransactions,
} from '@/store/slices/transactionSlice';
import { useEffect, useState } from 'react';
import CustomAlert from './custom-alert';

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
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success'
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );
  const loading = useAppSelector((state) => state.transactions.loading);

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
        setAlert('Lỗi khi cập nhật giao dịch');
        setAlertType('error');
      } else {
        setAlert('Giao dịch đã được cập nhật thành công');
        setAlertType('success');
      }
    } else {
      try {
        const result = await dispatch(addNewTransaction(transactionData));
        if (addNewTransaction.fulfilled.match(result)) {
          setAlert('Giao dịch đã được thêm thành công');
          setAlertType('success');
        } else {
          setAlert('Lỗi khi thêm giao dịch');
          setAlertType('error');
        }
      } catch (error: unknown) {
        if (error) {
          setAlert('Lỗi khi thêm giao dịch');
          setAlertType('error');
        }
      }
    }
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  useEffect(() => {
    if (transactionEdit) {
      setTab(transactionEdit.type);
    }
  }, [transactionEdit]);

  if (loading && isFirstLoad) {
    setTimeout(() => {
      setIsFirstLoad(false);
    }, 1000);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Thêm giao dịch mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-15 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span>Thêm giao dịch mới</span>
        </CardTitle>
        {alert && (
          <CustomAlert title={alert} type={alertType as 'success' | 'error'} />
        )}
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
