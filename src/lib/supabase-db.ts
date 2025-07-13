import { supabase } from './supabase';

// Interface cho transaction input
export interface TransactionInput {
  type: 'income' | 'expense';
  date: string;
  amount: number;
  note: string;
  category_id?: string;
  user_id: string;
}

// Thêm transaction mới
export const addTransaction = async (transaction: TransactionInput) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select('*, categories(name)')
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Error adding transaction:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Lấy tất cả transactions của user hiện tại
export const getTransactions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return { data: [], error: error.message };
    }
    return { data: data || [], error: null };
  } catch (error: unknown) {
    console.error('Error fetching transactions:', error);
    return { data: [], error: (error as Error).message };
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    return { data, error };
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    return { data: [], error: (error as Error).message };
  }
};

// Cập nhật transaction
export const updateTransaction = async (
  id: string,
  updates: Partial<TransactionInput>
) => {
  try {
    // Lấy user hiện tại

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Error updating transaction:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Xóa transaction
export const deleteTransaction = async (id: string) => {
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
      console.error('Error deleting transaction:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error: unknown) {
    console.error('Error deleting transaction:', error);
    return { error: (error as Error).message };
  }
};

// Lấy thống kê transactions
export const getTransactionStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching transaction stats:', error);
      return { stats: null, error: error.message };
    }

    // Tính toán thống kê
    const income = data
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = data
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const stats = {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      transactionCount: data.length,
    };

    return { stats, error: null };
  } catch (error: unknown) {
    console.error('Error calculating transaction stats:', error);
    return { stats: null, error: (error as Error).message };
  }
};

// Alias cho addTransaction
export const addTransactions = addTransaction;
