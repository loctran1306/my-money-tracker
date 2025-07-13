'use client';

import CardTransaction from '@/components/CardTransaction';
import DashboardLayout from '@/components/DashboardLayout';
import TransactionList from '@/components/TransactionList';
import TransactionStats from '@/components/TransactionStats';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Transaction Stats */}
      <TransactionStats />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Transaction Form */}
        <div>
          <CardTransaction />
        </div>

        {/* Transaction List */}
        <div>
          <TransactionList />
        </div>
      </div>
    </DashboardLayout>
  );
}
