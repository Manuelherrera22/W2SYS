'use client';

import * as React from 'react';
import { GenericTable } from '../GenericTable';

interface SettingsViewProps {
  viewType: string;
}

export function SettingsView({ viewType }: SettingsViewProps) {
  const getConfig = () => {
    switch (viewType) {
      case 'repairment-parts':
        return {
          title: 'Repairment Parts',
          columns: [
            { key: 'code', label: 'Code' },
            { key: 'description', label: 'Description' },
            { key: 'alias', label: 'Alias' },
          ],
          data: [
            { id: '1', code: 'CHAMP DD/ DB', description: 'Description for CHAMP DD/ DB', alias: 'alias_CHAMP_DD/_DB' },
            { id: '2', code: 'WHITE ROM / WHITE CAL', description: 'Description for WHITE ROM / WHITE CAL', alias: 'alias_WHITE_ROM_/_WHITE_CAL' },
            { id: '3', code: 'OLIVE GREEN DD/ DB MID', description: 'Description for OLIVE GREEN DD/ DB MID', alias: 'alias_OLIVE_GREEN_DD/_DB_MID' },
            { id: '4', code: 'INSERT NEGRO', description: 'Description for INSERT NEGRO', alias: 'alias_INSERT_NEGRO' },
            { id: '5', code: 'WHITE MOP DD / DB', description: 'Description for WHITE MOP DD / DB', alias: 'alias_WHITE_MOP_DD_/_DB' },
            { id: '6', code: 'SILVER DD / FLT', description: 'Description for SILVER DD / FLT', alias: 'alias_SILVER_DD_/_FLT' },
            { id: '7', code: 'CH DD / DB', description: 'Description for CH DD / DB', alias: 'alias_CH_DD_/_DB' },
            { id: '8', code: 'DARK MOP / DB', description: 'Description for DARK MOP / DB', alias: 'alias_DARK_MOP_/_DB' },
          ]
        };
      
      case 'bracelet':
      case 'models':
      case 'brands':
      case 'color':
      case 'bezel':
      case 'band':
      case 'providers':
      case 'customers':
      case 'tasks':
      case 'repairment-stores':
      case 'roles':
        return {
          title: viewType.charAt(0).toUpperCase() + viewType.slice(1).replace('-', ' '),
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
          ],
          data: []
        };
      
      default:
        return {
          title: 'Settings',
          columns: [{ key: 'name', label: 'Name' }],
          data: []
        };
    }
  };

  const config = getConfig();

  return (
    <GenericTable
      {...config}
      searchPlaceholder={`Search ${config.title.toLowerCase()}...`}
      emptyMessage="No Data To Display"
      onAdd={() => console.log('Add new', viewType)}
      onEdit={(item) => console.log('Edit', item)}
      onDelete={(item) => console.log('Delete', item)}
    />
  );
}



