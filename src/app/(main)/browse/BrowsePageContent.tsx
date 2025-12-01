
'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts } from '@/services/product-service';
import { Product, ProductSearchParams } from '@/lib/types';
import { ListingGrid } from '@/components/browse/ListingGrid';
import ImageLightbox from '@/components/browse/ImageLightbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, LayoutGrid, List, GalleryVertical, SlidersHorizontal } from 'lucide-react';
import MobileFiltersModal from '@/components/browse/MobileFiltersModal';
import FiltersBar from '@/components/browse/FiltersBar';

type ViewMode = 'grid' | 'list' | 'gallery';

// Number of items to fetch per page
const PAGE_SIZE = 12;

export default function BrowsePageContent({ searchParams: initialSearchParams }: { searchParams: ProductSearchParams }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>((initialSearchParams.view as ViewMode) || 'gallery');
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const createQueryString = useCallback(
    (newParams: Record<string, string>) => {
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
  
  const handleSortChange = (value: string) => {
    const newQuery = createQueryString({ sort: value, page: '1' });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    const newQuery = createQueryString({ view: mode });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  }

  const loadProducts = useCallback(async (pageNum: number) => {
    if (pageNum === 1) {
        setLoadingInitial(true);
    } else {
        setLoadingMore(true);
    }

    try {
        const { products: newProducts, hasMore: newHasMore } = await getProducts({
            ...initialSearchParams,
            page: pageNum.toString(),
            limit: PAGE_SIZE.toString(),
        });

        setProducts(prev => pageNum === 1 ? newProducts : [...prev, ...newProducts]);
        setHasMore(newHasMore);
        setPage(pageNum);
    } catch (error) {
        console.error("Failed to load products:", error);
    } finally {
        if (pageNum === 1) {
            setLoadingInitial(false);
        } else {
            setLoadingMore(false);
        }
    }
}, [initialSearchParams]);


  useEffect(() => {
    loadProducts(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchParams]);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
        loadProducts(page + 1);
    }
  }

  const handleImageClick = (product: Product, index: number = 0) => {
    const images = product.imageUrls;
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold font-headline text-foreground">Marketplace</h1>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
              <FiltersBar />
            </div>
            <Select value={initialSearchParams.sort || 'newest'} onValueChange={handleSortChange}>
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
                <Button variant={viewMode === 'gallery' ? 'secondary': 'ghost'} size="icon" onClick={() => handleViewChange('gallery')}><GalleryVertical /></Button>
            </div>
             <div className="md:hidden">
              <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
        
        {loadingInitial ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {[...Array(8)].map((_, i) => <div key={i} className="space-y-2"><div className="w-full bg-muted rounded-lg aspect-square" /><div className="w-3/4 h-5 bg-muted rounded-md" /><div className="w-1/2 h-5 bg-muted rounded-md" /></div>)}
          </div>
        ) : (
          <div className="mt-6">
            <ListingGrid
              products={products}
              viewMode={viewMode}
              onImageClick={handleImageClick}
            />
          </div>
        )}

        {hasMore && !loadingInitial && (
          <div className="flex justify-center mt-8">
            <Button onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? <Loader2 className="animate-spin mr-2" /> : "Load More"}
            </Button>
          </div>
        )}
         {!hasMore && products.length > 0 && (
              <div className="py-8 text-center text-muted-foreground">
                  <p>You&apos;ve reached the end of the list.</p>
              </div>
          )}
      </div>

      <MobileFiltersModal 
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={() => {
            setIsFiltersModalOpen(false);
        }}
        onReset={() => {}}
      />

      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
