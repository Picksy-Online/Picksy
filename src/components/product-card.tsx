
'use client';

import React, { useState } from "react";
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

import { ProductImageLightbox } from "@/components/product-image-lightbox";

export function ProductCard({ product, forceSquare = false }: ProductCardProps) {
  const isCollectorCard = product.category === 'Collector Cards';
  const isCollectorCoin = product.category === 'Collector Coins';
  const { viewedProductIds } = useViewedProducts();
  const isViewed = viewedProductIds.includes(product.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Long press logic
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPress = React.useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setIsLightboxOpen(true);
    }, 500); // 500ms for long press
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (product.imageUrls.length <= 1) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const sectionWidth = width / product.imageUrls.length;
    const index = Math.floor(x / sectionWidth);

    // Ensure index is within bounds
    const newIndex = Math.max(0, Math.min(index, product.imageUrls.length - 1));
    setActiveImageIndex(newIndex);
  };

  const handleMouseLeave = () => {
    setActiveImageIndex(0);
    endPress();
  };

  return (
    <>
      <ProductQuickView product={product}>
        <div
          className={cn(
            "relative flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out cursor-pointer group w-full",
            !isCollectorCoin && "shadow-sm rounded-lg bg-card",
            isCollectorCard && styles.collectorCard
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={startPress}
          onMouseUp={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          onClick={(e) => {
            if (isLongPress.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute z-20 rounded-full hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity",
              isCollectorCoin ? "top-2 left-1/2 -translate-x-1/2 ml-4" : "top-2 right-2"
            )}
          >
            <Heart className="w-5 h-5 text-white" />
            <span className="sr-only">Favourite</span>
          </Button>
          {isViewed && (
            <div
              className={cn(
                "absolute z-20 bg-black/50 rounded-full p-1.5 backdrop-blur-sm",
                isCollectorCoin ? "top-2 left-1/2 -translate-x-1/2 -ml-4" : "top-2 left-2"
              )}
            >
              <Eye className="w-4 h-4 text-white" />
              <span className="sr-only">Viewed</span>
            </div>
          )}
          <div
            className={cn(
              "relative w-full",
              forceSquare ? "aspect-square" : (isCollectorCard ? "aspect-[1/1.4]" : "aspect-square"),
              product.category === 'Collector Coins' && "rounded-full overflow-hidden aspect-square"
            )}
          >
            {/* Primary Image (Active) */}
            <Image
              src={product.imageUrls[activeImageIndex] || product.imageUrls[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={cn(
                "object-cover w-full h-full transition-all duration-300 rounded-lg group-hover:scale-105",
                product.category === 'Collector Coins' && "rounded-full"
              )}
              data-ai-hint={product.imageHint}
            />

            {isCollectorCard && <div className={styles.holoShine} />}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg pointer-events-none",
              product.category === 'Collector Coins' && "rounded-full"
            )} />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none text-center">
              <h3 className="text-base font-semibold truncate font-headline">{product.name}</h3>
              <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
            </div>

            {/* Image Navigation Indicators (Optional, for better UX) */}
            {product.imageUrls.length > 1 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                {product.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1 rounded-full flex-1 max-w-[20px] transition-colors shadow-sm",
                      idx === activeImageIndex ? "bg-white" : "bg-white/30"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ProductQuickView>

      <ProductImageLightbox
        product={product}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
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
