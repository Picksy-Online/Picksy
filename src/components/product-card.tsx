
'use client';

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductQuickView } from "@/components/product-quick-view";
import { Button } from "./ui/button";
import { Heart, Eye } from "lucide-react";
import styles from './ProductCard.module.css';
import { useViewedProducts } from "@/context/ViewedProductsContext";

type ProductCardProps = {
  product: Product;
  forceSquare?: boolean;
};

export function ProductCard({ product, forceSquare = false }: ProductCardProps) {
  const isCollectorCard = product.category === 'Collector Cards';
  const { viewedProductIds } = useViewedProducts();
  const isViewed = viewedProductIds.includes(product.id);

  return (
    <ProductQuickView product={product}>
      <div
        className={cn(
          "relative flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out shadow-sm cursor-pointer group rounded-lg bg-card w-full",
          isCollectorCard && styles.collectorCard
        )}
      >
        <Button size="icon" variant="ghost" className="absolute top-2 right-2 z-20 rounded-full hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-5 h-5 text-white" />
          <span className="sr-only">Favourite</span>
        </Button>
        {isViewed && (
          <div className="absolute top-2 left-2 z-20 bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
            <Eye className="w-4 h-4 text-white" />
            <span className="sr-only">Viewed</span>
          </div>
        )}
        <div
          className={cn(
            "relative w-full",
            forceSquare ? "aspect-square" : (isCollectorCard ? "aspect-[1/1.4]" : "aspect-square")
          )}
        >
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover w-full h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
            data-ai-hint={product.imageHint}
          />
          {isCollectorCard && <div className={styles.holoShine} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-base font-semibold truncate font-headline">{product.name}</h3>
            <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
          </div>
        </div>
      </div>
    </ProductQuickView>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <Skeleton className="w-full aspect-square" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}
