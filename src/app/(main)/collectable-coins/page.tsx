'use client';

import { products as allProducts, users } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { useState, useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product, User } from "@/lib/types";
import Link from "next/link";
import { PlusCircle, ArrowUpDown, UserMinus, UserPlus, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CollectableCoinsPage() {
    const { user } = useAuth() as { user: User | null };
    const [sortOrder, setSortOrder] = useState<string>("price-asc");
    const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
    const [isExclusionMode, setIsExclusionMode] = useState<boolean>(false);
    const [postcode, setPostcode] = useState<string>("");

    const sellerPostcodeMap = useMemo(() => {
        return users.reduce((acc, seller) => {
            acc[seller.id] = seller.postcode;
            return acc;
        }, {} as Record<string, string | undefined>);
    }, []);

    const sortedAndFilteredProducts = useMemo(() => {
        // Filter for coins category (you can adjust this filter as needed)
        let filteredProducts = allProducts.filter(p => !p.isPrivate && p.category === 'Collector Coins');

        // Global block list
        if (user?.blockedSellerIds && user.blockedSellerIds.length > 0) {
            filteredProducts = filteredProducts.filter(
                (product) => !user.blockedSellerIds?.includes(product.sellerId)
            );
        }

        // Filter by postcode
        if (postcode.trim() !== "") {
            filteredProducts = filteredProducts.filter(
                (product) => sellerPostcodeMap[product.sellerId] === postcode.trim()
            );
        }

        // Filter by sellers (Include/Exclude mode)
        if (selectedSellers.length > 0) {
            if (isExclusionMode) {
                filteredProducts = filteredProducts.filter((product) =>
                    !selectedSellers.includes(product.sellerId)
                );
            } else {
                filteredProducts = filteredProducts.filter((product) =>
                    selectedSellers.includes(product.sellerId)
                );
            }
        }

        // Sort products
        return filteredProducts.sort((a: Product, b: Product) => {
            switch (sortOrder) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                default:
                    return 0;
            }
        });
    }, [sortOrder, selectedSellers, isExclusionMode, user, postcode, sellerPostcodeMap]);

    const handleSellerSelection = (sellerId: string) => {
        setSelectedSellers(prev =>
            prev.includes(sellerId)
                ? prev.filter(id => id !== sellerId)
                : [...prev, sellerId]
        );
    };

    const availableSellers = useMemo(() => {
        const blockedIds = user?.blockedSellerIds || [];
        const coinSellerIds = new Set(allProducts.filter(p => p.category === 'Collector Coins').map(p => p.sellerId));
        return users.filter(seller => !blockedIds.includes(seller.id) && coinSellerIds.has(seller.id));
    }, [user]);

    return (
        <div className="pt-5 pb-12 p-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold font-headline whitespace-nowrap">Collectable Coins</h1>

                <div className="flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger id="sort-order" className="w-[40px] px-2 md:w-[180px] md:px-3">
                            <ArrowUpDown className="h-4 w-4 md:hidden mx-auto" />
                            <div className="hidden md:block">
                                <SelectValue placeholder="Sort by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative">
                        <Input
                            id="postcode"
                            placeholder="Postcode"
                            className="w-[80px] md:w-[120px]"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            suppressHydrationWarning
                        />
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setIsExclusionMode(!isExclusionMode)}
                        className="w-[40px] px-0 md:w-auto md:px-4 md:min-w-[140px]"
                    >
                        <span className="md:hidden">
                            {isExclusionMode ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                        </span>
                        <span className="hidden md:inline">
                            {isExclusionMode ? "Exclude Sellers" : "Include Sellers"}
                        </span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[40px] px-0 md:w-auto md:px-4">
                                <Users className="h-4 w-4 md:hidden" />
                                <span className="hidden md:inline">Select Sellers</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Select Sellers</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {availableSellers.map((seller) => (
                                <DropdownMenuCheckboxItem
                                    key={seller.id}
                                    checked={selectedSellers.includes(seller.id)}
                                    onCheckedChange={() => handleSellerSelection(seller.id)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {seller.storeName}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user && (
                        <Button asChild className="shrink-0 w-[40px] px-0 md:w-auto md:px-4">
                            <Link href="/sell-coins">
                                <PlusCircle className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                                <span className="hidden md:inline">List Coin</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8">
                {sortedAndFilteredProducts.length > 0 ? (
                    sortedAndFilteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full">
                        No collectable coins found.
                    </p>
                )}
            </div>
        </div>
    );
}
