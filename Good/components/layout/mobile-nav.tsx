
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft, Home, Sparkles, Search, Heart, Gavel, FileSearch, Tag, Eye, Users, Upload } from "lucide-react";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const mainNavLinks = [
    { href: "/browse", label: "Marketplace" },
    { href: "/browse", label: "Buyers" },
    { href: "/become-a-seller", label: "Sellers" },
    { href: "/signup", label: "Register" },
];

const browseNavItems = [
  { href: "/browse/latest", icon: Sparkles, label: "Latest Products" },
  { href: "/browse", icon: Search, label: "Browse" },
  { href: "/browse/favorites", icon: Heart, label: "Favorite Categories" },
  { href: "/auctions", icon: Gavel, label: "Auctions" },
  { href: "/browse/wanted", icon: FileSearch, label: "Wanted" },
  { href: "/browse/offers", icon: Tag, label: "Offers" },
  { href: "/browse/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/browse/following", icon: Users, label: "Following" },
];

const collectorCardsNavItems = [
  { href: "/collector-cards", icon: Home, label: "Card Home" },
  { href: "/collector-cards/latest", icon: Sparkles, label: "Latest Cards" },
  { href: "/collector-cards/auctions", icon: Gavel, label: "Card Auctions" },
  { href: "/collector-cards/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/collector-cards/offers", icon: Tag, label: "My Card Offers" },
  { href: "/collector-cards/favorites", icon: Heart, label: "Favorite Cards" },
  { href: "/collector-cards/following", icon: Users, label: "Following" },
  { href: "/sell-cards", icon: Upload, label: "Sell Your Cards" },
];

const collectiblesNavItems = [
  { href: "/collectibles/latest", icon: Sparkles, label: "Latest Collectibles" },
  { href: "/collectibles", icon: Search, label: "Browse" },
  { href: "/collectibles/favorites", icon: Heart, label: "Favorite Categories" },
  { href: "/auctions", icon: Gavel, label: "Auctions" },
  { href: "/collectibles/wanted", icon: FileSearch, label: "Wanted" },
  { href: "/collectibles/offers", icon: Tag, label: "Offers" },
  { href: "/collectibles/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/collectibles/following", icon: Users, label: "Following" },
];


export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getSectionNav = () => {
    if (pathname.startsWith('/collector-cards')) return { title: 'Card Menu', items: collectorCardsNavItems };
    if (pathname.startsWith('/collectibles')) return { title: 'Collectibles Menu', items: collectiblesNavItems };
    if (pathname.startsWith('/browse') || pathname.startsWith('/product') || pathname.startsWith('/auctions')) return { title: 'Browse Menu', items: browseNavItems };
    return null;
  }

  const sectionNav = getSectionNav();


  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <PanelLeft className="w-6 h-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Logo className="w-auto h-6" />
          </Link>
          <div className="flex flex-col h-full py-6 space-y-4">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium"
              >
                {link.label}
              </Link>
            ))}

            {sectionNav && (
                <>
                    <Separator className="my-4" />
                    <h4 className="font-semibold text-muted-foreground px-2">{sectionNav.title}</h4>
                     {sectionNav.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-foreground"
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </>
            )}

             <Separator className="my-4" />

             <Link href="/business" onClick={() => setOpen(false)} className="text-lg font-medium">For Business</Link>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
