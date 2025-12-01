'use client';

import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { useViewedProducts } from "@/context/ViewedProductsContext";
import { useMemo } from "react";

export default function ViewedListingsPage() {
    const { viewedProductIds } = useViewedProducts();

    const viewedProducts = useMemo(() => {
        // Map IDs back to product objects, preserving the order of viewedProductIds (most recent first)
        return viewedProductIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is typeof products[0] => p !== undefined);
    }, [viewedProductIds]);

    return (
        <div className="pt-5 pb-12 p-5">
            <h1 className="text-3xl font-bold font-headline">Recently Viewed</h1>
            <p className="mt-2 text-muted-foreground">Listings you've checked out recently.</p>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8">
                {viewedProducts.length > 0 ? (
                    viewedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-muted-foreground">
                        You haven't viewed any listings yet.
                    </p>
                )}
            </div>
        </div>
    );
}
