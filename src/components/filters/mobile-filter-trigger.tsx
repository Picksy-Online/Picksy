"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SearchFilters } from "./filter-types";

type MobileFilterTriggerProps = {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
    categories: string[];
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    onClear: () => void;
};

export function MobileFilterTrigger({
    filters,
    setFilters,
    categories,
    priceRange,
    setPriceRange,
    onClear,
}: MobileFilterTriggerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary">
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

                    <Button onClick={onClear} variant="outline" className="w-full">
                        Clear All Filters
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
