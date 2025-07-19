'use client';

import Sidebar from '@/components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCategories } from '@/store/slices/transactionSlice';

import React, { useEffect, useState } from 'react';
import BottomNav from '../shared/BottomNav';
import Header from '../shared/Header';
interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchCategories());
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex ">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <Header
          isOpen={isOpen}
          handleToggleSidebar={() => setIsOpen(!isOpen)}
        />
        <main className="flex-1 px-4 pb-20">{children}</main>
        {user && <BottomNav />}
      </div>
    </div>
  );
};

export default CommonLayout;
