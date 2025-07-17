'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { TransactionInput } from '@/lib/supabase-db';
import { selectUser } from '@/store/selectors/userSelectors';
import { setTransactionEdit } from '@/store/slices/transactionSlice';
import { vi } from 'date-fns/locale';
import { RotateCcw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAlert from '../shared/custom-alert';
import { DateTimePicker } from '../shared/DateTimePicker';
import { TransactionData } from './CardTransaction';

interface IncomeFormProps {
  onSubmit: (data: TransactionData) => void;
}

const IncomeForm = ({ onSubmit }: IncomeFormProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const transactionEdit = useAppSelector(
    (state) => state.transactions.transactionEdit
  );
  const loading = useAppSelector((state) => state.transactions.loading);
  const [date24, setDate24] = useState<Date | undefined>(new Date());
  const [showError, setShowError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
  });

  const resetForm = () => {
    setFormData({ amount: 0, description: '' });
    setDate24(new Date());
    setShowError(null);
    dispatch(setTransactionEdit(null));
  };

  useEffect(() => {
    if (transactionEdit && transactionEdit.type === 'income') {
      setFormData({
        amount: transactionEdit.amount,
        description: transactionEdit.note,
      });
    }
  }, [transactionEdit]);

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

    const transactionData: TransactionInput = {
      type: 'income',
      amount: formData.amount,
      note: formData.description,
      date: date24?.toISOString() || new Date().toISOString(),
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      key={transactionEdit?.id}
    >
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
          disabled={loading}
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
          disabled={loading}
        />
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
          disabled
          displayFormat={{ hour24: 'dd/MM/yyyy' }}
        />
      </div>

      {/* Preview */}
      {formData.amount > 0 && (
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
                {date24
                  ? date24.toLocaleDateString('vi-VN')
                  : new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              +{formData.amount.toLocaleString('vi-VN')}₫
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

export default IncomeForm;
