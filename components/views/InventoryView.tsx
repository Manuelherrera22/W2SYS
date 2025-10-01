'use client';

import * as React from 'react';
import { GenericTable } from '../GenericTable';
import { RolexProduct } from '@/lib/types-rolex';

interface InventoryViewProps {
  products: RolexProduct[];
  isThirdParty?: boolean;
}

export function InventoryView({ products, isThirdParty = false }: InventoryViewProps) {
  const filteredProducts = products.filter(p => 
    isThirdParty ? p.in_third_party_inventory : !p.in_third_party_inventory
  );

  const columns = [
    { key: 'serial', label: 'Serial' },
    { key: 'case', label: 'Reference' },
    { key: 'model', label: 'Model' },
    { key: 'cost', label: 'Cost', render: (val: number) => `$${val.toLocaleString()}` },
    { key: 'price', label: 'Price', render: (val: number) => `$${val.toLocaleString()}` },
    { key: 'createdAt', label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <GenericTable
      title={isThirdParty ? "Third Party Inventory" : "Owner Inventory"}
      columns={columns}
      data={filteredProducts}
      searchPlaceholder="Search inventory..."
      emptyMessage="No Data To Display"
    />
  );
}



