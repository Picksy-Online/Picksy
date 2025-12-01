
'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Search, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageZoom } from '@/components/image-zoom';

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
    <div>
      <div className="py-12 px-4 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="w-full max-w-[400px] mx-auto">
            <ImageZoom
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className={cn("w-full rounded-lg overflow-hidden", isCollectorCard ? "aspect-[1/1.4]" : "aspect-square")}
                  imageHint={product.imageHint}
              />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight font-headline lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>
            <p className="text-lg leading-relaxed text-foreground/80">
              {product.description}
            </p>

            {seller && (
              <div className="p-4 rounded-lg bg-secondary">
                <Link href={`/store/${seller.id}`} className="flex items-center gap-4 group">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                    <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Sold by</p>
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                      {seller.storeName}
                    </h3>
                  </div>
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button size="lg">Add to Cart</Button>
              <div className="flex gap-2">
                <Button size="lg" variant="outline" className="flex-1">Make Offer</Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Favourite
                </Button>
              </div>
              {isCollectorCard && (
                  <Button size="lg" variant="secondary" onClick={handleSearchEbay} disabled={isSearchingEbay}>
                      {isSearchingEbay ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      Search Sold Listings
                  </Button>
              )}
            </div>
          </div>
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
      </div>

      <Separator className="my-12" />

      <div>
        <h2 className="mb-8 text-3xl font-bold text-center font-headline px-4 lg:px-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-0 justify-center">
          {initialRecommendedProducts.map((recProduct) => (
            <ProductCard key={recProduct.id} product={recProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}
