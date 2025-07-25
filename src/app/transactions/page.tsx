'use client';

import TransactionList from '@/components/transaction/TransactionList';

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">Danh sách giao dịch</span>
      <TransactionList />
    </div>
  );
}
