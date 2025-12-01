"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserNav } from "@/components/layout/user-nav";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { cn } from "@/lib/utils";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div
        className={cn(
          "grid grid-cols-[auto,1fr] gap-4 px-4 py-3 md:px-6"
        )}
      >
        {/* This div acts as a spacer, taking up the width of the sidebar */}
        <div className={cn(
          "w-0 md:w-[var(--sidebar-width-icon)] lg:group-data-[state=expanded]:w-[var(--sidebar-width)] transition-all duration-200"
        )}></div>

        {/* This div contains the actual header content */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center md:hidden">
              <Link href="/">
                <Logo className="w-24 h-8" />
              </Link>
            </div>
            <div className="hidden md:flex items-center">
              {/* Desktop Logo if sidebar is not present/visible, or just always show it here if sidebar is collapsed? 
                   Actually, the sidebar spacer logic suggests the logo is in the sidebar. 
                   But user says "I dont see it". 
                   Let's add it here for now, maybe hidden on lg if sidebar is open? 
                   For now, let's just make sure it shows up. */}
              <Link href="/" className="lg:hidden">
                <Logo className="w-28 h-9" />
              </Link>
            </div>
            <div className="flex items-center gap-6 md:gap-10">
              <div className="hidden md:block"><SearchBar /></div>
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
            <div className="ml-4 md:hidden">
              <MobileNav />
            </div>
          </div>
          <div className="flex justify-center md:hidden">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
