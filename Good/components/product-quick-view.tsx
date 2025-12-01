
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Heart, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ImageZoom } from './image-zoom';

type ProductQuickViewProps = {
  product: Product;
  children: React.ReactNode;
};

export function ProductQuickView({ product, children }: ProductQuickViewProps) {
  const { user } = useAuth();
  const isCollectorCard = product.category === 'Collector Cards';
  const canEdit = user?.email === '1@1.com' || user?.id === product.sellerId;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageZoom 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className={cn("w-full rounded-lg overflow-hidden", isCollectorCard ? "aspect-[1/1.4]" : "aspect-square")}
            imageHint={product.imageHint}
          />
          <div className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold tracking-tight font-headline lg:text-4xl">
                 <Badge variant="secondary">{product.category}</Badge>
                <div className="mt-2">{product.name}</div>
              </DialogTitle>
            </DialogHeader>

            <p className="mt-4 text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="text-lg leading-relaxed text-foreground/80">
              {product.description}
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild size="lg">
                <Link href={`/product/${product.id}`}>View Full Details</Link>
              </Button>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="lg">
                  Make Offer
                </Button>
                 <Button variant="outline" size="lg">
                   <Heart className="mr-2 h-4 w-4" />
                  Favourite
                </Button>
                 {canEdit && (
                  <Button variant="secondary" size="lg">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
