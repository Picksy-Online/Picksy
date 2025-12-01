
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  viewMode: "grid" | "list" | "gallery";
  onImageClick: (product: Product) => void;
};

export default function ProductCard({ product, viewMode, onImageClick }: ProductCardProps) {

  if (viewMode === 'list') {
    return (
       <div className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg bg-card group transition-shadow hover:shadow-md">
          <div 
            className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 cursor-pointer overflow-hidden rounded-md"
            onClick={() => onImageClick(product)}
          >
            <Image
                src={product.imageUrls[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
            />
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

  // Grid and Gallery view
  return (
    <div
      className={cn(
        "bg-card rounded-lg overflow-hidden group border transition-all duration-300",
        viewMode === 'gallery' && "hover:scale-110 hover:shadow-2xl hover:z-10 relative"
      )}
      onClick={() => onImageClick(product)}
    >
      <div 
        className="relative w-full aspect-square cursor-pointer" 
      >
        <Image
          src={product.imageUrls[0]}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform",
            viewMode === 'grid' && "group-hover:scale-105"
           )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart />
        </Button>
      </div>
       {viewMode === 'grid' && (
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold font-headline text-foreground truncate hover:text-primary">{product.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <p className="mt-2 font-bold text-lg text-primary">{formatCurrency(product.price)}</p>
        </div>
      )}
    </div>
  );
}
