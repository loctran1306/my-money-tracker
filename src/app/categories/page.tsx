'use client';
import CategoryForm from '@/components/category/CategoryForm';
import CustomAlert from '@/components/shared/custom-alert';
import IconButton from '@/components/shared/IconButton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { categoryServices } from '@/services/category/category.services';
import { Category } from '@/services/category/category.type';
import { Transaction } from '@/services/transaction/transaction.type';
import { fetchCategories } from '@/store/thunks/categoryThunk';
import { formatCurrency } from '@/utils/func';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { List, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoriesPage = () => {
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success'
  );
  const [categoryEdit, setCategoryEdit] = useState<Category | null>(null);

  const categories = useAppSelector((state) => state.category.categories);
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );
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

  const handleSubmit = async (data: { name: string; limit: number }) => {
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
      <Collapsible className="w-full">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold">Thêm danh mục</span>
            <Badge variant="secondary">{categories.length}</Badge>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 flex flex-col gap-2">
          {alert && <CustomAlert title={alert} type={alertType} />}
          <div className="grid grid-cols-1 gap-2 scroll-smooth max-h-80 overflow-y-auto">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="flex items-center justify-between py-1 px-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors "
              >
                <div className="p-1 flex items-center gap-4">
                  <div>
                    <List size={16} />
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold text-sm">{category.name}</div>

                    {category.limit > 0 && (
                      <div className="text-xs text-gray-500">
                        - {formatCurrency(category.limit)}
                      </div>
                    )}
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
          {/* Add Category Form */}
          <CategoryForm onSubmit={handleSubmit} categoryEdit={categoryEdit} />
        </CollapsibleContent>
      </Collapsible>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Danh mục chi tiêu</span>
        {categories && categories.length > 0 && (
          <Table className="w-full">
            <TableHeader className="text-xs font-bold border rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
              <TableRow>
                <TableHead className="border w-[100px]">danh mục</TableHead>
                <TableHead className="border">Hạn mức</TableHead>
                <TableHead className="border">Chi tiêu</TableHead>
                <TableHead className="border">Còn lại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs border rounded-lg text-center bg-white dark:bg-gray-800">
              {categories.map((category: Category) => {
                const totalExpense = transactions
                  .filter(
                    (transaction: Transaction) =>
                      transaction.category_id === category.id
                  )
                  .reduce((acc, curr) => acc + curr.amount, 0);

                const remaining = category.limit
                  ? category.limit - totalExpense
                  : 0;
                return (
                  <TableRow key={category.id}>
                    <TableCell className="border text-left">
                      {category.name}
                    </TableCell>
                    <TableCell className="border">{category.limit}</TableCell>
                    <TableCell className="border">{totalExpense}</TableCell>
                    <TableCell className="border">{remaining}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
