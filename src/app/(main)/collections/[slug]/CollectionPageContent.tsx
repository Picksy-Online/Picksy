'use client';

import { products as allProducts, users, categories } from "@/lib/data";
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
import type { Product, User, Category } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";

export default function CollectionPageContent({ category }: { category: Category }) {
    const { user } = useAuth() as { user: User | null };
    const [sortOrder, setSortOrder] = useState<string>("price-asc");
    const [includedSellers, setIncludedSellers] = useState<string[]>([]);
    const [excludedSellers, setExcludedSellers] = useState<string[]>([]);
    const [postcode, setPostcode] = useState<string>("");

    const sellerPostcodeMap = useMemo(() => {
        return users.reduce((acc, seller) => {
            acc[seller.id] = seller.postcode;
            return acc;
        }, {} as Record<string, string | undefined>);
    }, []);

    const sortedAndFilteredProducts = useMemo(() => {
        let filteredProducts = allProducts.filter(p => !p.isPrivate && p.category === category.name);

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

        // Filter by included sellers
        if (includedSellers.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                includedSellers.includes(product.sellerId)
            );
        }

        // Filter by excluded sellers
        if (excludedSellers.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                !excludedSellers.includes(product.sellerId)
            );
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
    }, [sortOrder, includedSellers, excludedSellers, user, postcode, sellerPostcodeMap, category.name]);

    const handleSellerSelection = (
        sellerId: string,
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const newList = list.includes(sellerId)
            ? list.filter((id) => id !== sellerId)
            : [...list, sellerId];
        setList(newList);
    };

    const availableSellers = useMemo(() => {
        const blockedIds = user?.blockedSellerIds || [];
        const categorySellerIds = new Set(allProducts.filter(p => p.category === category.name).map(p => p.sellerId));
        return users.filter(seller => !blockedIds.includes(seller.id) && categorySellerIds.has(seller.id));
    }, [user, category.name]);

    return (
        <div className="pt-5 pb-12 p-5">
            <h1 className="text-3xl font-bold font-headline">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>

            <div className="flex flex-wrap items-center gap-4 my-8">
                <div className="flex items-center gap-2">
                    <Label htmlFor="sort-order" className="text-sm">Sort by</Label>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger id="sort-order" className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="postcode" className="text-sm">Postcode</Label>
                    <Input
                        id="postcode"
                        placeholder="e.g. 6000"
                        className="w-[120px]"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Include Sellers</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Include products from</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableSellers.map((seller) => (
                            <DropdownMenuCheckboxItem
                                key={seller.id}
                                checked={includedSellers.includes(seller.id)}
                                onCheckedChange={() => handleSellerSelection(seller.id, includedSellers, setIncludedSellers)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {seller.storeName}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Exclude Sellers</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Exclude products from</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableSellers.map((seller) => (
                            <DropdownMenuCheckboxItem
                                key={seller.id}
                                checked={excludedSellers.includes(seller.id)}
                                onCheckedChange={() => handleSellerSelection(seller.id, excludedSellers, setExcludedSellers)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {seller.storeName}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8" style={{ perspective: '1000px' }}>
                {sortedAndFilteredProducts.length > 0 ? (
                    sortedAndFilteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full">
                        No products found in this category.
                    </p>
                )}
            </div>
        </div>
    );
}
