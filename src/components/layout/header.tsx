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
          "grid grid-cols-[auto,1fr] gap-4 px-2 py-1 md:pl-2 md:pr-4"
        )}
      >
        <div className="flex items-center">
          <Link href="/">
            <Logo className="w-[280px] h-[80px]" />
          </Link>
        </div>

        {/* This div contains the actual header content */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex items-center justify-end min-h-16">
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
