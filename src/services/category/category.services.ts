import { supabase } from '@/lib/supabase';

export const categoryServices = {
  getCategories: async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      return { data, error };
    } catch (error: unknown) {
      return { data: [], error: (error as Error).message };
    }
  },
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

  async updateCategory(id: string, category: { name: string; limit: number }) {
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
};
