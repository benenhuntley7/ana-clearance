export interface StoreDataInterface {
  id: number;
  created_at: string;
  store: string;
  article: number;
  description: string;
  z_status: string;
  rrp: number;
  soh: number;
  department: string;
  sub_department: string;
  cost: number;
  map: number;
  age: number;
  updated_at: string;
}

export interface StoreHistoryInterface {
  id: number;
  created_at: string;
  store: string;
  department: string;
  total_cost: number;
}
