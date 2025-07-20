import { STATS_MENU } from '@/constants';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  date: string;
  amount: number;
  note: string;
  category_id: string | null;
  categories: {
    name: string;
  };
  user_id: string;
  credit_card_id: string | null;
  credit_cards: {
    card_name: string;
  };
}

export interface TransactionStats {
  [STATS_MENU.INCOME]: number;
  [STATS_MENU.EXPENSE]: number;
  [STATS_MENU.BALANCE]: number;
  [STATS_MENU.TRANSACTION]: number;
}

export interface TransactionState {
  transactions: Transaction[];
  transactionEdit: Transaction | null;
  stats: TransactionStats | null;
  loading: boolean;
  error: string | null;
}

// Interface cho transaction input
export interface TransactionInput {
  type: 'income' | 'expense';
  date: string;
  amount: number;
  note: string;
  category_id?: string;
  user_id: string;
  credit_card_id?: string | null;
}
