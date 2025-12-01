import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function FeaturedSellers() {
    const sellers = [
        {
            id: "1",
            name: "Vintage Vault",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
            category: "Vintage",
            rating: 4.9,
            items: 124,
        },
        {
            id: "2",
            name: "Crafted by Sarah",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60",
            category: "Handmade",
            rating: 5.0,
            items: 45,
        },
        {
            id: "3",
            name: "Retro Collectibles",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60",
            category: "Collectibles",
            rating: 4.8,
            items: 312,
        },
        {
            id: "4",
            name: "Artisan Woodworks",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
            category: "Woodwork",
            rating: 4.9,
            items: 87,
        },
    ];

    return (
        <section className="py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
                        Featured Sellers
                    </h2>
                    <p className="text-muted-foreground mt-2">Top rated community members</p>
                </div>
                <Link href="/browse" className="text-primary font-medium hover:underline hidden sm:block">
                    View all sellers
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sellers.map((seller) => (
                    <Link key={seller.id} href={`/store/${seller.id}`} className="group">
                        <Card className="h-full transition-all duration-300 hover:shadow-md border-border/50 bg-card/50 hover:bg-card">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <Avatar className="w-20 h-20 mb-4 ring-2 ring-background group-hover:ring-primary transition-all">
                                    <AvatarImage src={seller.image} alt={seller.name} />
                                    <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{seller.name}</h3>
                                <Badge variant="secondary" className="mb-3">{seller.category}</Badge>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full justify-center">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{seller.rating}</span>
                                    </div>
                                    <div className="w-px h-4 bg-border" />
                                    <div>{seller.items} items</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
