import { supabase } from '@/lib/supabase';

export const creditCardServices = {
  async getCreditCards(userId: string) {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
};
