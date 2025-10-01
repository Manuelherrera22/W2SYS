'use client';

import React, { useState, useEffect } from 'react';
import { RolexProduct } from '@/lib/types-rolex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Globe,
  Calendar,
  TrendingUp as UpIcon
} from 'lucide-react';

interface MarketPrice {
  productId: string;
  productName: string;
  currentPrice: number;
  marketPrice: number;
  priceDifference: number;
  priceDifferencePercent: number;
  source: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'above' | 'below' | 'change';
  threshold: number;
  currentPrice: number;
  isActive: boolean;
  lastTriggered?: string;
}

interface CompetitorPrice {
  competitor: string;
  productName: string;
  price: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  lastChecked: string;
}

export function DynamicPricingSystem({ products }: { products: RolexProduct[] }) {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([
    {
      productId: '1',
      productName: 'Submariner 126610LN',
      currentPrice: 15000,
      marketPrice: 16500,
      priceDifference: 1500,
      priceDifferencePercent: 10,
      source: 'Chrono24',
      lastUpdated: '2024-01-15',
      trend: 'up'
    },
    {
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      currentPrice: 18000,
      marketPrice: 17500,
      priceDifference: -500,
      priceDifferencePercent: -2.8,
      source: 'WatchCharts',
      lastUpdated: '2024-01-15',
      trend: 'down'
    }
  ]);

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      productId: '1',
      productName: 'Submariner 126610LN',
      alertType: 'above',
      threshold: 17000,
      currentPrice: 15000,
      isActive: true
    },
    {
      id: '2',
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      alertType: 'below',
      threshold: 16000,
      currentPrice: 18000,
      isActive: true
    }
  ]);

  const [competitorPrices, setCompetitorPrices] = useState<CompetitorPrice[]>([
    {
      competitor: 'Chrono24',
      productName: 'Submariner 126610LN',
      price: 16500,
      availability: 'in_stock',
      lastChecked: '2024-01-15'
    },
    {
      competitor: 'WatchCharts',
      productName: 'Submariner 126610LN',
      price: 16200,
      availability: 'limited',
      lastChecked: '2024-01-15'
    },
    {
      competitor: 'Bob\'s Watches',
      productName: 'Submariner 126610LN',
      price: 16800,
      availability: 'in_stock',
      lastChecked: '2024-01-15'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  const refreshMarketPrices = async () => {
    setIsRefreshing(true);
    // Simular actualización de precios
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar precios con variaciones simuladas
    setMarketPrices(prev => prev.map(price => ({
      ...price,
      marketPrice: price.marketPrice + (Math.random() - 0.5) * 1000,
      lastUpdated: new Date().toISOString().split('T')[0]
    })));
    
    setIsRefreshing(false);
  };

  const getOptimalPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    const marketPrice = marketPrices.find(p => p.productId === productId);
    
    if (!product || !marketPrice) return product?.price || 0;
    
    // Algoritmo simple de pricing dinámico
    const basePrice = product.price;
    const marketTrend = marketPrice.trend === 'up' ? 1.05 : marketPrice.trend === 'down' ? 0.95 : 1.0;
    const demandFactor = marketPrice.priceDifferencePercent > 10 ? 1.1 : marketPrice.priceDifferencePercent < -10 ? 0.9 : 1.0;
    
    return Math.round(basePrice * marketTrend * demandFactor);
  };

  const getPriceRecommendation = (productId: string) => {
    const marketPrice = marketPrices.find(p => p.productId === productId);
    if (!marketPrice) return 'stable';
    
    if (marketPrice.priceDifferencePercent > 15) return 'increase';
    if (marketPrice.priceDifferencePercent < -15) return 'decrease';
    return 'stable';
  };

  const filteredMarketPrices = selectedProduct === 'all' 
    ? marketPrices 
    : marketPrices.filter(p => p.productId === selectedProduct);

  const pricingStats = {
    totalProducts: marketPrices.length,
    aboveMarket: marketPrices.filter(p => p.priceDifference > 0).length,
    belowMarket: marketPrices.filter(p => p.priceDifference < 0).length,
    averageDifference: marketPrices.reduce((sum, p) => sum + p.priceDifferencePercent, 0) / marketPrices.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sistema de Precios Dinámicos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis de mercado y optimización de precios en tiempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={refreshMarketPrices} 
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar Precios
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Monitoreados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pricingStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              En análisis de mercado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sobre Mercado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pricingStats.aboveMarket}</div>
            <p className="text-xs text-muted-foreground">
              Precios competitivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajo Mercado</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pricingStats.belowMarket}</div>
            <p className="text-xs text-muted-foreground">
              Oportunidades de aumento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diferencia Promedio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pricingStats.averageDifference > 0 ? '+' : ''}{pricingStats.averageDifference.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              vs mercado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Precios de Mercado */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Precios de Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMarketPrices.map((marketPrice) => {
              const optimalPrice = getOptimalPrice(marketPrice.productId);
              const recommendation = getPriceRecommendation(marketPrice.productId);
              
              return (
                <div key={marketPrice.productId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-lg">{marketPrice.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Fuente: {marketPrice.source} | Última actualización: {marketPrice.lastUpdated}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {marketPrice.trend === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : marketPrice.trend === 'down' ? (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <BarChart3 className="h-5 w-5 text-gray-500" />
                      )}
                      <Badge variant={marketPrice.trend === 'up' ? 'default' : marketPrice.trend === 'down' ? 'destructive' : 'secondary'}>
                        {marketPrice.trend === 'up' ? 'Alcista' : marketPrice.trend === 'down' ? 'Bajista' : 'Estable'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Precio Actual</p>
                      <p className="text-xl font-bold">${marketPrice.currentPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Precio de Mercado</p>
                      <p className="text-xl font-bold">${marketPrice.marketPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Precio Óptimo</p>
                      <p className="text-xl font-bold text-blue-600">${optimalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Diferencia</p>
                        <p className={`text-lg font-bold ${marketPrice.priceDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketPrice.priceDifference > 0 ? '+' : ''}${marketPrice.priceDifference.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Porcentaje</p>
                        <p className={`text-lg font-bold ${marketPrice.priceDifferencePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketPrice.priceDifferencePercent > 0 ? '+' : ''}{marketPrice.priceDifferencePercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {recommendation === 'increase' && (
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Aumentar Precio
                        </Badge>
                      )}
                      {recommendation === 'decrease' && (
                        <Badge className="bg-red-100 text-red-800">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Reducir Precio
                        </Badge>
                      )}
                      {recommendation === 'stable' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mantener Precio
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Competidores */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación con Competidores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorPrices.map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{competitor.competitor}</h3>
                    <p className="text-sm text-gray-600">{competitor.productName}</p>
                    <p className="text-xs text-gray-500">Última verificación: {competitor.lastChecked}</p>
                  </div>
                  <Badge 
                    variant={
                      competitor.availability === 'in_stock' ? 'default' :
                      competitor.availability === 'limited' ? 'secondary' : 'destructive'
                    }
                  >
                    {competitor.availability === 'in_stock' ? 'En Stock' :
                     competitor.availability === 'limited' ? 'Stock Limitado' : 'Agotado'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${competitor.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Precio */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Precio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{alert.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Alerta: {alert.alertType === 'above' ? 'Por encima de' : 
                             alert.alertType === 'below' ? 'Por debajo de' : 'Cambio de'} ${alert.threshold.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Precio actual: ${alert.currentPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                    {alert.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                  {alert.lastTriggered && (
                    <p className="text-xs text-gray-500">
                      Última activación: {alert.lastTriggered}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
