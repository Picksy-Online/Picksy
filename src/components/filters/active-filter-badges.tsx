"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { SearchFilters } from "./filter-types";

type ActiveFilterBadgesProps = {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
};

export function ActiveFilterBadges({
    filters,
    setFilters,
    priceRange,
    setPriceRange,
}: ActiveFilterBadgesProps) {
    return (
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
    );
}
