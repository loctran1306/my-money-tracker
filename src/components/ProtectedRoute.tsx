'use client';

import { useAppSelector } from '@/hooks/redux';
import { selectUser, selectUserLoading } from '@/store/selectors/userSelectors';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import LoadingScreen from './shared/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Danh sách các trang công khai không cần đăng nhập
const publicRoutes = ['/login/', '/register/', '/'];

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const router = useRouter();
  const pathname = usePathname();

  // Kiểm tra xem trang hiện tại có phải là trang công khai không
  const isPublicRoute = useMemo(
    () => publicRoutes.includes(pathname),
    [pathname]
  );

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        // Nếu chưa đăng nhập và không phải trang công khai -> chuyển về login
        router.replace('/login');
      } else if (user && isPublicRoute) {
        // Nếu đã đăng nhập và đang ở trang công khai -> chuyển về dashboard
        // Thêm delay nhỏ để tránh chuyển hướng quá nhanh
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, pathname, isPublicRoute]);

  // Nếu đang loading và là trang công khai -> hiển thị nội dung ngay
  if (loading && isPublicRoute) {
    return <>{children}</>;
  }

  // Nếu đang loading và không phải trang công khai -> hiển thị loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Nếu là trang công khai -> hiển thị nội dung trực tiếp (không có CommonLayout)
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Nếu đã đăng nhập -> hiển thị nội dung với CommonLayout
  if (user) {
    return <>{children}</>;
  }

  // Nếu chưa đăng nhập và không phải trang công khai -> không hiển thị gì
  return null;
};
