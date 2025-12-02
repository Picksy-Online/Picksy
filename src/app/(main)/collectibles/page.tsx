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
import type { Product, User } from "@/lib/types";
import Link from "next/link";
import { PlusCircle, ArrowUpDown, Filter, UserMinus, UserPlus, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CollectiblesPage() {
  const { user } = useAuth() as { user: User | null };
  const [sortOrder, setSortOrder] = useState<string>("price-asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [isExclusionMode, setIsExclusionMode] = useState<boolean>(false);
  const [postcode, setPostcode] = useState<string>("");

  const sellerPostcodeMap = useMemo(() => {
    return users.reduce((acc, seller) => {
      acc[seller.id] = seller.postcode;
      return acc;
    }, {} as Record<string, string | undefined>);
  }, []);

  const collectibleCategories = ['Vintage'];

  const availableCategories = useMemo(() => {
    return categories.filter(c => collectibleCategories.includes(c.name));
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let filteredProducts = [...allProducts].filter(p => !p.isPrivate && collectibleCategories.includes(p.category));

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

    // Filter by category
    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
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
  }, [sortOrder, selectedCategory, selectedSellers, isExclusionMode, user, postcode, sellerPostcodeMap]);

  const handleSellerSelection = (sellerId: string) => {
    setSelectedSellers(prev =>
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const availableSellers = useMemo(() => {
    const blockedIds = user?.blockedSellerIds || [];
    return users.filter(seller => !blockedIds.includes(seller.id));
  }, [user]);

  return (
    <div className="p-5 pt-5 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline whitespace-nowrap">Collectibles</h1>

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

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category" className="w-[40px] px-2 md:w-[180px] md:px-3">
              <Filter className="h-4 w-4 md:hidden mx-auto" />
              <div className="hidden md:block">
                <SelectValue placeholder="Filter by category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              id="postcode"
              placeholder="Postcode"
              className="w-[80px] md:w-[120px]"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
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
              <Link href="/dashboard/sales">
                <PlusCircle className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">List Collectible</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-8">
        {sortedAndFilteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
