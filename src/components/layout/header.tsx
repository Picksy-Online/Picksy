"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserNav } from "@/components/layout/user-nav";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowUpDown } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { cn } from "@/lib/utils";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="flex flex-col md:flex-row items-center px-2 md:px-4 py-2 gap-4 w-full">

        {/* Mobile Header Row */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Link href="/browse">
            <Logo className="w-[180px] h-[54px]" />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Open cart</span>
            </Button>
            <UserNav />
            <MobileNav />
          </div>
        </div>

        {/* Desktop Logo Area - Centered relative to search bar start */}
        <div className="hidden md:flex flex-1 justify-center min-w-fit">
          <Link href="/browse">
            <Logo className="w-[280px] h-[80px]" />
          </Link>
        </div>

        {/* Search Bar - Dynamic width */}
        <div className="w-full md:w-auto md:flex-[2] min-w-[15ch] flex items-center gap-2">
          <SearchBar className="w-full" />
          <Button variant="outline" size="icon" className="md:hidden shrink-0">
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only">Sort</span>
          </Button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 flex-none">
          <MainNav />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
