'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/lib/utils';
import { selectUser } from '@/store/selectors/userSelectors';
import {
  removeTransaction,
  setTransactionEdit,
  Transaction,
} from '@/store/slices/transactionSlice';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'sonner';
import IconButton from '../shared/IconButton';
import { Badge } from '../ui/badge';

const TransactionList = () => {
  const { setOpenTransactionForm } = useContext(FilterContext);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { setTimeRefresh } = useContext(FilterContext);
  const { transactions, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const handleDelete = async (id: string) => {
    if (!user) return;
    const result = await dispatch(removeTransaction(id));
    if (result.payload) {
      setTimeRefresh(Date.now());
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
    setOpenTransactionForm(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM HH:mm');
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4 h-85 sm:h-140 overflow-y-auto scroll-smooth">
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
          <div className="space-y-4 h-85 sm:h-140 overflow-y-auto scroll-smooth">
            {transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="p-2 rounded-md w-65 space-y-1">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <div
                      className={`text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+ ' : '- '}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.categories?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </div>
                  </div>

                  <div className="text-xs flex flex-row items-center justify-between gap-2">
                    <div className="text-xs text-gray-500">
                      {transaction.note}
                    </div>
                    {transaction.credit_cards && (
                      <div className="text-xs text-blue-500 italic">
                        {transaction.credit_cards.card_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    icon={<Edit size={10} />}
                    onClick={() => handleEdit(transaction)}
                    size="sm"
                    style={{
                      color: 'green',
                    }}
                  />
                  <IconButton
                    icon={<Trash2 size={10} />}
                    onClick={() => handleDelete(transaction.id)}
                    size="sm"
                    style={{
                      color: 'red',
                    }}
                  />
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
