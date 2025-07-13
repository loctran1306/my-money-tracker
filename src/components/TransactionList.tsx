'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/lib/utils';
import { selectUser } from '@/store/selectors/userSelectors';
import {
  fetchCategories,
  fetchTransactions,
  removeTransaction,
  setTransactionEdit,
  Transaction,
} from '@/store/slices/transactionSlice';
import { format } from 'date-fns';
import { Edit, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

const TransactionList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { transactions, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const handleDelete = async (id: string) => {
    const result = await dispatch(removeTransaction(id));
    if (result.payload) {
      toast.success('Xóa giao dịch thành công', {
        position: 'top-right',
        style: {
          color: 'green',
        },
      });
    } else {
      toast.error('Xóa giao dịch thất bại', {
        position: 'top-right',
        style: {
          color: 'red',
        },
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    dispatch(setTransactionEdit(transaction));
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
    }
  }, [user?.id, dispatch]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center p-4">Lỗi: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Danh sách giao dịch</span>
          <Badge variant="secondary">{transactions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Chưa có giao dịch nào
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.note}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                      {transaction.category_id && (
                        <span className="ml-2">
                          • {transaction.categories?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <Button
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
