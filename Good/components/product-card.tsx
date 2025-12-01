
'use client';

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductQuickView } from "@/components/product-quick-view";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import styles from './ProductCard.module.css';
import { useRef } from "react";
import { useAnimation } from "@/context/AnimationContext";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { animationsEnabled } = useAnimation();
  const isCollectorCard = product.category === 'Collector Cards';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isCollectorCard || !animationsEnabled) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = -1 * ((x - rect.width / 2) / (rect.width / 2)) * 10;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 10;
    cardRef.current.style.setProperty('--rotateX', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotateY', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
        cardRef.current.style.setProperty('--rotateX', '0deg');
        cardRef.current.style.setProperty('--rotateY', '0deg');
    }
  };

  return (
    <ProductQuickView product={product}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out shadow-sm cursor-pointer group bg-card w-full border",
          isCollectorCard && animationsEnabled && styles.collectorCard
        )}
      >
          <div 
            className={cn(
              "relative w-full overflow-hidden",
              "aspect-[5/7]"
            )}
          >
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.imageHint}
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1">
              {formatCurrency(product.price)}
            </div>
          </div>
           <div className="p-3 flex flex-col justify-between flex-grow min-h-[60px]">
            <div>
              <p className="text-sm font-semibold truncate font-headline">{product.name}</p>
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
