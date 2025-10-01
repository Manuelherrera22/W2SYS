'use client';

import * as React from 'react';
import { Watch } from '@/lib/types';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface WatchDetailsProps {
  watch: Watch;
}

export function WatchDetails({ watch }: WatchDetailsProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">{watch.brand} - {watch.model}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {watch.imageUrl && (
          <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            <img src={watch.imageUrl} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-contain" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Reference Number</p>
            <p className="font-medium">{watch.referenceNumber}</p>
          </div>

          {watch.serialNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{watch.serialNumber}</p>
            </div>
          )}

          {watch.year && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{watch.year}</p>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Movement</p>
            <p className="font-medium">{watch.movement}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Case Material</p>
            <p className="font-medium">{watch.caseMaterial}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Case Size</p>
            <p className="font-medium">{watch.caseSize}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dial Color</p>
            <p className="font-medium">{watch.dialColor}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Bracelet Material</p>
            <p className="font-medium">{watch.braceletMaterial}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Condition</p>
            <p className="font-medium">{watch.condition}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{watch.status}</p>
          </div>

          {watch.location && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{watch.location}</p>
            </div>
          )}
        </div>

        {(watch.purchasePrice || watch.sellingPrice || watch.currentValue) && (
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-3">Pricing Information</h3>
            <div className="grid grid-cols-3 gap-4">
              {watch.purchasePrice && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-medium text-lg">${watch.purchasePrice.toLocaleString()}</p>
                </div>
              )}

              {watch.sellingPrice && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  <p className="font-medium text-lg">${watch.sellingPrice.toLocaleString()}</p>
                </div>
              )}

              {watch.currentValue && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium text-lg text-primary">${watch.currentValue.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {watch.notes && (
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{watch.notes}</p>
          </div>
        )}

        <div className="border-t border-border pt-4 text-xs text-muted-foreground">
          <p>Created: {format(new Date(watch.createdAt), 'PPpp')}</p>
          <p>Last Updated: {format(new Date(watch.updatedAt), 'PPpp')}</p>
        </div>
      </div>
    </DialogContent>
  );
}




