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
import { TransactionInput } from '@/services/transaction/transaction.type';
import { selectUser } from '@/store/selectors/userSelectors';
import { setTransactionEdit } from '@/store/slices/transactionSlice';
import { Label } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, RotateCcw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAlert from '../shared/custom-alert';
import { DateTimePicker } from '../shared/DateTimePicker';
import { Checkbox } from '../ui/checkbox';

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
    credit_card: '',
  });
  const dispatch = useAppDispatch();
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );
  const categories = useAppSelector((state) => state.category.categories);
  const creditCards = useAppSelector((state) => state.creditCard.creditCards);

  const user = useAppSelector(selectUser);
  const loading = useAppSelector((state) => state.transactions.loading);

  useEffect(() => {
    if (transactionEdit && transactionEdit.type === 'expense') {
      setFormData({
        amount: transactionEdit.amount,
        description: transactionEdit.note,
        category: transactionEdit.category_id || '',
        credit_card: transactionEdit.credit_card_id || '',
      });
      setDate24(new Date(transactionEdit.date));
    }
  }, [transactionEdit]);

  const resetForm = () => {
    setFormData({ amount: 0, description: '', category: '', credit_card: '' });
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
      credit_card_id: formData.credit_card || null,
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="number"
            placeholder="Nhập số tiền"
            value={formData.amount || ''}
            onChange={(e) =>
              handleInputChange('amount', parseFloat(e.target.value) || 0)
            }
            className="text-base h-12"
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-between text-left text-sm"
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
      </div>

      {/* Mô tả */}
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder="Nhập mô tả giao dịch"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="h-12 text-base"
        />
      </div>

      {/* Danh mục */}

      {/* Ngày tháng */}
      <div className="flex flex-row gap-2">
        <DateTimePicker
          hourCycle={24}
          value={date24}
          onChange={handleDateChange}
          placeholder="Chọn ngày tháng"
          className="text-sm  h-12"
          displayFormat={{
            hour24: 'dd/MM/yyyy HH:mm',
            hour12: 'dd/MM/yyyy hh:mm a',
          }}
          granularity="minute"
        />
      </div>
      {/* Credit card */}
      {creditCards.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {creditCards.map((card) => (
            <Label
              key={card.id}
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
            >
              <Checkbox
                id={card.id}
                checked={formData.credit_card === card.id}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    credit_card: checked ? card.id : '',
                  }));
                }}
              />
              <p className="text-sm leading-none font-medium">
                {card.card_name}
              </p>
            </Label>
          ))}
        </div>
      )}
      {/* Buttons */}
      <div className="flex gap-3 ">
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
