'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { selectUser, selectUserLoading } from '@/store/selectors/userSelectors';

export default function Home() {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Nếu đã đăng nhập -> redirect đến dashboard
        router.replace('/dashboard');
      } else {
        // Nếu chưa đăng nhập -> redirect đến login
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Hiển thị loading spinner trong khi đang kiểm tra auth
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Đang kiểm tra thông tin đăng nhập...
        </p>
      </div>
    </div>
  );
}
