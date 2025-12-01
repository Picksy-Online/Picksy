'use client';

import { auctions } from '@/lib/data';
import { AuctionCard } from '@/components/auction-card';
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AuctionsPage() {
  const [sortOrder, setSortOrder] = useState<string>("ending-soon");

  const sortedAuctions = useMemo(() => {
    return [...auctions].sort((a, b) => {
      switch (sortOrder) {
        case "ending-soon":
          // Sort by time left (you'd need to parse timeLeft for real sorting)
          return 0;
        case "most-bids":
          return b.bids - a.bids;
        case "highest-bid":
          return b.currentBid - a.currentBid;
        default:
          return 0;
      }
    });
  }, [sortOrder]);

  return (
    <div className="pt-5 pb-12 p-5">
      <h1 className="text-3xl font-bold font-headline">Live Auctions</h1>
      <p className="mt-2 text-muted-foreground">Bid on unique items from sellers across Australia.</p>

      <div className="flex flex-wrap items-center gap-4 my-8">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-order" className="text-sm">Sort by</Label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger id="sort-order" className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
              <SelectItem value="highest-bid">Highest Bid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedAuctions.map(auction => (
          <AuctionCard key={auction.id} product={auction} />
        ))}
      </div>
    </div>
  );
}
