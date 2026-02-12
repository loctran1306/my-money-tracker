'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATS_MENU, STATS_MENU_TITLE } from '@/constants';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser } from '@/store/selectors/userSelectors';
import { getFinanceOverviewThunk } from '@/store/thunks/wallet.thunk';
import { formatCurrency } from '@/utils/func';
import { RefreshCw, TrendingUp, Wallet } from 'lucide-react';
import { useContext } from 'react';

const statsMenu = [
  {
    id: STATS_MENU.INCOME,
    title: STATS_MENU_TITLE[STATS_MENU.INCOME],
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: STATS_MENU.BALANCE,
    title: STATS_MENU_TITLE[STATS_MENU.BALANCE],
    icon: Wallet,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
];

const TransactionStats = () => {
  const { dateRange } = useContext(FilterContext);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { stats, loading, error } = useAppSelector(
    (state) => state.transactions
  );
  const { financeOverview } = useAppSelector((state) => state.wallet);

  const newFinanceOverview = {
    [STATS_MENU.INCOME]: financeOverview?.monthly_income,
    [STATS_MENU.BALANCE]: financeOverview?.total_assets,
  };

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(getFinanceOverviewThunk());
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
        <Card key={stat.id} className={`p-2 gap-2 ${stat.bgColor}`}>
          <CardHeader className="flex flex-row items-center justify-between px-2">
            <CardTitle className="text-sm font-bold text-gray-500">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="px-2">
            <div className={`text-lg font-bold ${stat.color} `}>
              {newFinanceOverview &&
                formatCurrency(newFinanceOverview?.[stat.id] || 0)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionStats;
