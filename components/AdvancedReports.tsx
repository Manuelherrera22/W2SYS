'use client';

import React, { useState, useMemo } from 'react';
import { RolexProduct } from '@/lib/types-rolex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, BarChart3, TrendingUp, DollarSign, Package, Users } from 'lucide-react';

interface ReportData {
  totalProducts: number;
  totalValue: number;
  averagePrice: number;
  productsByStatus: Record<string, number>;
  productsByModel: Record<string, number>;
  monthlySales: Array<{ month: string; sales: number; revenue: number }>;
  topModels: Array<{ model: string; count: number; totalValue: number }>;
  recentActivity: Array<{ action: string; product: string; timestamp: string; user: string }>;
}

interface AdvancedReportsProps {
  products: RolexProduct[];
}

export function AdvancedReports({ products }: AdvancedReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'sales' | 'inventory' | 'analytics'>('overview');

  const reportData = useMemo(() => {
    const now = new Date();
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Filtrar productos por período
    const filteredProducts = products.filter(product => {
      const productDate = new Date(product.createdAt);
      return productDate >= startDate;
    });

    // Calcular métricas básicas
    const totalProducts = filteredProducts.length;
    const totalValue = filteredProducts.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    // Productos por status
    const productsByStatus = filteredProducts.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Productos por modelo
    const productsByModel = filteredProducts.reduce((acc, product) => {
      acc[product.model] = (acc[product.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ventas mensuales (simulado)
    const monthlySales = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), i, 1);
      const monthProducts = products.filter(p => {
        const productDate = new Date(p.createdAt);
        return productDate.getMonth() === i && productDate.getFullYear() === now.getFullYear();
      });
      
      return {
        month: date.toLocaleDateString('es', { month: 'short' }),
        sales: monthProducts.filter(p => p.status === 'Sold').length,
        revenue: monthProducts.filter(p => p.status === 'Sold').reduce((sum, p) => sum + p.price, 0)
      };
    });

    // Top modelos
    const topModels = Object.entries(productsByModel)
      .map(([model, count]) => ({
        model,
        count,
        totalValue: filteredProducts.filter(p => p.model === model).reduce((sum, p) => sum + p.price, 0)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Actividad reciente (simulada)
    const recentActivity = [
      { action: 'CREATE', product: 'Submariner 126610LN', timestamp: '2024-01-15 10:30', user: 'Admin' },
      { action: 'UPDATE', product: 'GMT Master 126710BLNR', timestamp: '2024-01-15 09:15', user: 'Manager' },
      { action: 'SOLD', product: 'Daytona 116500LN', timestamp: '2024-01-14 16:45', user: 'Admin' },
    ];

    return {
      totalProducts,
      totalValue,
      averagePrice,
      productsByStatus,
      productsByModel,
      monthlySales,
      topModels,
      recentActivity
    };
  }, [products, selectedPeriod]);

  const exportToPDF = () => {
    // Simular exportación a PDF
    const reportContent = `
      REPORTE W2SYS - ${selectedPeriod.toUpperCase()}
      
      RESUMEN GENERAL:
      - Total de Productos: ${reportData.totalProducts}
      - Valor Total: $${reportData.totalValue.toLocaleString()}
      - Precio Promedio: $${reportData.averagePrice.toLocaleString()}
      
      PRODUCTOS POR STATUS:
      ${Object.entries(reportData.productsByStatus).map(([status, count]) => 
        `- ${status}: ${count}`
      ).join('\n')}
      
      TOP MODELOS:
      ${reportData.topModels.map((model, index) => 
        `${index + 1}. ${model.model}: ${model.count} unidades ($${model.totalValue.toLocaleString()})`
      ).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-w2sys-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Simular exportación a Excel
    const csvContent = [
      ['Modelo', 'Cantidad', 'Valor Total'],
      ...reportData.topModels.map(model => [model.model, model.count, model.totalValue])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-w2sys-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reportes Avanzados
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis detallado del inventario y ventas
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              En el período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventario total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Por producto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.productsByStatus.Sold || 0}</div>
            <p className="text-xs text-muted-foreground">
              En el período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Productos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.productsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / reportData.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Modelos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Modelos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topModels.slice(0, 5).map((model, index) => (
                <div key={model.model} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium">{model.model}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{model.count} unidades</div>
                    <div className="text-xs text-gray-500">${model.totalValue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'CREATE' ? 'bg-green-500' :
                    activity.action === 'UPDATE' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{activity.action} - {activity.product}</p>
                    <p className="text-xs text-gray-500">por {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
