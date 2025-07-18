'use client';

import Sidebar from '@/components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchCategories,
  fetchCreditCards,
} from '@/store/slices/transactionSlice';
import { logout as logoutThunk } from '@/store/slices/userSlice';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import BottomNav from '../shared/BottomNav';
import { ModeToggle } from '../shared/mode-toggle';
import { Button } from '../ui/button';
interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const called = useRef(false);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    if (user) {
      dispatch(fetchCategories());
      dispatch(fetchCreditCards(user.id));
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex ">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}

        <div className="flex items-center gap-2 p-4 justify-between">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleSidebar}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          <div className="flex items-center gap-2">
            <ModeToggle />
            {user && (
              <Button
                variant="outline"
                onClick={handleLogout}
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 "
              >
                <LogOut />
              </Button>
            )}
          </div>
        </div>

        <main className="flex-1 px-4 pb-20">{children}</main>
        {user && <BottomNav />}
      </div>
    </div>
  );
};

export default CommonLayout;
