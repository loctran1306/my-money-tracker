export interface CreditCard {
  card_name: string;
  created_at: string;
  credit_limit: number;
  current_balance: number;
  current_due_date: string;
  current_statement_end: string;
  current_statement_start: string;
  due_day: number;
  id: string;
  is_active: boolean;
  statement_day: number;
  updated_at: string;
  user_id: string;
}
