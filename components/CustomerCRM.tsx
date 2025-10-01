'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, MapPin, Calendar, DollarSign, Package, Star, Users } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalPurchases: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastPurchase?: string;
  notes: string;
  tags: string[];
}

interface Purchase {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export function CustomerCRM() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, New York, NY',
      createdAt: '2024-01-15',
      totalPurchases: 3,
      totalSpent: 45000,
      loyaltyPoints: 450,
      lastPurchase: '2024-01-20',
      notes: 'Cliente VIP, prefiere Submariner',
      tags: ['VIP', 'Regular']
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+1 234 567 8901',
      address: '456 Oak Ave, Los Angeles, CA',
      createdAt: '2024-01-10',
      totalPurchases: 1,
      totalSpent: 12000,
      loyaltyPoints: 120,
      lastPurchase: '2024-01-10',
      notes: 'Interesada en modelos vintage',
      tags: ['New', 'Vintage']
    }
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      customerId: '1',
      productId: '1',
      productName: 'Submariner 126610LN',
      amount: 15000,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '2',
      customerId: '1',
      productId: '2',
      productName: 'GMT Master 126710BLNR',
      amount: 18000,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '3',
      customerId: '2',
      productId: '3',
      productName: 'Daytona 116500LN',
      amount: 12000,
      date: '2024-01-10',
      status: 'completed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    tags: []
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      address: newCustomer.address || '',
      createdAt: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      notes: newCustomer.notes || '',
      tags: newCustomer.tags || []
    };

    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      tags: []
    });
    setIsAddDialogOpen(false);
  };

  const getCustomerPurchases = (customerId: string) => {
    return purchases.filter(p => p.customerId === customerId);
  };

  const getTotalRevenue = () => {
    return purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  };

  const getAverageOrderValue = () => {
    return purchases.length > 0 ? getTotalRevenue() / purchases.length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes (CRM)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu base de clientes y relaciones
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Dirección completa"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Notas sobre el cliente"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addCustomer}>
                  Agregar Cliente
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
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalRevenue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              De todas las ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getAverageOrderValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Por compra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.tags.includes('VIP')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con etiqueta VIP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar clientes por nombre, email o etiquetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <div className="flex space-x-1">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Cliente desde {customer.createdAt}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-sm font-medium">Compras</p>
                    <p className="text-lg font-bold">{customer.totalPurchases}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Gastado</p>
                    <p className="text-lg font-bold">${customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {customer.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Notas:</strong> {customer.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detalles del Cliente */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente: {selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información del Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label>Dirección</Label>
                  <p className="text-sm">{selectedCustomer.address}</p>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedCustomer.totalPurchases}</p>
                  <p className="text-sm text-gray-600">Compras</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold">{selectedCustomer.loyaltyPoints}</p>
                  <p className="text-sm text-gray-600">Puntos</p>
                </div>
              </div>

              {/* Historial de Compras */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Historial de Compras</h3>
                <div className="space-y-2">
                  {getCustomerPurchases(selectedCustomer.id).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{purchase.productName}</p>
                        <p className="text-sm text-gray-600">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${purchase.amount.toLocaleString()}</p>
                        <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                          {purchase.status}
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
