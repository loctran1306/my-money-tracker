import { STATS_MENU } from '@/constants';
import { supabase } from '@/lib/supabase';
import { TransactionInput } from './transaction.type';

const transactionServices = {
  // Lấy tất cả transactions của user hiện tại
  getTransactions: async (
    userId: string,
    startDate?: string | Date | null,
    endDate?: string | Date | null
  ) => {
    try {
      let query = supabase
        .from('transactions')
        .select('*, categories(name), wallets(wallet_type, display_name)')
        .eq('user_id', userId);

      // Filter theo date range nếu có
      if (startDate && endDate) {
        const start =
          typeof startDate === 'string' ? startDate : startDate.toISOString();
        const end =
          typeof endDate === 'string' ? endDate : endDate.toISOString();

        query = query.gte('date', start).lte('date', end);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }
      const newData = data.map((item) => ({
        ...item,
        wallet: Array.isArray(item.wallets) ? item.wallets[0] : item.wallets,
      }));
      return { data: newData || [], error: null };
    } catch (error: unknown) {
      return { data: [], error: (error as Error).message };
    }
  },
  // Thêm transaction mới
  addTransaction: async (transaction: TransactionInput) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select('*, categories(name)')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Cập nhật transaction
  updateTransaction: async (id: string, updates: Partial<TransactionInput>) => {
    try {
      // Lấy user hiện tại

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Xóa transaction
  deleteTransaction: async (id: string) => {
    try {
      // Lấy user hiện tại
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Chỉ cho phép xóa transaction của user hiện tại

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: unknown) {
      return { error: (error as Error).message };
    }
  },

  // Lấy thống kê transactions
  getTransactionStats: async (
    userId: string,
    startDate?: string | Date | null,
    endDate?: string | Date | null
  ) => {
    try {
      let queryStats = supabase
        .from('transactions')
        .select('type, amount, wallets(wallet_type)')
        .eq('user_id', userId);

      if (startDate && endDate) {
        const start =
          typeof startDate === 'string' ? startDate : startDate.toISOString();
        const end =
          typeof endDate === 'string' ? endDate : endDate.toISOString();

        queryStats = queryStats.gte('date', start).lte('date', end);
      }

      const { data, error } = await queryStats;

      if (error) {
        return { stats: null, error: error.message };
      }

      // Helper: Supabase có thể trả wallets là object hoặc array
      const walletType = (
        w: { wallet_type?: string } | { wallet_type?: string }[] | null
      ) => (Array.isArray(w) ? w[0]?.wallet_type : w?.wallet_type);

      // Tính toán thống kê
      const income = data
        .filter((t) => t.type === 'income' && walletType(t.wallets) === 'cash')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = data
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenseOtherCreditCard = data
        .filter((t) => t.type === 'expense' && walletType(t.wallets) === 'cash')
        .reduce((sum, t) => sum + t.amount, 0);

      const creditCard = data
        .filter((t) => t.type === 'expense' && walletType(t.wallets) !== 'cash')
        .reduce((sum, t) => sum + t.amount, 0);

      const stats = {
        [STATS_MENU.INCOME]: income,
        [STATS_MENU.EXPENSE]: expense,
        [STATS_MENU.BALANCE]: income - expenseOtherCreditCard,
        [STATS_MENU.CREDIT_CARD]: creditCard,
      };

      return { stats, error: null };
    } catch (error: unknown) {
      return { stats: null, error: (error as Error).message };
    }
  },
};

export default transactionServices;
