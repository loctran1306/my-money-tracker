'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATS_MENU, STATS_MENU_TITLE } from '@/constants';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors/userSelectors';
import { fetchTransactionStats } from '@/store/thunks/transactionThunk';
import { formatCurrency } from '@/utils/func';
import { RefreshCw, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useContext } from 'react';

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
];

const TransactionStats = () => {
  const { dateRange } = useContext(FilterContext);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { stats, loading, error } = useAppSelector(
    (state) => state.transactions
  );

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(
        fetchTransactionStats({
          userId: user.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {statsMenu.map((stat) => (
        <Card key={stat.id} className="p-2 gap-2">
          <CardHeader className="flex flex-row items-center justify-between px-2">
            <CardTitle className="text-sm font-bold">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="px-2">
            <div className={`text-lg font-bold ${stat.color} `}>
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
