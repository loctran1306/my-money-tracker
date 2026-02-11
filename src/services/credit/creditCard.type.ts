export interface CreditCard {
  id: string;
  user_id: string;
  display_name: string;
  wallet_type: string;
  initial_balance: number;
  current_balance: number;
  credit_limit: number;
  statement_day: number;
  payment_due_day: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
