"use client";

import React from "react";
import ProductGrid from "@/components/product-grid";

/**
 * This component wraps the main product grid functionality for the homepage.
 */
export default function ProductsGrid({ limit }: { limit?: number }) {
  return (
    <ProductGrid limit={limit} />
  );
}
