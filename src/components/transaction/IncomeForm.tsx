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
        <Input
          type="number"
          placeholder="Nhập số tiền"
          value={formData.amount || ''}
          onChange={(e) =>
            handleInputChange('amount', parseFloat(e.target.value) || 0)
          }
          className="text-sm h-12"
          disabled={loading}
        />
      </div>

      {/* Mô tả */}
      <div>
        <Input
          type="text"
          placeholder="Nhập mô tả giao dịch"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="h-12 text-sm"
          disabled={loading}
        />
      </div>

      {/* Ngày tháng */}
      <div>
        <DateTimePicker
          hourCycle={24}
          value={date24}
          onChange={handleDateChange}
          locale={vi}
          placeholder="Chọn ngày tháng"
          className="h-12"
          displayFormat={{
            hour24: 'dd/MM/yyyy HH:mm',
            hour12: 'dd/MM/yyyy hh:mm a',
          }}
          granularity="minute"
        />
      </div>

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

export default IncomeForm;
