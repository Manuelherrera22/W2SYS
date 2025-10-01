'use client';

import React, { useState, useMemo } from 'react';
import { RolexProduct } from '@/lib/types-rolex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ShoppingCart, 
  Truck, 
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Star
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  deliveryTime: number; // días
  minimumOrder: number;
  specialties: string[];
}

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  status: 'low' | 'high' | 'out';
  priority: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface DemandPrediction {
  productId: string;
  productName: string;
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  seasonality: number;
}

export function SmartInventorySystem({ products }: { products: RolexProduct[] }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Rolex Official Distributor',
      contact: 'John Smith',
      email: 'john@rolex.com',
      phone: '+1 555-0101',
      rating: 5,
      deliveryTime: 7,
      minimumOrder: 50000,
      specialties: ['Submariner', 'GMT Master', 'Daytona']
    },
    {
      id: '2',
      name: 'Luxury Watch Supply Co.',
      contact: 'Maria Garcia',
      email: 'maria@luxurywatch.com',
      phone: '+1 555-0102',
      rating: 4,
      deliveryTime: 14,
      minimumOrder: 25000,
      specialties: ['Vintage Models', 'Accessories']
    }
  ]);

  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([
    {
      id: '1',
      productId: '1',
      productName: 'Submariner 126610LN',
      currentStock: 2,
      minThreshold: 5,
      maxThreshold: 20,
      status: 'low',
      priority: 'high',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      currentStock: 15,
      minThreshold: 5,
      maxThreshold: 20,
      status: 'high',
      priority: 'medium',
      lastUpdated: '2024-01-15'
    }
  ]);

  const [demandPredictions, setDemandPredictions] = useState<DemandPrediction[]>([
    {
      productId: '1',
      productName: 'Submariner 126610LN',
      currentDemand: 8,
      predictedDemand: 12,
      confidence: 85,
      trend: 'up',
      seasonality: 1.2
    },
    {
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      currentDemand: 5,
      predictedDemand: 4,
      confidence: 75,
      trend: 'down',
      seasonality: 0.8
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'high' | 'out'>('all');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    phone: '',
    rating: 5,
    deliveryTime: 7,
    minimumOrder: 0,
    specialties: []
  });

  const filteredAlerts = stockAlerts.filter(alert => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = stockAlerts.filter(a => a.status === 'low').length;
    const outOfStock = stockAlerts.filter(a => a.status === 'out').length;
    const highStock = stockAlerts.filter(a => a.status === 'high').length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const averageStock = stockAlerts.reduce((sum, a) => sum + a.currentStock, 0) / stockAlerts.length;

    return {
      totalProducts,
      lowStock,
      outOfStock,
      highStock,
      totalValue,
      averageStock
    };
  }, [products, stockAlerts]);

  const addSupplier = () => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name || '',
      contact: newSupplier.contact || '',
      email: newSupplier.email || '',
      phone: newSupplier.phone || '',
      rating: newSupplier.rating || 5,
      deliveryTime: newSupplier.deliveryTime || 7,
      minimumOrder: newSupplier.minimumOrder || 0,
      specialties: newSupplier.specialties || []
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: '',
      contact: '',
      email: '',
      phone: '',
      rating: 5,
      deliveryTime: 7,
      minimumOrder: 0,
      specialties: []
    });
    setIsAddSupplierOpen(false);
  };

  const generatePurchaseOrder = (alert: StockAlert) => {
    const product = products.find(p => p.id === alert.productId);
    const recommendedSupplier = suppliers.find(s => 
      s.specialties.some(specialty => 
        product?.model.toLowerCase().includes(specialty.toLowerCase())
      )
    );

    const orderQuantity = alert.maxThreshold - alert.currentStock;
    const estimatedCost = product ? product.price * orderQuantity : 0;

    const purchaseOrder = `
ORDEN DE COMPRA AUTOMÁTICA

Producto: ${alert.productName}
Cantidad: ${orderQuantity} unidades
Proveedor Recomendado: ${recommendedSupplier?.name || 'No especificado'}
Costo Estimado: $${estimatedCost.toLocaleString()}
Fecha de Entrega Estimada: ${new Date(Date.now() + (recommendedSupplier?.deliveryTime || 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}

Motivo: Stock bajo (${alert.currentStock} unidades, mínimo: ${alert.minThreshold})
Prioridad: ${alert.priority.toUpperCase()}

Generado automáticamente el: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([purchaseOrder], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orden-compra-${alert.productName.replace(/\s+/g, '-')}-${alert.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sistema de Inventario Inteligente
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión avanzada de stock y predicción de demanda
          </p>
        </div>
        
        <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplierName">Nombre del Proveedor</Label>
                <Input
                  id="supplierName"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Nombre del proveedor"
                />
              </div>
              <div>
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  placeholder="Nombre del contacto"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="email@proveedor.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="+1 555-0123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryTime">Tiempo de Entrega (días)</Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    value={newSupplier.deliveryTime}
                    onChange={(e) => setNewSupplier({ ...newSupplier, deliveryTime: parseInt(e.target.value) })}
                    placeholder="7"
                  />
                </div>
                <div>
                  <Label htmlFor="minimumOrder">Pedido Mínimo ($)</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    value={newSupplier.minimumOrder}
                    onChange={(e) => setNewSupplier({ ...newSupplier, minimumOrder: parseInt(e.target.value) })}
                    placeholder="25000"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addSupplier}>
                  Agregar Proveedor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              En inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              Requieren reabastecimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Sin stock disponible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventario total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="low">Stock Bajo</SelectItem>
            <SelectItem value="high">Stock Alto</SelectItem>
            <SelectItem value="out">Agotados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alertas de Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{alert.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Stock actual: {alert.currentStock} | Mínimo: {alert.minThreshold} | Máximo: {alert.maxThreshold}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status === 'low' ? 'Stock Bajo' : 
                       alert.status === 'high' ? 'Stock Alto' : 'Agotado'}
                    </Badge>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePurchaseOrder(alert)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Generar Orden
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predicción de Demanda */}
      <Card>
        <CardHeader>
          <CardTitle>Predicción de Demanda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demandPredictions.map((prediction) => (
              <div key={prediction.productId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{prediction.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Demanda actual: {prediction.currentDemand} | Predicción: {prediction.predictedDemand}
                    </p>
                    <p className="text-xs text-gray-500">
                      Confianza: {prediction.confidence}% | Estacionalidad: {prediction.seasonality}x
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {prediction.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : prediction.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm font-medium capitalize">{prediction.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Proveedores Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">
                    Contacto: {supplier.contact} | {supplier.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Entrega: {supplier.deliveryTime} días | Pedido mínimo: ${supplier.minimumOrder.toLocaleString()}
                  </p>
                  <div className="flex space-x-1 mt-2">
                    {supplier.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < supplier.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
