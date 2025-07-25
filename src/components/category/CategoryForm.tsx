'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/hooks/redux';
import { Category } from '@/services/category/category.type';
import { selectUser } from '@/store/selectors/userSelectors';
import { RotateCcw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAlert from '../shared/custom-alert';

export interface TransactionData {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt?: Date;
}

interface CategoryFormProps {
  onSubmit: (data: { name: string; limit: number }) => void;
  categoryEdit: Category | null;
}

const CategoryForm = ({ onSubmit, categoryEdit }: CategoryFormProps) => {
  const [showError, setShowError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    limit: 0,
  });
  const user = useAppSelector(selectUser);

  const resetForm = () => {
    setFormData({ name: '', limit: 0 });
    setShowError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!user) {
      alert('Bạn cần đăng nhập để thêm giao dịch!');
      return;
    }

    e.preventDefault();
    if (!formData.name) {
      setShowError('Vui lòng điền tên danh mục');
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  useEffect(() => {
    if (categoryEdit) {
      setFormData({ name: categoryEdit.name, limit: categoryEdit.limit });
    }
  }, [categoryEdit]);

  const handleInputChange = (field: string, value: string | number) => {
    setShowError(null);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      {/* Alert */}
      {showError && <CustomAlert title={showError} type="warning" />}

      <div>
        <Input
          type="text"
          placeholder="Nhập tên danh mục"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="h-12 text-base"
        />
      </div>
      <div>
        <Input
          type="number"
          placeholder="Nhập hạn mức"
          value={formData.limit || ''}
          onChange={(e) =>
            handleInputChange('limit', parseFloat(e.target.value) || 0)
          }
          className="text-base h-12"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          className="flex-1 h-12"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Làm mới
        </Button>
        <Button type="submit" className="flex-1 h-12">
          <Send className="w-5 h-5 mr-2" />
          {categoryEdit ? 'Cập nhật' : 'Thêm'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
