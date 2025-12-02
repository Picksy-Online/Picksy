'use client';

import { products as allProducts, users } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MobileFilterTrigger } from "@/components/filters/mobile-filter-trigger";
import { DesktopFilterBar } from "@/components/filters/desktop-filter-bar";
import { ActiveFilterBadges } from "@/components/filters/active-filter-badges";
import { SearchFilters } from "@/components/filters/filter-types";

export default function BrowsePage() {
  const { user } = useAuth();

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sort: "newest",
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [includedSellers, setIncludedSellers] = useState<string[]>([]);
  const [excludedSellers, setExcludedSellers] = useState<string[]>([]);
  const [postcode, setPostcode] = useState<string>("");

  const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), []);

  const sellerPostcodeMap = useMemo(() => {
    return users.reduce((acc, seller) => {
      acc[seller.id] = seller.postcode;
      return acc;
    }, {} as Record<string, string | undefined>);
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let filteredProducts = allProducts.filter(p => !p.isPrivate);

    // Filter by search query
    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (filters.category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    // Filter by price range (using slider value directly)
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
      switch (filters.sort) {
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
  }, [filters, priceRange, includedSellers, excludedSellers, user, postcode, sellerPostcodeMap]);

  const handleClearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      minPrice: 0,
      maxPrice: 10000,
      sort: "newest",
    });
    setPriceRange([0, 10000]);
  };

  return (
    <div className="pt-5 pb-12 p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">All</h1>
        <div className="flex items-center gap-2">
          {/* Mobile Filter Trigger - Icon next to List Item */}
          <div className="md:hidden">
            <MobileFilterTrigger
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClear={handleClearFilters}
            />
          </div>

          {user && (
            <Button asChild>
              <Link href="/dashboard/sales">
                <PlusCircle className="w-4 h-4 mr-2" />
                List Item
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 space-y-4">
        {/* Desktop Filters */}
        <DesktopFilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />

        {/* Active Filters */}
        <ActiveFilterBadges
          filters={filters}
          setFilters={setFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
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
