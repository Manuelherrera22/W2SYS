'use client';

import * as React from 'react';
import { RolexProduct, RolexFormData, ProductStatus, ServiceNeeds, ServiceRecord } from '@/lib/types-rolex';
import { RolexProductForm } from './RolexProductForm';
import { ProductList } from './ProductList';
import { Sidebar } from './Sidebar';
import { SetToReady } from './views/SetToReady';
import { InventoryView } from './views/InventoryView';
import { TasksView } from './views/TasksView';
import { SettingsView } from './views/SettingsView';
import { useSupabaseProducts, useSupabaseServices } from '@/lib/hooks/useSupabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useBackup } from '@/lib/backup/BackupManager';
import { useAlerts } from '@/lib/alerts/AlertManager';
import { LoginModal } from './auth/LoginModal';
import { NotificationCenter } from './NotificationCenter';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { AuditLogViewer } from './AuditLogViewer';
import { AdvancedReports } from './AdvancedReports';
import { CustomerCRM } from './CustomerCRM';
import { WarrantySystem } from './WarrantySystem';
import { NotificationBell } from './NotificationBell';
import { SmartInventorySystem } from './SmartInventorySystem';
import { DynamicPricingSystem } from './DynamicPricingSystem';
import { TwoFactorAuthSystem } from './TwoFactorAuthSystem';
import { useProductAuditLog } from '@/lib/audit/AuditLogManager';
import { useNotifications } from '@/lib/notifications/NotificationProvider';

