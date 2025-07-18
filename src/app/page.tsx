'use client';

import LoadingScreen from '@/components/shared/LoadingScreen';
import { useAppSelector } from '@/hooks/redux';
import { selectUser, selectUserLoading } from '@/store/selectors/userSelectors';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  return <LoadingScreen />;
}
