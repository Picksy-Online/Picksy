

'use client';

import { Product } from '@/lib/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { useAuth } from '@/hooks/use-auth';
import { getProducts } from '@/services/product-service';

const BATCH_SIZE = 14;

export default function ProductGrid() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    const { products: newProducts, hasMore: newHasMore } =
      await getProducts({
        page: nextPage.toString(),
        limit: BATCH_SIZE.toString(),
        category: '!Collector Cards' // Exclude collector cards from this grid
      });
    
    setProducts(prev => [...prev, ...newProducts]);
    setPage(nextPage);
    setHasMore(newHasMore);
    setLoading(false);
  }, [page, hasMore, loading]);

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreProducts]
  );
  
  useEffect(() => {
    // initial load
    if (page === 0) {
      loadMoreProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

  if (page === 0 && loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="w-full aspect-[5/7]" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {uniqueProducts.map((product, index) => {
          const isLastElement = index === uniqueProducts.length - 1;
          return (
            <div
              ref={isLastElement ? lastProductElementRef : null}
              key={`${product.id}-${index}`}
            >
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>
      {uniqueProducts.length === 0 && !loading && (
        <div className="col-span-full flex h-[400px] items-center justify-center bg-background">
          <p className="text-muted-foreground">
            No products found.
          </p>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!hasMore && uniqueProducts.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <p>You&apos;ve reached the end of the list.</p>
        </div>
      )}
    </div>
  );
}

    
