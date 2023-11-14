export interface Debts {
  id?: number;
  partner_id?: number;
  partner_type?: number;
  debit_at?: Date;
  due_at?: Date;
  type?: number;
  name?: string;
  principal?: number;
  note?: string;
  status?: number;
}
