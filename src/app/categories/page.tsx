'use client';
import CategoryForm from '@/components/category/CategoryForm';
import CustomAlert from '@/components/shared/custom-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { supabaseServices } from '@/services/supabase/supabase.services';
import { Category, fetchCategories } from '@/store/slices/transactionSlice';
import { List, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoriesPage = () => {
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success'
  );
  const [categoryEdit, setCategoryEdit] = useState<Category | null>(null);

  const categories = useAppSelector((state) => state.transactions.categories);
  const dispatch = useAppDispatch();
  const handleDelete = async (id: string) => {
    const result = await supabaseServices.deleteCategory(id);
    if (result.error) {
      setAlert('Danh mục đang được dùng để phân loại giao dịch');
      setAlertType('error');
    } else {
      if (result.data) {
        setAlert('Danh mục đã được xóa');
        setAlertType('success');
        dispatch(fetchCategories());
      } else {
        setAlert('Danh mục đanh được dùng không có quyền xóa');
        setAlertType('warning');
      }
    }
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleSubmit = async (data: { name: string }) => {
    if (categoryEdit) {
      const result = await supabaseServices.updateCategory(
        categoryEdit.id,
        data
      );
      if (result.error) {
        setAlert('Cập nhật danh mục thất bại');
        setAlertType('error');
      } else {
        setAlert('Danh mục đã được cập nhật');
        setAlertType('success');
        dispatch(fetchCategories());
        setCategoryEdit(null);
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } else {
      const result = await supabaseServices.addCategory(data);
      if (result.error) {
        setAlert('Thêm danh mục thất bại');
        setAlertType('error');
      } else {
        setAlert('Danh mục đã được thêm');
        setAlertType('success');
        dispatch(fetchCategories());
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setCategoryEdit(category);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Danh sách danh mục</span>
            <Badge variant="secondary">{categories.length}</Badge>
          </CardTitle>
          {alert && (
            <CustomAlert
              title={alert}
              type={alertType as 'success' | 'error' | 'warning'}
            />
          )}
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Chưa có danh mục nào
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category: Category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full`}>
                      <List size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
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
      {/* Add Category Form */}
      <CategoryForm onSubmit={handleSubmit} categoryEdit={categoryEdit} />
    </div>
  );
};

export default CategoriesPage;
