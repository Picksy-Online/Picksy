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
import { DetailedSearch } from "@/components/detailed-search";
import type { Product, User } from "@/lib/types";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function BrowsePage() {
  const { user } = useAuth();
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
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
    let filteredProducts = allProducts.filter(p => !p.isPrivate);

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

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
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return 0; // Assuming default order is newest or random
      }
    });
  }, [sortOrder, searchQuery, category, priceRange, includedSellers, excludedSellers, user, postcode, sellerPostcodeMap]);

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
    return users.filter(seller => !blockedIds.includes(seller.id));
  }, [user]);

  return (
    <div className="pt-5 pb-12 p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">All</h1>
        {user && (
          <Button asChild>
            <Link href="/dashboard/sales">
              <PlusCircle className="w-4 h-4 mr-2" />
              List Item
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-8">
        <DetailedSearch
          onSearch={(filters) => {
            setSearchQuery(filters.query);
            setSortOrder(filters.sort);
            setPriceRange([filters.minPrice, filters.maxPrice]);
            setCategory(filters.category);
          }}
          categories={Array.from(new Set(allProducts.map(p => p.category)))}
          initialFilters={{
            query: searchQuery,
            sort: sortOrder,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: category,
          }}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 mt-8">
        {sortedAndFilteredProducts.length > 0 ? (
          sortedAndFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} forceSquare />
          ))
        ) : (
          <p className="col-span-full">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
