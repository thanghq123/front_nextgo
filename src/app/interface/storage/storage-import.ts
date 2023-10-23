
export interface StorageImport {
  id: number;
  inventory_id: number;
  partner_id: number;
  partner_type: number;
  trans_type: number;
  inventory_transaction_id: number;
  reason: string;
  note: string;
  status: number;
  created_by: number;
  created_at ?: Date | null;
  update_at ?: Date | null;
}
