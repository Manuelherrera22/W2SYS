'use client';

import * as React from 'react';
import { GenericTable } from '../GenericTable';

interface Task {
  id: string;
  supplier: string;
  product: string;
  status: string;
  date: string;
  daysInLabor: number;
  returned: number;
}

interface TasksViewProps {
  viewType: 'list' | 'send' | 'on-service';
}

export function TasksView({ viewType }: TasksViewProps) {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      supplier: 'Hermes',
      product: '123',
      status: 'SERVICE',
      date: '09/30/2025 19:08',
      daysInLabor: 0,
      returned: 0
    },
    {
      id: '2',
      supplier: 'Hermes',
      product: 'A155468',
      status: 'SERVICE',
      date: '04/14/2025 15:55',
      daysInLabor: 169,
      returned: 0
    }
  ]);

  const getTitle = () => {
    switch (viewType) {
      case 'list': return 'Services List';
      case 'send': return 'Send to service';
      case 'on-service': return 'On Service';
      default: return 'Tasks';
    }
  };

  const columns = [
    { key: 'supplier', label: 'Supplier' },
    { key: 'product', label: 'Product' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => (
        <span className="text-primary font-medium">{val}</span>
      )
    },
    { key: 'date', label: 'Date' },
    { key: 'daysInLabor', label: 'Days In Labor' },
    { key: 'returned', label: 'Returned' },
  ];

  if (viewType === 'send') {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          There are no products for services.
        </p>
      </div>
    );
  }

  return (
    <GenericTable
      title={getTitle()}
      columns={columns}
      data={tasks}
      searchPlaceholder="Search tasks..."
      emptyMessage="No Data To Display"
      onEdit={(item) => console.log('Edit task:', item)}
    />
  );
}



