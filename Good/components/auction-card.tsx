import Image from 'next/image';
import Link from 'next/link';
import type { Auction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type AuctionCardProps = {
  product: Auction;
};

export function AuctionCard({ product }: AuctionCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl">
      <CardHeader className="p-0">
        <Link
          href={`/product/${product.id}`}
          className="block overflow-hidden"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="object-cover w-full transition-transform duration-300 aspect-square group-hover:scale-105"
            data-ai-hint={product.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline">
          <Link
            href={`/product/${product.id}`}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="mt-2">
          <div className="flex justify-between">
            <span>Current Bid:</span>
            <span className="font-semibold text-primary">
              {formatCurrency(product.currentBid)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {product.bids} bids
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 p-4 pt-0">
        <div className="text-sm text-center text-muted-foreground">
          Ends in: {product.timeLeft}
        </div>
        <Button asChild>
          <Link href={`/product/${product.id}`}>Place Bid</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function AuctionCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <div className="w-full bg-muted aspect-square" />
      <CardContent className="flex-grow p-4 space-y-2">
        <div className="w-3/4 h-6 bg-muted" />
        <div className="flex justify-between">
            <div className="w-1/3 h-4 bg-muted" />
            <div className="w-1/4 h-4 bg-muted" />
        </div>
        <div className="w-1/4 h-4 bg-muted" />
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 p-4 pt-0">
        <div className="w-1/2 h-4 mx-auto bg-muted" />
        <div className="w-full h-10 bg-muted" />
      </CardFooter>
    </Card>
  );
}
