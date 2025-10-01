'use client';

import * as React from 'react';
import { Watch, WatchFormData } from '@/lib/types';
import { WatchCard } from './WatchCard';
import { WatchForm } from './WatchForm';
import { WatchDetails } from './WatchDetails';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Watch as WatchIcon, DollarSign, TrendingUp, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Dashboard() {
  const [watches, setWatches] = React.useState<Watch[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
  const [selectedWatch, setSelectedWatch] = React.useState<Watch | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  React.useEffect(() => {
    const storedWatches = localStorage.getItem('watches');
    if (storedWatches) {
      setWatches(JSON.parse(storedWatches));
    } else {
      // Add sample data
      const sampleWatches: Watch[] = [
        {
          id: '1',
          brand: 'Rolex',
          model: 'Submariner',
          referenceNumber: '116610LN',
          serialNumber: 'Z123456',
          year: 2020,
          movement: 'Automatic',
          caseMaterial: 'Stainless Steel',
          caseSize: '40mm',
          dialColor: 'Black',
          braceletMaterial: 'Stainless Steel',
          condition: 'Excellent',
          status: 'Available',
          purchasePrice: 8500,
          sellingPrice: 12000,
          currentValue: 11500,
          location: 'Main Safe',
          notes: 'Box and papers included. Full set.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          brand: 'Omega',
          model: 'Speedmaster Professional',
          referenceNumber: '310.30.42.50.01.001',
          year: 2019,
          movement: 'Manual',
          caseMaterial: 'Stainless Steel',
          caseSize: '42mm',
          dialColor: 'Black',
          braceletMaterial: 'Stainless Steel',
          condition: 'Mint',
          status: 'Reserved',
          purchasePrice: 4500,
          currentValue: 5800,
          location: 'Display Case',
          notes: 'Moonwatch. Excellent condition.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setWatches(sampleWatches);
      localStorage.setItem('watches', JSON.stringify(sampleWatches));
    }
  }, []);

  const saveWatches = (newWatches: Watch[]) => {
    setWatches(newWatches);
    localStorage.setItem('watches', JSON.stringify(newWatches));
  };

  const handleAddWatch = (data: WatchFormData) => {
    const newWatch: Watch = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveWatches([...watches, newWatch]);
    setIsAddDialogOpen(false);
  };

  const handleEditWatch = (data: WatchFormData) => {
    if (!selectedWatch) return;
    const updatedWatches = watches.map((watch) =>
      watch.id === selectedWatch.id
        ? { ...watch, ...data, updatedAt: new Date().toISOString() }
        : watch
    );
    saveWatches(updatedWatches);
    setIsEditDialogOpen(false);
    setSelectedWatch(null);
  };

  const handleDeleteWatch = (id: string) => {
    if (confirm('Are you sure you want to delete this watch?')) {
      saveWatches(watches.filter((watch) => watch.id !== id));
    }
  };

  const handleViewWatch = (watch: Watch) => {
    setSelectedWatch(watch);
    setIsDetailsDialogOpen(true);
  };

  const handleEditClick = (watch: Watch) => {
    setSelectedWatch(watch);
    setIsEditDialogOpen(true);
  };

  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || watch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalValue = watches.reduce((sum, watch) => sum + (watch.currentValue || 0), 0);
  const availableCount = watches.filter((w) => w.status === 'Available').length;
  const soldCount = watches.filter((w) => w.status === 'Sold').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Watch Management System</h1>
            <p className="text-muted-foreground">Manage your luxury watch collection</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Watch
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Watches</CardTitle>
              <WatchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watches.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by brand, model, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredWatches.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">⌚</div>
            <h3 className="text-xl font-semibold mb-2">No watches found</h3>
            <p className="text-muted-foreground mb-6">
              {watches.length === 0
                ? 'Get started by adding your first watch to the collection'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {watches.length === 0 && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Watch
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onEdit={handleEditClick}
                onDelete={handleDeleteWatch}
                onView={handleViewWatch}
              />
            ))}
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Watch</DialogTitle>
            </DialogHeader>
            <WatchForm onSubmit={handleAddWatch} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Watch</DialogTitle>
            </DialogHeader>
            {selectedWatch && (
              <WatchForm
                watch={selectedWatch}
                onSubmit={handleEditWatch}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedWatch(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          {selectedWatch && <WatchDetails watch={selectedWatch} />}
        </Dialog>
      </div>
    </div>
  );
}




