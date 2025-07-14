import { supabase } from '@/lib/supabase';

export const supabaseServices = {
  // Thêm transaction mới
  async addCategory(category: { name: string }) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select('*')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  },
  async deleteCategory(id: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  },

  async updateCategory(id: string, category: { name: string }) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch (error: unknown) {
      return { data: null, error: (error as Error).message };
    }
  },
  async getCreditCards(userId: string) {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('id, card_name')
      .eq('user_id', userId);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
};
