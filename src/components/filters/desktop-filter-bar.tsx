"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchFilters } from "./filter-types";

type DesktopFilterBarProps = {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
    categories: string[];
};

export function DesktopFilterBar({
    filters,
    setFilters,
    categories,
}: DesktopFilterBarProps) {
    return (
        <div className="hidden md:flex gap-4">
            <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
                <SelectTrigger className="w-[180px] h-10">
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
                <SelectTrigger className="w-[180px] h-10">
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
    );
}
