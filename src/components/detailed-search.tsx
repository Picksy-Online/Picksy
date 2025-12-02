"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X, Filter } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export type SearchFilters = {
    query: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    sort: string;
};

type DetailedSearchProps = {
    onSearch: (filters: SearchFilters) => void;
    initialFilters?: Partial<SearchFilters>;
    categories: string[];
};

export function DetailedSearch({
    onSearch,
    initialFilters,
    categories,
}: DetailedSearchProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        query: initialFilters?.query || "",
        category: initialFilters?.category || "all",
        minPrice: initialFilters?.minPrice || 0,
        maxPrice: initialFilters?.maxPrice || 1000,
        sort: initialFilters?.sort || "newest",
    });

    const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch({ ...filters, minPrice: priceRange[0], maxPrice: priceRange[1] });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.query, filters.category, filters.sort, priceRange, onSearch]);

    const handleClear = () => {
        const resetFilters = {
            query: "",
            category: "all",
            minPrice: 0,
            maxPrice: 1000,
            sort: "newest",
        };
        setFilters(resetFilters);
        setPriceRange([0, 1000]);
        onSearch(resetFilters);
    };

    return (
        <div className="w-full space-y-4 bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Main Search Input - REMOVED */}
                {/* <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for anything..."
                        value={filters.query}
                        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                        className="pl-10 h-12 text-lg"
                        suppressHydrationWarning
                    />
                    {filters.query && (
                        <button
                            onClick={() => setFilters({ ...filters, query: "" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div> */}

                {/* Desktop Filters */}
                <div className="hidden md:flex gap-4">
                    <Select
                        value={filters.category}
                        onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                        <SelectTrigger className="w-[180px] h-12">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort}
                        onValueChange={(value) => setFilters({ ...filters, sort: value })}
                    >
                        <SelectTrigger className="w-[180px] h-12">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest Listed</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile Filter Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="md:hidden h-12 w-12 p-0">
                            <Filter className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>Refine your search results</SheetDescription>
                        </SheetHeader>
                        <div className="py-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={filters.category}
                                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Price Range</label>
                                    <span className="text-sm text-muted-foreground">
                                        ${priceRange[0]} - ${priceRange[1]}
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[0, 1000]}
                                    max={1000}
                                    step={10}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="py-4"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sort By</label>
                                <Select
                                    value={filters.sort}
                                    onValueChange={(value) => setFilters({ ...filters, sort: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest Listed</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleClear} variant="outline" className="w-full">
                                Clear All Filters
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
                {filters.category !== "all" && (
                    <Badge variant="secondary" className="px-3 py-1">
                        Category: {filters.category}
                        <X
                            className="ml-2 h-3 w-3 cursor-pointer"
                            onClick={() => setFilters({ ...filters, category: "all" })}
                        />
                    </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Badge variant="secondary" className="px-3 py-1">
                        Price: ${priceRange[0]} - ${priceRange[1]}
                        <X
                            className="ml-2 h-3 w-3 cursor-pointer"
                            onClick={() => setPriceRange([0, 1000])}
                        />
                    </Badge>
                )}
            </div>
        </div>
    );
}
