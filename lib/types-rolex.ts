export type ProductStatus = 'New' | 'Needs' | 'On Service' | 'Returned' | 'Ready' | 'Sold' | 'RT Vendor';

export interface ServiceNeeds {
  adjust_movement: boolean;
  adjust_seconds_per_day: boolean;
  bezel: string;
  change_crystal: boolean;
  change_dial: boolean;
  change_flt: boolean;
  change_scratched_hands: string;
  dial: boolean;
  only_polish_where_marked: boolean;
  polish: string;
  polish_bracelet: string;
  polish_case_back: string;
  return_flt: boolean;
  service: string;
  urgent: string;
}

export interface ServiceRecord {
  id: string;
  product_id: string;
  supplier: string;
  invoice: string;
  cost: number;
  status: string;
  date: string;
  returned_date?: string;
  days_in_labor: number;
}

export interface RolexProduct {
  id: string;
  case: string;
  model: string;
  material: string;
  bezel: string;
  brazalete: string;
  provider: string;
  serial: string;
  year: string;
  end_piece_code: string;
  movement_number: string;
  cost: number;
  price: number;
  description: string;
  // Checkboxes básicos
  in_card: boolean;
  in_papers: boolean;
  in_services_papers: boolean;
  in_has_box: boolean;
  in_third_party_inventory: boolean;
  // Status y servicios
  status: ProductStatus;
  service_needs?: ServiceNeeds;
  current_service?: string; // ID del servicio actual
  // Metadata
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RolexFormData {
  case: string;
  model: string;
  material: string;
  bezel: string;
  brazalete: string;
  provider: string;
  serial: string;
  year: string;
  end_piece_code: string;
  movement_number: string;
  cost: number | string;
  price: number | string;
  description: string;
  in_card: boolean;
  in_papers: boolean;
  in_services_papers: boolean;
  in_has_box: boolean;
  in_third_party_inventory: boolean;
  images?: string[];
  status?: ProductStatus;
}