export function CompleteDashboard() {
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useSupabaseProducts();
  
  const { 
    services, 
    loading: servicesLoading, 
    error: servicesError, 
    addService 
  } = useSupabaseServices();

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { createBackup, startAutoBackup } = useBackup();
  const { checkAlertRules } = useAlerts();
  const { logProductAction } = useProductAuditLog();
  const { addNotification } = useNotifications() || { addNotification: () => {} };

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState('/');
  const [editingProduct, setEditingProduct] = React.useState<RolexProduct | null>(null);
  const [showLogin, setShowLogin] = React.useState(false);

  // Iniciar backup automático cuando el usuario se autentica
  React.useEffect(() => {
    if (user) {
      startAutoBackup();
    }
  }, [user, startAutoBackup]);

  // Verificar reglas de alertas cuando cambian los datos
  React.useEffect(() => {
    if (products.length > 0 && services.length > 0) {
      checkAlertRules(products, services);
    }
  }, [products, services, checkAlertRules]);

  const handleSubmit = async (data: RolexFormData) => {
    try {
      if (editingProduct) {
        const oldValues = {
          case: editingProduct.case,
          model: editingProduct.model,
          serial: editingProduct.serial,
          price: editingProduct.price,
          status: editingProduct.status,
        };
        
        await updateProduct(editingProduct.id, {
          ...data,
          cost: typeof data.cost === 'string' ? parseFloat(data.cost) || 0 : data.cost,
          price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
          images: data.images || [],
          status: data.status || editingProduct.status || 'New',
        });
        
        // Log audit action
      await logProductAction('UPDATE', editingProduct.id, oldValues, {
        case: data.case,
        model: data.model,
        serial: data.serial,
        price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
        status: data.status || editingProduct.status || 'New',
      });

      // Notificación de producto actualizado
      addNotification({
        type: 'info',
        title: 'Producto Actualizado',
        message: `${data.model} (${data.serial}) ha sido actualizado`,
        actionUrl: `/products/${editingProduct.id}`
      });
        
        setEditingProduct(null);
        setCurrentView('/product-list');
      } else {
        const newProduct = await addProduct({
          ...data,
          cost: typeof data.cost === 'string' ? parseFloat(data.cost) || 0 : data.cost,
          price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
          images: data.images || [],
          status: 'New',
        });
        
        // Log audit action
      if (newProduct && newProduct.id) {
        await logProductAction('CREATE', newProduct.id, undefined, {
          case: data.case,
          model: data.model,
          serial: data.serial,
          price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
          status: 'New',
        });

        // Notificación de producto creado
        addNotification({
          type: 'success',
          title: 'Producto Agregado',
          message: `${data.model} (${data.serial}) ha sido agregado al inventario`,
          actionUrl: `/products/${newProduct.id}`
        });
      }
        
        setCurrentView('/product-list');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleUpdateStatus = async (productId: string, status: ProductStatus) => {
    try {
      await updateProduct(productId, { status });
      
      // Si cambia a "On Service", crear registro de servicio
      const product = products.find(p => p.id === productId);
      if (status === 'On Service' && product && product.status !== 'On Service') {
        await addService({
          product_id: productId,
          supplier: 'Hermes',
          invoice: '-',
          cost: 0,
          status: 'SERVICE',
          date: new Date().toLocaleString(),
          days_in_labor: 0,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleUpdateNeeds = async (productId: string, needs: ServiceNeeds) => {
    try {
      await updateProduct(productId, { 
        service_needs: needs, 
        status: 'Needs' as ProductStatus 
      });
    } catch (error) {
      console.error('Error updating needs:', error);
      alert('Error updating needs. Please try again.');
    }
  };

  const handleSendToService = async (productId: string, supplier: string) => {
    try {
      // Actualizar producto a "On Service"
      await updateProduct(productId, { status: 'On Service' as ProductStatus });
      
      // Crear registro de servicio
      await addService({
        product_id: productId,
        supplier,
        invoice: '-',
        cost: 0,
        status: 'SERVICE',
        date: new Date().toLocaleString(),
        days_in_labor: 0,
      });
    } catch (error) {
      console.error('Error sending to service:', error);
      alert('Error sending to service. Please try again.');
    }
  };

  const handleEdit = (product: RolexProduct) => {
    setEditingProduct(product);
    setCurrentView('/');
  };

  const handleDelete = async (id: string) => {
    try {
      // Obtener datos del producto antes de eliminarlo para el audit log
      const productToDelete = products.find(p => p.id === id);
      
      await deleteProduct(id);
      
      // Log audit action
      if (productToDelete) {
        await logProductAction('DELETE', id, {
          case: productToDelete.case,
          model: productToDelete.model,
          serial: productToDelete.serial,
          price: productToDelete.price,
          status: productToDelete.status,
        });

        // Notificación de producto eliminado
        addNotification({
          type: 'warning',
          title: 'Producto Eliminado',
          message: `${productToDelete.model} (${productToDelete.serial}) ha sido eliminado del inventario`
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const handleClose = () => {
    setEditingProduct(null);
    setCurrentView('/product-list');
  };

  const handleNavigate = (path: string) => {
    setCurrentView(path);
    setEditingProduct(null);
  };

  const getPageTitle = () => {
    const titleMap: Record<string, string> = {
      '/': editingProduct ? 'Edit Product' : 'Add Product',
      '/product-list': 'Product List',
      '/set-to-ready': 'Set to ready',
      '/inventory/owner': 'Inventory',
      '/inventory/third-party': 'Inventory',
      '/tasks/services': 'Tasks',
      '/tasks/send': 'Send to service',
      '/tasks/on-service': 'On Service',
      '/settings/bracelet': 'Bracelet',
      '/settings/models': 'Models',
      '/settings/brands': 'Brands',
      '/settings/color': 'Color',
      '/settings/bezel': 'Bezel',
      '/settings/band': 'Band',
      '/settings/providers': 'Providers',
      '/settings/customers': 'Customers',
      '/settings/tasks': 'Tasks',
      '/settings/repairment-stores': 'Repairment Stores',
      '/settings/repairment-parts': 'Repairment Parts',
      '/settings/roles': 'Roles',
    };
    return titleMap[currentView] || 'Dashboard';
  };

  const getBreadcrumb = () => {
    const breadcrumbMap: Record<string, string> = {
      '/': editingProduct ? 'Edit Product' : 'Add Product',
      '/product-list': 'Product List',
      '/set-to-ready': 'Set to ready',
      '/inventory/owner': 'Owner Inventory',
      '/inventory/third-party': 'Third Party Inventory',
      '/tasks/services': 'Services List',
      '/tasks/send': 'Send to service',
      '/tasks/on-service': 'On Service',
      '/analytics': 'Analytics Dashboard',
      '/audit-log': 'Audit Log',
      '/settings/bracelet': 'Bracelet',
      '/settings/models': 'Models',
      '/settings/brands': 'Brands',
      '/settings/color': 'Color',
      '/settings/bezel': 'Bezel',
      '/settings/band': 'Band',
      '/settings/providers': 'Providers',
      '/settings/customers': 'Customers',
      '/settings/tasks': 'Tasks',
      '/settings/repairment-stores': 'Repairment Stores',
      '/settings/repairment-parts': 'Repairment Parts',
      '/settings/roles': 'Roles',
    };
    return breadcrumbMap[currentView] || 'Dashboard';
  };

  return (
    <div className={`${sidebarOpen ? '' : 'sidebar-expanded'}`}>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            currentPath={currentView}
            onNavigate={handleNavigate}
          />

          {/* Main Content Area */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
              <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                  <button
                    aria-controls="sidebar"
                    className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <span className="relative block h-5.5 w-5.5 cursor-pointer">
                      <span className="du-block absolute right-0 h-full w-full">
                        <span className="relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white !w-full delay-300"></span>
                        <span className="relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white delay-400 !w-full"></span>
                        <span className="relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white !w-full delay-500"></span>
                      </span>
                    </span>
                  </button>
                </div>
                <div className="hidden sm:block"></div>
                <div className="flex items-center gap-3 2xsm:gap-7">
                  <ul className="flex items-center gap-2 2xsm:gap-4"></ul>
                  
                  {/* Notificaciones */}
                  {user && <NotificationCenter />}
                  {user && <NotificationBell />}
                  
                  <div className="relative">
                    <a className="flex items-center gap-4" href="#" onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen); }}>
                      <span className="hidden text-right lg:block">
                        <span className="block text-sm font-medium text-black dark:text-white">
                          {profile?.full_name || 'Usuario'}
                        </span>
                        <span className="block text-xs">
                          {profile?.role || 'viewer'} | {user ? 'Conectado' : 'Desconectado'}
                        </span>
                      </span>
                      <span className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <svg className={`w-5 h-5 transition-transform duration-300 ease-in-out ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </a>
                    <div className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? '' : 'hidden'}`}>
                      <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                        <li>
                          <button 
                            onClick={() => createBackup()}
                            className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                          >
                            💾 Crear Backup
                          </button>
                        </li>
                        <li>
                          <a className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" href="#">
                            ⚙️ Configuración
                          </a>
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          if (user) {
                            signOut();
                          } else {
                            setShowLogin(true);
                          }
                        }}
                        className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                      >
                        {user ? '🚪 Cerrar Sesión' : '🔑 Iniciar Sesión'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    {getPageTitle()}
                  </h2>
                  <nav>
                    <ol className="flex items-center gap-2">
                      <li>
                        <a className="font-medium" href="#" onClick={(e) => { e.preventDefault(); handleNavigate('/product-list'); }}>
                          Dashboard /
                        </a>
                      </li>
                      <li className="font-medium text-primary">{getBreadcrumb()}</li>
                    </ol>
                  </nav>
                </div>

                {/* Content */}
                {productsLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-lg">Loading products...</div>
                  </div>
                )}

                {productsError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error loading products: {productsError}
                  </div>
                )}

                {currentView === '/product-list' && !productsLoading && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleNavigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90"
                      >
                        <span className="text-xl">+</span>
                        Add Product
                      </button>
                    </div>
                    <ProductList 
                      products={products}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onUpdateStatus={handleUpdateStatus}
                      onUpdateNeeds={handleUpdateNeeds}
                      onSendToService={handleSendToService}
                    />
                  </div>
                )}

                {currentView === '/set-to-ready' && (
                  <SetToReady products={products} />
                )}

                {currentView === '/inventory/owner' && (
                  <InventoryView products={products} isThirdParty={false} />
                )}

                {currentView === '/inventory/third-party' && (
                  <InventoryView products={products} isThirdParty={true} />
                )}

                {currentView === '/tasks/services' && (
                  <TasksView viewType="list" />
                )}

                {currentView === '/tasks/send' && (
                  <TasksView viewType="send" />
                )}

                {currentView === '/tasks/on-service' && (
                  <TasksView viewType="on-service" />
                )}

      {currentView === '/analytics' && (
        <AnalyticsDashboard products={products} />
      )}

      {currentView === '/advanced-reports' && (
        <AdvancedReports products={products} />
      )}

      {currentView === '/customers' && (
        <CustomerCRM />
      )}

      {currentView === '/warranties' && (
        <WarrantySystem products={products} />
      )}

      {currentView === '/notifications' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Centro de Notificaciones
          </h2>
          <NotificationBell />
        </div>
      )}

      {currentView === '/smart-inventory' && (
        <SmartInventorySystem products={products} />
      )}

      {currentView === '/dynamic-pricing' && (
        <DynamicPricingSystem products={products} />
      )}

      {currentView === '/two-factor-auth' && (
        <TwoFactorAuthSystem />
      )}

      {currentView === '/audit-log' && (
        <AuditLogViewer />
      )}

                {currentView.startsWith('/settings/') && (
                  <SettingsView viewType={currentView.replace('/settings/', '')} />
                )}

                {currentView === '/' && (
                  <div className="grid grid-cols-1">
                    <div className="flex flex-col gap-9">
                      {/* Analytics Dashboard */}
                      <AnalyticsDashboard products={products} />
                      
                      {/* Formulario de Producto */}
                      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                          <h3 className="font-medium text-black dark:text-white">
                            Agregar Nuevo Producto
                          </h3>
                        </div>
                        <RolexProductForm 
                          onSubmit={handleSubmit} 
                          onClose={handleClose}
                          initialData={editingProduct || undefined}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
}

