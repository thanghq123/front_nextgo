export interface Config {
  business_name: string;
  tel?: string;
  email?: string;
  business_field_code?: string;
  business_field_type?: number | string;
  business_registration?: string;
  license_date?: Date;
  license_address?: string;
  province_code?: string;
  district_code?: string;
  ward_code?: string;
  address_detail: string;
  logo?: string;
  created_at: Date;
  updated_at: Date;
}
