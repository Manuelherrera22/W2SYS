import * as React from 'react';
import { Watch, Package, ClipboardList, Settings, List, Plus, Clock, Users, Tag, Palette, Wrench, Shield, BarChart3, FileText, Bell, UserCheck, ShieldCheck, Warehouse, DollarSign, Key } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission: string;
  items?: SubMenuItem[];
}

export interface SubMenuItem {
  name: string;
  path: string;
  permission: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    path: '/analytics',
    permission: 'Analytics'
  },
  {
    name: 'Reportes Avanzados',
    icon: <FileText className="h-6 w-6" />,
    path: '/advanced-reports',
    permission: 'Reports'
  },
  {
    name: 'Clientes (CRM)',
    icon: <UserCheck className="h-6 w-6" />,
    path: '/customers',
    permission: 'CRM'
  },
  {
    name: 'Garantías',
    icon: <ShieldCheck className="h-6 w-6" />,
    path: '/warranties',
    permission: 'Warranties'
  },
  {
    name: 'Notificaciones',
    icon: <Bell className="h-6 w-6" />,
    path: '/notifications',
    permission: 'Notifications'
  },
  {
    name: 'Inventario Inteligente',
    icon: <Warehouse className="h-6 w-6" />,
    path: '/smart-inventory',
    permission: 'Inventory'
  },
  {
    name: 'Precios Dinámicos',
    icon: <DollarSign className="h-6 w-6" />,
    path: '/dynamic-pricing',
    permission: 'Pricing'
  },
  {
    name: 'Autenticación 2FA',
    icon: <Key className="h-6 w-6" />,
    path: '/two-factor-auth',
    permission: 'Security'
  },
  {
    name: 'Audit Log',
    icon: <FileText className="h-6 w-6" />,
    path: '/audit-log',
    permission: 'AuditLog'
  },
  {
    name: 'Products',
    icon: <Watch className="h-6 w-6" />,
    path: '/products',
    permission: 'Products',
    items: [
      {
        name: 'Set to ready',
        path: '/set-to-ready',
        permission: 'set_to_ready'
      },
      {
        name: 'Product List',
        path: '/product-list',
        permission: 'product_list'
      },
      {
        name: 'Add Product',
        path: '/',
        permission: 'add_product'
      }
    ]
  },
  {
    name: 'Inventory',
    icon: <Package className="h-6 w-6" />,
    path: '/inventory',
    permission: 'Inventory',
    items: [
      {
        name: 'Owner Inventory',
        path: '/inventory/owner',
        permission: 'inventories_list'
      },
      {
        name: 'Third Party Inventory',
        path: '/inventory/third-party',
        permission: 'add_inventories'
      }
    ]
  },
  {
    name: 'Tasks',
    icon: <ClipboardList className="h-6 w-6" />,
    path: '/tasks',
    permission: 'Services',
    items: [
      {
        name: 'Services List',
        path: '/tasks/services',
        permission: 'services_list'
      },
      {
        name: 'Send to service',
        path: '/tasks/send',
        permission: 'add_services'
      },
      {
        name: 'On Service',
        path: '/tasks/on-service',
        permission: 'on_going'
      }
    ]
  },
  {
    name: 'Settings',
    icon: <Settings className="h-6 w-6" />,
    path: '/settings',
    permission: 'Setting',
    items: [
      {
        name: 'Bracelet',
        path: '/settings/bracelet',
        permission: 'basic_models'
      },
      {
        name: 'Models',
        path: '/settings/models',
        permission: 'basic_models'
      },
      {
        name: 'Brands',
        path: '/settings/brands',
        permission: 'basic_brand'
      },
      {
        name: 'Color',
        path: '/settings/color',
        permission: 'basic_color'
      },
      {
        name: 'Bezel',
        path: '/settings/bezel',
        permission: 'basic_bezel'
      },
      {
        name: 'Band',
        path: '/settings/band',
        permission: 'basic_band'
      },
      {
        name: 'Providers',
        path: '/settings/providers',
        permission: 'basic_providers'
      },
      {
        name: 'Customers',
        path: '/settings/customers',
        permission: 'basic_customers'
      },
      {
        name: 'Tasks',
        path: '/settings/tasks',
        permission: 'basic_services'
      },
      {
        name: 'Repairment Stores',
        path: '/settings/repairment-stores',
        permission: 'basic_repairment_stores'
      },
      {
        name: 'Repairment Parts',
        path: '/settings/repairment-parts',
        permission: 'basic_repairment_parts'
      },
      {
        name: 'Roles',
        path: '/settings/roles',
        permission: 'basic_security_roles'
      }
    ]
  }
];
