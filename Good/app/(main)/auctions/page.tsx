
import { AuctionCard, AuctionCardSkeleton } from '@/components/auction-card';
import { auctions } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Auctions | Bid on Unique Items on Picksy',
  description: 'Join live auctions on Picksy and bid on a curated selection of unique, handmade, and vintage items from Australian sellers. Find your next treasure today!',
};

export default async function AuctionsPage() {

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight text-center font-headline md:text-4xl">Live Auctions</h1>
      <p className="mt-2 text-lg text-center text-muted-foreground">Bid on unique items from sellers across Australia.</p>
      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {auctions.map(product => (
          <AuctionCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
