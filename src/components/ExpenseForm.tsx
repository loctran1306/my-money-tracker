'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { TransactionInput } from '@/lib/supabase-db';
import { formatCurrency } from '@/lib/utils';
import { selectUser } from '@/store/selectors/userSelectors';
import { setTransactionEdit } from '@/store/slices/transactionSlice';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronDown, RotateCcw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateTimePicker } from './DateTimePicker';
import CustomAlert from './custom-alert';

export interface TransactionData {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt?: Date;
}

interface CategoryType {
  id: string;
  name: string;
}

interface ExpenseFormProps {
  onSubmit: (data: TransactionInput) => void;
}

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [showError, setShowError] = useState<string | null>(null);
  const [date24, setDate24] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    category: '',
  });
  const dispatch = useAppDispatch();
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );
  const categories = useAppSelector((state) => state.transactions.categories);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector((state) => state.transactions.loading);

  useEffect(() => {
    if (transactionEdit && transactionEdit.type === 'expense') {
      setFormData({
        amount: transactionEdit.amount,
        description: transactionEdit.note,
        category: transactionEdit.category_id || '',
      });
      setDate24(new Date(transactionEdit.date));
    }
  }, [transactionEdit]);

  const resetForm = () => {
    setFormData({ amount: 0, description: '', category: '' });
    setDate24(new Date());
    setShowError(null);
    dispatch(setTransactionEdit(null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!user) {
      alert('Bạn cần đăng nhập để thêm giao dịch!');
      return;
    }

    e.preventDefault();
    if (formData.amount <= 0) {
      setShowError('Vui lòng điền số tiền');
      return;
    }
    if (!formData.category) {
      setShowError('Vui lòng chọn danh mục');
      return;
    }

    const transactionData: TransactionInput = {
      type: 'expense',
      amount: formData.amount,
      note: formData.description,
      category_id: formData.category,
      date: date24 ? date24.toISOString() : new Date().toISOString(),
      user_id: user.id,
    };

    onSubmit(transactionData);
    resetForm();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setShowError(null);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate24(date);
  };

  // Helper function để lấy tên category theo ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Chọn danh mục';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert */}
      {showError && <CustomAlert title={showError} type="warning" />}

      {/* Số tiền */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Số tiền (₫)
        </label>
        <Input
          type="number"
          placeholder="Nhập số tiền"
          value={formData.amount || ''}
          onChange={(e) =>
            handleInputChange('amount', parseFloat(e.target.value) || 0)
          }
          className="text-xl font-semibold h-12"
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mô tả
        </label>
        <Input
          type="text"
          placeholder="Nhập mô tả giao dịch"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="h-12"
        />
      </div>

      {/* Danh mục */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Danh mục
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-between text-left font-normal"
            >
              <span
                className={
                  formData.category
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }
              >
                {formData.category
                  ? getCategoryName(formData.category)
                  : 'Chọn danh mục'}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]" align="start">
            <DropdownMenuLabel>Danh mục chi tiêu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category: CategoryType) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleInputChange('category', category.id)}
                className="cursor-pointer"
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Ngày tháng */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ngày tháng
        </label>
        <DateTimePicker
          hourCycle={24}
          value={date24}
          onChange={handleDateChange}
          locale={vi}
          placeholder="Chọn ngày tháng"
        />
      </div>

      {/* Preview */}
      {formData.amount > 0 && formData.description && formData.category && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Xem trước
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.category
                  ? getCategoryName(formData.category)
                  : 'Chọn danh mục'}{' '}
                •{' '}
                {date24
                  ? format(date24, 'dd/MM/yyyy HH:mm')
                  : format(new Date(), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            <span className="text-lg font-semibold text-red-600 dark:text-red-400">
              -{formatCurrency(formData.amount)}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          className="flex-1 h-12"
          disabled={loading}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Làm mới
        </Button>
        <Button type="submit" className="flex-1 h-12" disabled={loading}>
          <Send className="w-5 h-5 mr-2" />
          {transactionEdit?.id ? 'Cập nhật' : 'Thêm'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
