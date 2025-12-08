'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { users } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { searchEbaySold, SearchEbaySoldOutput } from '@/ai/flows/search-ebay-sold';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2, Search, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageZoom } from '@/components/image-zoom';
import { useCart } from '@/context/CartContext';
import ProductReviews from '@/components/product/ProductReviews';
import { useViewedProducts } from '@/context/ViewedProductsContext';
import { useEffect } from 'react';

import { GradingBadge } from "@/components/product/grading-badge";
import { PriceHistoryChart } from "@/components/product/price-history-chart";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function EbaySoldListings({ listings }: { listings: SearchEbaySoldOutput['soldListings'] }) {
  if (listings.length === 0) {
    return <p>No recent sold listings found on eBay.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent eBay Sales (Last 90 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date Sold</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <a href={listing.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {listing.title}
                  </a>
                </TableCell>
                <TableCell>{listing.date}</TableCell>
                <TableCell className="text-right">{listing.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function ProductPageContent({ product, initialRecommendedProducts }: { product: Product, initialRecommendedProducts: Product[] }) {
  const [ebayListings, setEbayListings] = useState<SearchEbaySoldOutput | null>(null);
  const [isSearchingEbay, setIsSearchingEbay] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();
  const { markAsViewed } = useViewedProducts();
  const router = useRouter();

  useEffect(() => {
    markAsViewed(product.id);
  }, [product.id, markAsViewed]);

  const seller = users.find((u) => u.id === product.sellerId);
  const isCollectorCard = product.category === 'Collector Cards';

  const handleSearchEbay = async () => {
    setIsSearchingEbay(true);
    setEbayListings(null);
    try {
      const result = await searchEbaySold({ cardName: product.name });
      setEbayListings(result);
    } catch (error) {
      console.error("eBay search failed", error);
    } finally {
      setIsSearchingEbay(false);
    }
  }

  return (
    <div className="container py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="w-full max-w-[500px] mx-auto space-y-4">
          <div className="relative overflow-hidden rounded-lg border bg-background">
            <ImageZoom
              src={product.imageUrls[selectedImageIndex]}
              alt={product.name}
              className={cn(
                "w-full transition-all duration-300",
                isCollectorCard ? "aspect-[1/1.4]" : "aspect-square",
                product.category === 'Collector Coins' && "rounded-full"
              )}
              imageHint={product.imageHint}
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setSelectedImageIndex(index)}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0",
                    selectedImageIndex === index ? "border-primary" : "border-transparent"
                  )}
                >
                  <img src={url} alt={`View ${index + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <div className="flex items-center text-yellow-500 text-sm font-medium">
                <Star className="w-4 h-4 fill-current mr-1" />
                4.8 (12 reviews)
              </div>
            </div>

            {product.gradingCompany && (
              <GradingBadge
                company={product.gradingCompany}
                grade={product.grade}
                className="mt-2 mb-1"
              />
            )}

            {product.year && (
              <Badge variant="outline" className="mt-2 text-sm">
                Year: {product.year}
              </Badge>
            )}

            <h1 className="mt-2 text-4xl font-extrabold tracking-tight font-headline lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>

          <Separator />

          <p className="text-lg leading-relaxed text-foreground/80">
            {product.description}
          </p>

          {seller && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <Link href={`/store/${seller.id}`} className="flex items-center gap-4 group">
                <Avatar className="w-12 h-12 border-2 border-background">
                  <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                  <AvatarFallback>{seller.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sold by</p>
                  <h3 className="text-base font-bold transition-colors group-hover:text-primary">
                    {seller.storeName}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    4.9 Seller Rating
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <Button size="lg" className="w-full text-lg h-12" onClick={() => addItem(product)}>
              Add to Cart
            </Button>
            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1">Make Offer</Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Heart className="mr-2 h-4 w-4" />
                Favourite
              </Button>
            </div>
            {isCollectorCard && (
              <Button size="lg" variant="secondary" onClick={handleSearchEbay} disabled={isSearchingEbay} className="w-full">
                {isSearchingEbay ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search Sold Listings
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              In Stock
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Ships from Australia
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <PriceHistoryChart currentPrice={product.price} />
      </div>

      {isCollectorCard && (
        <div className="mt-12">
          {isSearchingEbay && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {ebayListings && <EbaySoldListings listings={ebayListings.soldListings} />}
        </div>
      )}

      <Separator className="my-16" />

      <ProductReviews />

      <Separator className="my-16" />

      <div>
        <h2 className="mb-8 text-3xl font-bold text-center font-headline">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {initialRecommendedProducts.map((recProduct) => (
            <ProductCard key={recProduct.id} product={recProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}
