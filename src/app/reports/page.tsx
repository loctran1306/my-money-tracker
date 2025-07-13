'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Báo cáo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Xem báo cáo định kỳ về tài chính
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Trang báo cáo đang được phát triển!
        </p>
      </div>
    </DashboardLayout>
  );
}
