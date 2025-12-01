"use client";

import Link from "next/link";
import { users } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function SellersPage() {
    // Filter users who are sellers (assuming all users in data are sellers for now, or filter by role if available)
    // In the current mock data, we treat all users as potential sellers.
    const sellers = users;

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Our Sellers</h1>
                <p className="text-muted-foreground mt-2">
                    Discover unique products from our community of trusted sellers.
                </p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-0 mt-8">
                {sellers.map((seller) => (
                    <Link key={seller.id} href={`/store/${seller.id}`} className="group block h-full">
                        <Card className="h-full border-0 rounded-none shadow-none hover:z-10 hover:shadow-lg transition-all duration-200 relative">
                            <div className="aspect-square relative overflow-hidden bg-muted">
                                {seller.avatarUrl ? (
                                    <img
                                        src={seller.avatarUrl}
                                        alt={seller.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground text-4xl font-bold">
                                        {(seller.name || 'U').charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold truncate text-sm group-hover:text-primary transition-colors">
                                    {seller.storeName || seller.name}
                                </h3>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span>4.9 (120)</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                    {seller.bio || `Visit Store`}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
