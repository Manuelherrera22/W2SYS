'use client';

import * as React from 'react';
import { Watch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  onEdit: (watch: Watch) => void;
  onDelete: (id: string) => void;
  onView: (watch: Watch) => void;
}

export function WatchCard({ watch, onEdit, onDelete, onView }: WatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-green-500';
      case 'Sold': return 'text-red-500';
      case 'Reserved': return 'text-yellow-500';
      case 'Under Maintenance': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Mint': return 'text-emerald-400';
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-yellow-400';
      case 'Fair': return 'text-orange-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border/50">
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {watch.imageUrl ? (
          <img src={watch.imageUrl} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-2">⌚</div>
            <p className="text-sm text-muted-foreground">No Image</p>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-start justify-between">
          <span>{watch.brand}</span>
          <span className={`text-sm font-normal ${getStatusColor(watch.status)}`}>{watch.status}</span>
        </CardTitle>
        <CardDescription className="text-base">{watch.model}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Reference</p>
            <p className="font-medium">{watch.referenceNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Year</p>
            <p className="font-medium">{watch.year || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Movement</p>
            <p className="font-medium">{watch.movement}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Condition</p>
            <p className={`font-medium ${getConditionColor(watch.condition)}`}>{watch.condition}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Case Size</p>
            <p className="font-medium">{watch.caseSize}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Material</p>
            <p className="font-medium">{watch.caseMaterial}</p>
          </div>
        </div>
        
        {watch.currentValue && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-muted-foreground text-sm">Current Value</p>
            <p className="text-2xl font-bold text-primary">
              ${watch.currentValue.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(watch)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(watch)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(watch.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}




