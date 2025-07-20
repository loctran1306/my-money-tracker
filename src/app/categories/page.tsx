'use client';
import CategoryForm from '@/components/category/CategoryForm';
import IconButton from '@/components/shared/IconButton';
import CustomAlert from '@/components/shared/custom-alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { categoryServices } from '@/services/category/category.services';
import { Category } from '@/services/category/category.type';
import { fetchCategories } from '@/store/thunks/categoryThunk';
import { List, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoriesPage = () => {
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success'
  );
  const [categoryEdit, setCategoryEdit] = useState<Category | null>(null);

  const categories = useAppSelector((state) => state.category.categories);
  const dispatch = useAppDispatch();
  const handleDelete = async (id: string) => {
    const result = await categoryServices.deleteCategory(id);
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
      const result = await categoryServices.updateCategory(
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
      const result = await categoryServices.addCategory(data);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
      <Card className="bg-white dark:bg-gray-800 ">
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
            <div className="grid grid-cols-1 gap-2 scroll-smooth max-h-80 overflow-y-auto">
              {categories.map((category: Category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between py-1 px-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors "
                >
                  <div className="p-2 flex items-center gap-4">
                    <div>
                      <List size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {category.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <IconButton
                      icon={<Pencil size={10} />}
                      onClick={() => handleEdit(category)}
                      style={{
                        color: 'green',
                      }}
                      size="sm"
                    />
                    <IconButton
                      icon={<Trash2 size={10} />}
                      onClick={() => handleDelete(category.id)}
                      style={{
                        color: 'red',
                      }}
                      size="sm"
                    />
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
