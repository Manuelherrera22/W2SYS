export type WatchCondition = 'Mint' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type WatchStatus = 'Available' | 'Sold' | 'Reserved' | 'Under Maintenance';
export type WatchMovement = 'Automatic' | 'Manual' | 'Quartz' | 'Digital';

export interface Watch {
  id: string;
  brand: string;
  model: string;
  referenceNumber: string;
  serialNumber?: string;
  year?: number;
  movement: WatchMovement;
  caseMaterial: string;
  caseSize: string;
  dialColor: string;
  braceletMaterial: string;
  condition: WatchCondition;
  status: WatchStatus;
  purchasePrice?: number;
  sellingPrice?: number;
  currentValue?: number;
  location?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchFormData {
  brand: string;
  model: string;
  referenceNumber: string;
  serialNumber?: string;
  year?: number;
  movement: WatchMovement;
  caseMaterial: string;
  caseSize: string;
  dialColor: string;
  braceletMaterial: string;
  condition: WatchCondition;
  status: WatchStatus;
  purchasePrice?: number;
  sellingPrice?: number;
  currentValue?: number;
  location?: string;
  notes?: string;
  imageUrl?: string;
}




