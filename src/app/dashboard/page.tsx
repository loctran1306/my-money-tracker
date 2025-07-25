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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <span className="font-bold">Danh sách giao dịch</span>
        <TransactionList isDashboard />
        <div className="hidden sm:block">
          <CardTransaction />
        </div>
      </div>
    </div>
  );
}
