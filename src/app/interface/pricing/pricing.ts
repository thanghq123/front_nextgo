export interface Pricing {
  id?: number;
  name: string;
  price: number;
  max_locations: number;
  max_users: number;
  expiry_day: number;
  created_at: string;
  updated_at: string;
}
