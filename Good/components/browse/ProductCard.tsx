
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import styles from '../ProductCard.module.css';
import { ProductQuickView } from "../product-quick-view";
import { useAnimation } from "@/context/AnimationContext";

type ProductCardProps = {
  product: Product;
  viewMode: "grid" | "list";
};

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { animationsEnabled } = useAnimation();
  const isCollectorCard = product.category === 'Collector Cards';
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isCollectorCard || !animationsEnabled) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = -1 * ((x - rect.width / 2) / (rect.width / 2)) * 8; // Reduced rotation for subtlety
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 8;
    cardRef.current.style.setProperty('--rotateX', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotateY', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
        cardRef.current.style.setProperty('--rotateX', '0deg');
        cardRef.current.style.setProperty('--rotateY', '0deg');
    }
  };


  if (viewMode === 'list') {
    return (
       <div className="flex flex-col sm:flex-row gap-6 p-4 border bg-card group transition-shadow hover:shadow-md">
          <div
            className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 cursor-pointer overflow-hidden"
          >
            <ProductQuickView product={product}>
              <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
              />
            </ProductQuickView>
          </div>
          <div className="flex flex-col flex-grow">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-lg font-bold font-headline hover:text-primary transition-colors">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
              <p className="mt-4 text-sm text-foreground/80 flex-grow">{product.description.substring(0, 150)}{product.description.length > 150 && '...'}</p>
              <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-semibold text-primary">{formatCurrency(product.price)}</p>
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon"><Heart className="w-5 h-5"/></Button>
                      <Button asChild><Link href={`/product/${product.id}`}>View</Link></Button>
                  </div>
              </div>
          </div>
       </div>
    );
  }

  // Grid / Montage view
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
