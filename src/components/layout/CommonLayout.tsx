'use client';

import Sidebar from '@/components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchCategories,
  fetchCreditCards,
} from '@/store/slices/transactionSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const called = useRef(false);

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}

        <div className="flex items-center gap-2 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSidebar}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full "
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        <main className="flex-1 px-6">{children}</main>
      </div>
    </div>
  );
};

export default CommonLayout;
