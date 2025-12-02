"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BYPASS_KEY = "Picksy_bypass_homepage";

/**
 * Strong visual hero with two CTAs. Swap image URL to a branded asset.
 */
export default function Hero() {
  const router = useRouter();
  const { toast } = useToast();
  const [shouldBypass, setShouldBypass] = useState(false);

  // Check for bypass on component mount and redirect if necessary
  useEffect(() => {
    if (localStorage.getItem(BYPASS_KEY) === "true") {
      router.push("/browse");
    }
  }, [router]);

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setShouldBypass(checked);
    if (checked) {
      localStorage.setItem(BYPASS_KEY, "true");
      toast({
        title: "Preference Saved",
        description: "Next time, you'll be taken directly to the marketplace.",
      });
    } else {
      localStorage.removeItem(BYPASS_KEY);
    }
  };


  return (
    <section className="relative bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-6">
            <div className="mb-8 relative w-full max-w-[600px] h-[200px] md:h-[250px]">
              <Image
                src="/picksy-logo-full.png"
                alt="Picksy Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight mb-4 text-foreground">
              Discover curated, one-of-a-kind goods.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Picksy is the Australian marketplace for handcrafted treasures, vintage finds, and unique collectibles.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/browse"
                className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium shadow hover:opacity-95"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/become-a-seller"
                className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-md border border-border bg-card text-foreground font-medium hover:bg-muted"
              >
                Become a Seller
              </Link>
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <Checkbox
                id="bypass-homepage"
                onCheckedChange={handleCheckboxChange}
                checked={shouldBypass}
              />
              <Label htmlFor="bypass-homepage" className="text-sm font-medium text-muted-foreground cursor-pointer">
                Bypass this page next time
              </Label>
            </div>

          </div>

          <div className="md:col-span-5 lg:col-span-6">
            <div className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-tr from-primary/10 to-accent/10 relative aspect-[4/3] w-full group">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                alt="Curated handmade goods on display"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                data-ai-hint="curated goods shelf"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-2 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-medium text-sm uppercase tracking-wider mb-1">Featured Collection</p>
                <p className="font-headline font-bold text-xl">Vintage & Handcrafted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
