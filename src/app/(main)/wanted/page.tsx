"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWantedItems } from "@/services/product-service";
import { WantedItem } from "@/lib/types";
import { WantedCard } from "@/components/wanted-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function WantedPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<WantedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getWantedItems();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch wanted items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    return (
        <div className="pt-5 pb-12 p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Wanted Items</h1>
                    <p className="mt-2 text-muted-foreground">
                        See what other collectors are looking for. Can you help them out?
                    </p>
                </div>
                {user && (
                    <Button asChild>
                        <Link href="/dashboard/wanted/create">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Post a Wanted Item
                        </Link>
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8" style={{ perspective: '1000px' }}>
                    {items.map((item) => (
                        <WantedCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No wanted items found.</p>
                    {user && (
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/wanted/create">Be the first to post!</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
