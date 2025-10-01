'use client';

import * as React from 'react';
import { RolexProduct } from '@/lib/types-rolex';

interface AnalyticsData {
  totalProducts: number;
  totalValue: number;
  productsByStatus: Record<string, number>;
  productsByModel: Record<string, number>;
  averagePrice: number;
  productsInService: number;
  productsReady: number;
  productsSold: number;
  recentActivity: Array<{
    id: string;
    action: string;
    product: string;
    timestamp: string;
    user: string;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topModels: Array<{
    model: string;
    count: number;
    totalValue: number;
  }>;
}

interface AnalyticsDashboardProps {
  products: RolexProduct[];
}

export function AnalyticsDashboard({ products }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'7d' | '30d' | '90d' | '1y'>('30d');

  React.useEffect(() => {
    if (products.length > 0) {
      calculateAnalytics();
    }
  }, [products, selectedPeriod]);

  const calculateAnalytics = () => {
    const now = new Date();
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Filtrar productos del período seleccionado
    const recentProducts = products.filter(p => new Date(p.createdAt) >= startDate);

    // Calcular métricas básicas
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    // Productos por estado
    const productsByStatus = products.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Productos por modelo
    const productsByModel = products.reduce((acc, p) => {
      acc[p.model] = (acc[p.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top modelos por valor
    const modelValues = products.reduce((acc, p) => {
      if (!acc[p.model]) {
        acc[p.model] = { count: 0, totalValue: 0 };
      }
      acc[p.model].count += 1;
      acc[p.model].totalValue += p.price || 0;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    const topModels = Object.entries(modelValues)
      .map(([model, data]) => ({ model, ...data }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    // Actividad reciente (simulada)
    const recentActivity = products
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        action: p.status === 'Sold' ? 'Vendido' : p.status === 'On Service' ? 'Enviado a servicio' : 'Actualizado',
        product: `${p.model} - ${p.serial}`,
        timestamp: p.updatedAt,
        user: 'Usuario Actual'
      }));

    // Ventas mensuales (simuladas)
    const monthlySales = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthProducts = products.filter(p => {
        const productDate = new Date(p.createdAt);
        return productDate.getMonth() === date.getMonth() && productDate.getFullYear() === date.getFullYear();
      });
      
      return {
        month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        sales: monthProducts.filter(p => p.status === 'Sold').length,
        revenue: monthProducts.filter(p => p.status === 'Sold').reduce((sum, p) => sum + (p.price || 0), 0)
      };
    }).reverse();

    setAnalyticsData({
      totalProducts,
      totalValue,
      productsByStatus,
      productsByModel,
      averagePrice,
      productsInService: productsByStatus['On Service'] || 0,
      productsReady: productsByStatus['Ready'] || 0,
      productsSold: productsByStatus['Sold'] || 0,
      recentActivity,
      monthlySales,
      topModels
    });
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📊 Dashboard Analytics
        </h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period === '7d' ? '7 días' : period === '30d' ? '30 días' : period === '90d' ? '90 días' : '1 año'}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${analyticsData.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Servicio</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.productsInService}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendidos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.productsSold}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos por Estado */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Productos por Estado
          </h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.productsByStatus).map(([status, count]) => {
              const percentage = (count / analyticsData.totalProducts) * 100;
              const statusColors = {
                'New': 'bg-blue-500',
                'Needs': 'bg-yellow-500',
                'On Service': 'bg-orange-500',
                'Returned': 'bg-red-500',
                'Ready': 'bg-green-500',
                'Sold': 'bg-purple-500',
                'RT Vendor': 'bg-gray-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Modelos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Top Modelos por Valor
          </h3>
          <div className="space-y-3">
            {analyticsData.topModels.slice(0, 8).map((model, index) => (
              <div key={model.model} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{model.model}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${model.totalValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {model.count} productos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⏰ Actividad Reciente
        </h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.product}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString('es-ES')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventas Mensuales */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📈 Ventas Mensuales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {analyticsData.monthlySales.slice(-6).map((month, index) => (
            <div key={month.month} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{month.month}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{month.sales}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ${month.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
