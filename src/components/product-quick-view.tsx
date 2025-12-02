
'use client';

import { useState } from 'react';
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
import { useViewedProducts } from '@/context/ViewedProductsContext';

type ProductQuickViewProps = {
  product: Product;
  children: React.ReactNode;
};

export function ProductQuickView({ product, children }: ProductQuickViewProps) {
  const { user } = useAuth() as { user: any }; // Cast to any to avoid type error for now, or import User type
  const isCollectorCard = product.category === 'Collector Cards';
  const canEdit = user?.email === '1@1.com' || user?.id === product.sellerId;
  const { markAsViewed } = useViewedProducts();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <Dialog onOpenChange={(open) => {
      if (open) markAsViewed(product.id);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <ImageZoom
              src={product.imageUrls[selectedImageIndex]}
              alt={product.name}
              className={cn(
                "w-full overflow-hidden",
                isCollectorCard ? "aspect-[1/1.4] rounded-lg" : "aspect-square rounded-lg",
                product.category === 'Collector Coins' && "rounded-full"
              )}
              imageHint={product.imageHint}
            />
            {product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSelectedImageIndex(index)}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 cursor-pointer",
                      selectedImageIndex === index ? "border-primary" : "border-transparent"
                    )}
                  >
                    <Image
                      src={url}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
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
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  Make Offer
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Favourite
                </Button>
                {canEdit && (
                  <Button variant="secondary" size="lg" className="flex-1">
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
