'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Transaction } from '@/services/transaction/transaction.type';
import { selectUser } from '@/store/selectors/userSelectors';
import { setTransactionEdit } from '@/store/slices/transactionSlice';
import { removeTransaction } from '@/store/thunks/transactionThunk';
import { formatCurrency } from '@/utils/func';
import { format } from 'date-fns';
import { Edit, ListFilter, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import IconButton from '../shared/IconButton';
import { Checkbox } from '../ui/checkbox';

type TransactionListProps = {
  isDashboard?: boolean;
};

const TransactionList = ({ isDashboard = false }: TransactionListProps) => {
  const { setOpenTransactionForm } = useContext(FilterContext);

  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { setTimeRefresh } = useContext(FilterContext);
  const { transactions, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    setTransactionList(transactions);
  }, [transactions, isDashboard]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const newTransactionList = transactions.filter((transaction) =>
        selectedCategories.includes(transaction.category_id || '')
      );
      if (selectedCategories.includes('income')) {
        const income = transactions.filter(
          (transaction) =>
            transaction.type === 'income' && transaction.credit_card_id === null
        );
        newTransactionList.push(...income);
      }
      if (selectedCategories.includes('payCreditCard')) {
        const payCreditCard = transactions.filter(
          (transaction) =>
            transaction.type === 'income' && transaction.credit_card_id !== null
        );
        newTransactionList.push(...payCreditCard);
      }
      if (selectedCategories.includes('sacombank')) {
        const payCreditCard = transactions.filter(
          (transaction) =>
            transaction.credit_card_id ===
            'be4eceec-38d7-4115-a680-c68e319031d3'
        );
        newTransactionList.push(...payCreditCard);
      }
      if (selectedCategories.includes('mbbank')) {
        const payCreditCard = transactions.filter(
          (transaction) =>
            transaction.credit_card_id ===
            '8aa3d217-1e27-467c-8e28-2f28c6ed2bdd'
        );
        newTransactionList.push(...payCreditCard);
      }
      setTransactionList(newTransactionList);
    } else {
      setTransactionList(transactions);
    }
  }, [selectedCategories, transactions]);

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

  const handleFilter = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  if (loading) {
    return (
      <Card className="w-full border-none p-0 bg-transparent shadow-none">
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
    <Card className="w-full border-none p-0 bg-transparent shadow-none mt-4">
      <div className="flex items-center justify-between">
        <span className="font-bold">Danh sách giao dịch</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setSelectedCategories([]);
              }}
            >
              <ListFilter className="h-4 w-4" color="green" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 max-h-[300px] overflow-y-auto"
            align="end"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'gray transparent',
            }}
          >
            <DropdownMenuItem
              key={'sacombank'}
              className="cursor-pointer text-sm"
              onClick={(e) => {
                e.preventDefault();
                handleFilter('sacombank');
              }}
            >
              <Checkbox
                className="mr-2"
                checked={selectedCategories.includes('sacombank')}
              />
              Thẻ SacomBank
            </DropdownMenuItem>
            <DropdownMenuItem
              key={'mbbank'}
              className="cursor-pointer text-sm"
              onClick={(e) => {
                e.preventDefault();
                handleFilter('mbbank');
              }}
            >
              <Checkbox
                className="mr-2"
                checked={selectedCategories.includes('mbbank')}
              />
              Thẻ MBBank
            </DropdownMenuItem>
            <DropdownMenuItem
              key={'income'}
              className="cursor-pointer text-sm"
              onClick={(e) => {
                e.preventDefault();
                handleFilter('income');
              }}
            >
              <Checkbox
                className="mr-2"
                checked={selectedCategories.includes('income')}
              />
              Thu nhập
            </DropdownMenuItem>
            <DropdownMenuItem
              key={'payCreditCard'}
              className="cursor-pointer text-sm"
              onClick={(e) => {
                e.preventDefault();
                handleFilter('payCreditCard');
              }}
            >
              <Checkbox
                className="mr-2"
                checked={selectedCategories.includes('payCreditCard')}
              />
              Trả thẻ
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                className="cursor-pointer text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleFilter(category.id);
                }}
              >
                <Checkbox
                  className="mr-2"
                  checked={selectedCategories.includes(category.id)}
                />
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-0">
        <div
          className={`space-y-4 max-h-[450px] overflow-y-auto ${
            isDashboard ? 'max-h-[450px]' : 'max-h-[620px] md:max-h-[980px]'
          }`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'gray transparent',
          }}
        >
          {transactionList.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-2 border rounded-lg transition-colors ${
                transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
              }`}
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
      </CardContent>
    </Card>
  );
};

export default TransactionList;
