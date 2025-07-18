'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATS_MENU, STATS_MENU_TITLE } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/lib/utils';
import { selectUser } from '@/store/selectors/userSelectors';
import { fetchTransactionStats } from '@/store/slices/transactionSlice';
import {
  BarChart3,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const statsMenu = [
  {
    id: STATS_MENU.INCOME,
    title: STATS_MENU_TITLE[STATS_MENU.INCOME],
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    id: STATS_MENU.BALANCE,
    title: STATS_MENU_TITLE[STATS_MENU.BALANCE],
    icon: Wallet,
    color: 'text-blue-600',
  },
  {
    id: STATS_MENU.EXPENSE,
    title: STATS_MENU_TITLE[STATS_MENU.EXPENSE],
    icon: TrendingDown,
    color: 'text-red-600',
  },
  {
    id: STATS_MENU.TRANSACTION,
    title: STATS_MENU_TITLE[STATS_MENU.TRANSACTION],
    icon: BarChart3,
    color: 'text-purple-600',
  },
];

const TransactionStats = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { stats, loading, error } = useAppSelector(
    (state) => state.transactions
  );

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(fetchTransactionStats(user.id));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-red-500 text-center">
            Lỗi khi tải thống kê: {error}
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsMenu.map((stat) => (
        <Card key={stat.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
            <CardTitle className="text-sm font-bold">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.id !== STATS_MENU.TRANSACTION
                ? formatCurrency(stats?.[stat.id] || 0)
                : stats?.[stat.id] || 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionStats;
