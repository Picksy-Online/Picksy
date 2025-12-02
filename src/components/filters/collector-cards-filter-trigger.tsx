"use client";

import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, UserMinus, UserPlus, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/types";

type CollectorCardsFilterTriggerProps = {
    sortOrder: string;
    setSortOrder: (value: string) => void;
    postcode: string;
    setPostcode: (value: string) => void;
    isExclusionMode: boolean;
    setIsExclusionMode: (value: boolean) => void;
    selectedSellers: string[];
    handleSellerSelection: (sellerId: string) => void;
    availableSellers: User[];
};

export function CollectorCardsFilterTrigger({
    sortOrder,
    setSortOrder,
    postcode,
    setPostcode,
    isExclusionMode,
    setIsExclusionMode,
    selectedSellers,
    handleSellerSelection,
    availableSellers,
}: CollectorCardsFilterTriggerProps) {
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
                    <SheetDescription>Refine your collector cards search</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">

                    {/* Sort Order */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Postcode */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Postcode</label>
                        <Input
                            placeholder="Enter Postcode"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                        />
                    </div>

                    {/* Seller Mode */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Seller Mode</label>
                        <Button
                            variant="outline"
                            onClick={() => setIsExclusionMode(!isExclusionMode)}
                            className="w-full justify-start"
                        >
                            {isExclusionMode ? <UserMinus className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                            {isExclusionMode ? "Exclude Selected Sellers" : "Include Selected Sellers"}
                        </Button>
                    </div>

                    {/* Select Sellers */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Sellers</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="h-4 w-4 mr-2" />
                                    <span>{selectedSellers.length > 0 ? `${selectedSellers.length} Selected` : "Select Sellers"}</span>
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
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
