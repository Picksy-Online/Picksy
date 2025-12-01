

'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts } from '@/services/product-service';
import type { Product, ProductSearchParams } from '@/lib/types';
import ProductCard from '@/components/browse/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

type ViewMode = 'grid' | 'list';
const PAGE_SIZE = 24;

export default function CollectorCardsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();
  
  const initialSearchParams = useMemo(() => {
    const params: ProductSearchParams = { category: 'Collector Cards' };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);
  
  const [viewMode, setViewMode] = useState<ViewMode>((initialSearchParams.view as ViewMode) || 'grid');

  const createQueryString = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(newParams)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleFilterChange = (key: string, value: string | null) => {
    const newQuery = createQueryString({ [key]: value, page: '1' });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    const newQuery = createQueryString({ view: mode });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  }

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    
    try {
      const { products: newProducts, hasMore: newHasMore } = await getProducts({
        ...initialSearchParams,
        page: nextPage.toString(),
        limit: PAGE_SIZE.toString(),
      });

      setProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }, [initialSearchParams, loading, hasMore, page]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [initialSearchParams]);
  
  useEffect(() => {
    if (page === 0 && hasMore) {
        loadMoreProducts();
    }
  }, [page, hasMore, loadMoreProducts]);

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreProducts]);

  const renderProducts = () => {
    if (page === 0 && loading) {
        return (
             <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {[...Array(18)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="bg-muted aspect-[5/7] rounded-lg" />
                </div>
                ))}
            </div>
        )
    }
    
    const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

    if (uniqueProducts.length === 0) {
      return (
        <p className="col-span-full text-center text-muted-foreground py-12">
          No collector cards found matching your criteria.
        </p>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <div className="space-y-4">
          {uniqueProducts.map((product, index) => {
            const isLastElement = index === uniqueProducts.length - 1;
            return <div ref={isLastElement ? lastProductElementRef : null} key={`${product.id}-${index}`}>
              <ProductCard product={product} viewMode={viewMode} />
            </div>
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {uniqueProducts.map((product, index) => {
           const isLastElement = index === uniqueProducts.length - 1;
           return <div ref={isLastElement ? lastProductElementRef : null} key={`${product.id}-${index}`}>
             <ProductCard product={product} viewMode={viewMode} />
           </div>
        })}
      </div>
    );
  };
  
  return (
    <div className='p-8'>
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                  <SidebarTrigger />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold font-headline text-foreground">Collector Cards</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Select value={initialSearchParams.sort || 'newest'} onValueChange={(v) => handleFilterChange('sort', v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex items-center rounded-md border bg-card p-1">
              <Button variant={viewMode === 'grid' ? 'secondary': 'ghost'} size="icon" onClick={() => handleViewChange('grid')}><LayoutGrid /></Button>
              <Button variant={viewMode === 'list' ? 'secondary': 'ghost'} size="icon" onClick={() => handleViewChange('list')}><List /></Button>
            </div>
          </div>
        </header>

        {renderProducts()}
  
        {loading && (
          <div className="flex justify-center mt-8">
            <Loader2 className="animate-spin" />
          </div>
        )}

         {!hasMore && products.length > 0 && (
              <div className="py-12 text-center text-muted-foreground">
                  <p>You&apos;ve reached the end of the list.</p>
              </div>
          )}
    </div>
  );
}
    
