'use client';

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors/userSelectors';
import { logout as logoutThunk } from '@/store/slices/userSlice';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Check,
  CreditCard,
  Home,
  List,
  Loader2,
  LogOut,
  PieChart,
  Settings,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    description: 'Tổng quan tài chính',
  },
  {
    title: 'Danh mục',
    icon: List,
    href: '/categories',
    description: 'Quản lý danh mục',
  },
  {
    title: 'Giao dịch',
    icon: CreditCard,
    href: '/transactions',
    description: 'Quản lý giao dịch',
  },
  {
    title: 'Thống kê',
    icon: BarChart3,
    href: '/statistics',
    description: 'Biểu đồ thống kê',
  },
  {
    title: 'Phân tích',
    icon: PieChart,
    href: '/analytics',
    description: 'Phân tích chi tiêu',
  },
  {
    title: 'Báo cáo',
    icon: TrendingUp,
    href: '/reports',
    description: 'Báo cáo định kỳ',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    href: '/settings',
    description: 'Cài đặt hệ thống',
  },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading('logout');
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push('/login');
    } catch (error: unknown) {
      if (error) {
        toast.error('Đăng xuất thất bại', {
          position: 'top-right',
          style: {
            color: 'red',
          },
        });
      }
    } finally {
      setTimeout(() => {
        setLoading(null);
      }, 500);
    }
  };

  const handleNavigation = async (href: string) => {
    // Nếu đang ở trang hiện tại, không làm gì
    if (pathname === href) return;

    setLoading(href);

    try {
      await router.push(href);
      // Đóng sidebar trên mobile
      if (window.innerWidth < 768) {
        onToggle();
      }
    } catch (error: unknown) {
      if (error) {
        toast.error('Điều hướng thất bại', {
          position: 'top-right',
          style: {
            color: 'red',
          },
        });
      }
    } finally {
      // Reset loading sau một khoảng thời gian ngắn để đảm bảo UI đã cập nhật
      setTimeout(() => {
        setLoading(null);
      }, 500);
    }
  };

  const renderAvatar = (size: number = 48) => {
    if (user?.user_metadata?.avatar_url) {
      return (
        <Image
          className="rounded-full object-cover w-full h-full"
          alt="Profile Picture"
          src={user?.user_metadata?.avatar_url}
          width={size}
          height={size}
        />
      );
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                transform transition-all duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:z-auto md:flex-shrink-0
                ${isOpen ? 'md:translate-x-0' : 'md:-translate-x-0'}
                ${isOpen ? 'w-78' : 'w-20'}
            `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isOpen ? (
            <>
              <Logo />
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Logo onClick={onToggle} showText={false} />
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-2">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600"
            >
              <motion.div
                className="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="relative w-12 h-12 mr-4 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {renderAvatar(48)}
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Check className="w-2 h-2 text-white" />
                    </motion.div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {user?.user_metadata?.full_name ||
                          user?.email?.split('@')[0] ||
                          'Trần Thanh Lộc'}
                      </h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {user?.email || 'tranthanhloc130600@gmail.com'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <motion.div
                className="relative w-8 h-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {renderAvatar(32)}
                </div>
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-gray-800 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Check className="w-1.5 h-1.5 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isLoading = loading === item.href;

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`
                                        w-full justify-start h-auto p-3
                                        ${
                                          isActive
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }
                                        ${!isOpen ? 'justify-center' : ''}
                                        hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer
                                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                                    `}
                  onClick={() => handleNavigation(item.href)}
                  title={!isOpen ? item.title : undefined}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  {isOpen && (
                    <div className="text-left ml-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-70">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer ${
              !isOpen ? 'justify-center' : ''
            } ${loading === 'logout' ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleLogout}
            title={!isOpen ? 'Đăng xuất' : undefined}
            disabled={loading === 'logout'}
          >
            {loading === 'logout' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            {isOpen && <span className="ml-3">Đăng xuất</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
