'use client';

import CreditStats from '@/components/credit/CreditStats';
import CardTransaction from '@/components/transaction/CardTransaction';
import TransactionList from '@/components/transaction/TransactionList';

import TransactionStats from '@/components/transaction/TransactionStats';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">Ngân sách</span>
      <TransactionStats />
      <span className="font-bold">Thẻ</span>
      <CreditStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <TransactionList isDashboard />
        </div>
        <div className="hidden sm:block mt-8">
          <CardTransaction />
        </div>
      </div>
    </div>
  );
}
