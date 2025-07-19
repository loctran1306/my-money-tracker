'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATS_MENU, STATS_MENU_TITLE } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/lib/utils';
import { selectUser } from '@/store/selectors/userSelectors';
import { fetchCreditCards } from '@/store/thunks/creditCardThunk';
import { RefreshCw, TrendingDown, Wallet } from 'lucide-react';

const statsMenu = [
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

const CreditStats = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { creditCards, loading, error } = useAppSelector(
    (state) => state.creditCard
  );

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(fetchCreditCards(user.id));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {creditCards.map((card) =>
        statsMenu.map((stat) => {
          const title = `${stat.title} ${card.card_name.split(' ')[1].slice(0, 6)}`;
          const renderTotal = () => {
            if (stat.id === STATS_MENU.BALANCE) {
              return card.credit_limit - card.current_balance;
            }
            return card.current_balance;
          };
          return (
            <Card key={card.id + stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-bold">{title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-bold ${stat.color}`}>
                  {formatCurrency(renderTotal() || 0)}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default CreditStats;
