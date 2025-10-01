'use client';

import * as React from 'react';
import { GenericTable } from '../GenericTable';
import { RolexProduct } from '@/lib/types-rolex';

interface SetToReadyProps {
  products: RolexProduct[];
}

export function SetToReady({ products }: SetToReadyProps) {
  const columns = [
    { key: 'serial', label: 'Serial' },
    { key: 'case', label: 'Reference' },
    { key: 'cost', label: 'Cost', render: (val: number) => `$${val.toLocaleString()}` },
    { key: 'model', label: 'Model' },
    { key: 'brazalete', label: 'Band' },
    { key: 'createdAt', label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
    { key: 'in_third_party_inventory', label: 'Third', render: (val: boolean) => val ? '✓' : '-' },
    { key: 'status', label: 'Status', render: () => (
      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        SERVICE
      </span>
    )},
  ];

  return (
    <GenericTable
      title="Set to ready"
      columns={columns}
      data={products}
      searchPlaceholder="Search products..."
      emptyMessage="No Data To Display"
    />
  );
}



