'use client';

import React, { useState } from 'react';
import { RolexProduct } from '@/lib/types-rolex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Shield, AlertTriangle, CheckCircle, Clock, FileText, Download } from 'lucide-react';

interface Warranty {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  warrantyType: 'manufacturer' | 'extended' | 'service';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'void';
  coverage: string[];
  notes: string;
  createdAt: string;
}

interface ServiceRecord {
  id: string;
  warrantyId: string;
  serviceType: 'repair' | 'maintenance' | 'inspection';
  description: string;
  cost: number;
  date: string;
  technician: string;
  status: 'completed' | 'pending' | 'cancelled';
  nextServiceDate?: string;
}

export function WarrantySystem({ products }: { products: RolexProduct[] }) {
  const [warranties, setWarranties] = useState<Warranty[]>([
    {
      id: '1',
      productId: '1',
      productName: 'Submariner 126610LN',
      customerName: 'Juan Pérez',
      customerEmail: 'juan.perez@email.com',
      warrantyType: 'manufacturer',
      startDate: '2024-01-15',
      endDate: '2027-01-15',
      status: 'active',
      coverage: ['Mecánico', 'Cristal', 'Corona'],
      notes: 'Garantía estándar del fabricante',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      customerName: 'María García',
      customerEmail: 'maria.garcia@email.com',
      warrantyType: 'extended',
      startDate: '2024-01-10',
      endDate: '2029-01-10',
      status: 'active',
      coverage: ['Mecánico', 'Cristal', 'Corona', 'Bisel', 'Brazalete'],
      notes: 'Garantía extendida de 5 años',
      createdAt: '2024-01-10'
    }
  ]);

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: '1',
      warrantyId: '1',
      serviceType: 'maintenance',
      description: 'Servicio de mantenimiento rutinario',
      cost: 500,
      date: '2024-01-20',
      technician: 'Carlos López',
      status: 'completed',
      nextServiceDate: '2025-01-20'
    },
    {
      id: '2',
      warrantyId: '2',
      serviceType: 'repair',
      description: 'Reparación de corona',
      cost: 0,
      date: '2024-01-25',
      technician: 'Ana Martínez',
      status: 'completed'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [newWarranty, setNewWarranty] = useState<Partial<Warranty>>({
    productId: '',
    customerName: '',
    customerEmail: '',
    warrantyType: 'manufacturer',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    coverage: [],
    notes: ''
  });

  const addWarranty = () => {
    const product = products.find(p => p.id === newWarranty.productId);
    if (!product) return;

    const warranty: Warranty = {
      id: Date.now().toString(),
      productId: newWarranty.productId || '',
      productName: product.model,
      customerName: newWarranty.customerName || '',
      customerEmail: newWarranty.customerEmail || '',
      warrantyType: newWarranty.warrantyType || 'manufacturer',
      startDate: newWarranty.startDate || new Date().toISOString().split('T')[0],
      endDate: newWarranty.endDate || '',
      status: 'active',
      coverage: newWarranty.coverage || [],
      notes: newWarranty.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWarranties([...warranties, warranty]);
    setNewWarranty({
      productId: '',
      customerName: '',
      customerEmail: '',
      warrantyType: 'manufacturer',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      coverage: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const getWarrantyStatus = (warranty: Warranty) => {
    const now = new Date();
    const endDate = new Date(warranty.endDate);
    
    if (warranty.status === 'void') return 'void';
    if (endDate < now) return 'expired';
    
    // Verificar si está próximo a vencer (30 días)
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) return 'expiring';
    
    return 'active';
  };

  const getWarrantyStats = () => {
    const active = warranties.filter(w => getWarrantyStatus(w) === 'active').length;
    const expiring = warranties.filter(w => getWarrantyStatus(w) === 'expiring').length;
    const expired = warranties.filter(w => getWarrantyStatus(w) === 'expired').length;
    const totalValue = warranties.reduce((sum, w) => {
      const product = products.find(p => p.id === w.productId);
      return sum + (product?.price || 0);
    }, 0);

    return { active, expiring, expired, totalValue };
  };

  const generateWarrantyCertificate = (warranty: Warranty) => {
    const product = products.find(p => p.id === warranty.productId);
    const certificateContent = `
CERTIFICADO DE GARANTÍA W2SYS

Producto: ${warranty.productName}
Cliente: ${warranty.customerName}
Email: ${warranty.customerEmail}
Tipo de Garantía: ${warranty.warrantyType}
Fecha de Inicio: ${warranty.startDate}
Fecha de Vencimiento: ${warranty.endDate}
Estado: ${warranty.status}

Cobertura:
${warranty.coverage.map(item => `- ${item}`).join('\n')}

Notas: ${warranty.notes}

Este certificado garantiza que el producto mencionado está cubierto bajo los términos y condiciones de la garantía W2SYS.

Fecha de Emisión: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garantia-${warranty.productName.replace(/\s+/g, '-')}-${warranty.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = getWarrantyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sistema de Garantías
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona garantías y servicios de productos
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Garantía
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Garantía</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product">Producto</Label>
                <Select value={newWarranty.productId} onValueChange={(value) => setNewWarranty({ ...newWarranty, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.model} - {product.serial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customerName">Nombre del Cliente</Label>
                <Input
                  id="customerName"
                  value={newWarranty.customerName}
                  onChange={(e) => setNewWarranty({ ...newWarranty, customerName: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email del Cliente</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newWarranty.customerEmail}
                  onChange={(e) => setNewWarranty({ ...newWarranty, customerEmail: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="warrantyType">Tipo de Garantía</Label>
                <Select value={newWarranty.warrantyType} onValueChange={(value: any) => setNewWarranty({ ...newWarranty, warrantyType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Fabricante</SelectItem>
                    <SelectItem value="extended">Extendida</SelectItem>
                    <SelectItem value="service">Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newWarranty.startDate}
                    onChange={(e) => setNewWarranty({ ...newWarranty, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Vencimiento</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newWarranty.endDate}
                    onChange={(e) => setNewWarranty({ ...newWarranty, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={newWarranty.notes}
                  onChange={(e) => setNewWarranty({ ...newWarranty, notes: e.target.value })}
                  placeholder="Notas adicionales sobre la garantía"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addWarranty}>
                  Registrar Garantía
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantías Activas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              En vigencia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas a Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiring}</div>
            <p className="text-xs text-muted-foreground">
              En 30 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Cubierto</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              En garantías
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Garantías */}
      <div className="space-y-4">
        {warranties.map((warranty) => {
          const status = getWarrantyStatus(warranty);
          const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Activa' },
            expiring: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, text: 'Próxima a Vencer' },
            expired: { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Vencida' },
            void: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Anulada' }
          };

          const config = statusConfig[status];
          const Icon = config.icon;

          return (
            <Card key={warranty.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{warranty.productName}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cliente: {warranty.customerName} ({warranty.customerEmail})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={config.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.text}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateWarrantyCertificate(warranty)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Certificado
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWarranty(warranty)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Tipo</p>
                    <p className="text-sm text-gray-600 capitalize">{warranty.warrantyType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inicio</p>
                    <p className="text-sm text-gray-600">{warranty.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vencimiento</p>
                    <p className="text-sm text-gray-600">{warranty.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cobertura</p>
                    <p className="text-sm text-gray-600">{warranty.coverage.length} elementos</p>
                  </div>
                </div>
                
                {warranty.coverage.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Elementos Cubiertos:</p>
                    <div className="flex flex-wrap gap-2">
                      {warranty.coverage.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {warranty.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Notas:</p>
                    <p className="text-sm text-gray-600">{warranty.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detalles de Garantía */}
      {selectedWarranty && (
        <Dialog open={!!selectedWarranty} onOpenChange={() => setSelectedWarranty(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de Garantía: {selectedWarranty.productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información de la Garantía */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="text-sm">{selectedWarranty.customerName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedWarranty.customerEmail}</p>
                </div>
                <div>
                  <Label>Tipo de Garantía</Label>
                  <p className="text-sm capitalize">{selectedWarranty.warrantyType}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <p className="text-sm">{getWarrantyStatus(selectedWarranty)}</p>
                </div>
                <div>
                  <Label>Fecha de Inicio</Label>
                  <p className="text-sm">{selectedWarranty.startDate}</p>
                </div>
                <div>
                  <Label>Fecha de Vencimiento</Label>
                  <p className="text-sm">{selectedWarranty.endDate}</p>
                </div>
              </div>

              {/* Historial de Servicios */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Historial de Servicios</h3>
                <div className="space-y-2">
                  {serviceRecords.filter(sr => sr.warrantyId === selectedWarranty.id).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{record.serviceType}</p>
                        <p className="text-sm text-gray-600">{record.description}</p>
                        <p className="text-xs text-gray-500">por {record.technician} - {record.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${record.cost.toLocaleString()}</p>
                        <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
