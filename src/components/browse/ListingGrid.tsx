
"use client";

import React from "react";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type ListingGridProps = {
  products: Product[];
  viewMode: "grid" | "list" | "gallery";
  onImageClick: (product: Product) => void;
};

export function ListingGrid({ products, viewMode, onImageClick }: ListingGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} onImageClick={onImageClick} />
        ))}
      </div>
    );
  }

  if (viewMode === 'gallery') {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
        {products.map(product => (
          <div key={product.id} className="break-inside-avoid">
            <ProductCard product={product} viewMode={viewMode} onImageClick={onImageClick} />
          </div>
        ))}
      </div>
    );
  }

  // Default to grid
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} onImageClick={onImageClick} />
      ))}
    </div>
  );
}
