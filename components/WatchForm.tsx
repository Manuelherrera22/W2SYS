'use client';

import * as React from 'react';
import { Watch, WatchFormData, WatchCondition, WatchStatus, WatchMovement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WatchFormProps {
  watch?: Watch;
  onSubmit: (data: WatchFormData) => void;
  onCancel: () => void;
}

const movements: WatchMovement[] = ['Automatic', 'Manual', 'Quartz', 'Digital'];
const conditions: WatchCondition[] = ['Mint', 'Excellent', 'Good', 'Fair', 'Poor'];
const statuses: WatchStatus[] = ['Available', 'Sold', 'Reserved', 'Under Maintenance'];

export function WatchForm({ watch, onSubmit, onCancel }: WatchFormProps) {
  const [formData, setFormData] = React.useState<WatchFormData>({
    brand: watch?.brand || '',
    model: watch?.model || '',
    referenceNumber: watch?.referenceNumber || '',
    serialNumber: watch?.serialNumber || '',
    year: watch?.year,
    movement: watch?.movement || 'Automatic',
    caseMaterial: watch?.caseMaterial || '',
    caseSize: watch?.caseSize || '',
    dialColor: watch?.dialColor || '',
    braceletMaterial: watch?.braceletMaterial || '',
    condition: watch?.condition || 'Good',
    status: watch?.status || 'Available',
    purchasePrice: watch?.purchasePrice,
    sellingPrice: watch?.sellingPrice,
    currentValue: watch?.currentValue,
    location: watch?.location || '',
    notes: watch?.notes || '',
    imageUrl: watch?.imageUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Rolex, Omega, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Submariner, Speedmaster, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference Number *</Label>
          <Input
            id="referenceNumber"
            required
            value={formData.referenceNumber}
            onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
            placeholder="116610LN"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder={new Date().getFullYear().toString()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="movement">Movement *</Label>
          <Select value={formData.movement} onValueChange={(value) => setFormData({ ...formData, movement: value as WatchMovement })}>
            <SelectTrigger id="movement">
              <SelectValue placeholder="Select movement" />
            </SelectTrigger>
            <SelectContent>
              {movements.map((movement) => (
                <SelectItem key={movement} value={movement}>
                  {movement}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseMaterial">Case Material *</Label>
          <Input
            id="caseMaterial"
            required
            value={formData.caseMaterial}
            onChange={(e) => setFormData({ ...formData, caseMaterial: e.target.value })}
            placeholder="Stainless Steel, Gold, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseSize">Case Size *</Label>
          <Input
            id="caseSize"
            required
            value={formData.caseSize}
            onChange={(e) => setFormData({ ...formData, caseSize: e.target.value })}
            placeholder="40mm, 42mm, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dialColor">Dial Color *</Label>
          <Input
            id="dialColor"
            required
            value={formData.dialColor}
            onChange={(e) => setFormData({ ...formData, dialColor: e.target.value })}
            placeholder="Black, Blue, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="braceletMaterial">Bracelet Material *</Label>
          <Input
            id="braceletMaterial"
            required
            value={formData.braceletMaterial}
            onChange={(e) => setFormData({ ...formData, braceletMaterial: e.target.value })}
            placeholder="Stainless Steel, Leather, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value as WatchCondition })}>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as WatchStatus })}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
          <Input
            id="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.purchasePrice || ''}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="10000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price ($)</Label>
          <Input
            id="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice || ''}
            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="15000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentValue">Current Value ($)</Label>
          <Input
            id="currentValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.currentValue || ''}
            onChange={(e) => setFormData({ ...formData, currentValue: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="12500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Safe, Display Case, etc."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/watch-image.jpg"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional information about the watch..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {watch ? 'Update Watch' : 'Add Watch'}
        </Button>
      </div>
    </form>
  );
}




