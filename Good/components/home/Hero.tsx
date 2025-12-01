
"use client";

import React, { useEffect, useState } from "react";
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
    <section className="relative bg-gradient-to-b from-blue-50 via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-6">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight mb-4 text-foreground">
              Discover curated, one-of-a-kind goods.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Picksy is the Australian marketplace for handcrafted treasures, vintage finds, and unique collectibles.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button asChild size="lg">
                <Link
                  href="/browse"
                >
                  Explore Marketplace
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link
                  href="/collector-cards"
                >
                  Explore Collector Cards
                </Link>
              </Button>
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
            <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-tr from-slate-100 to-white relative aspect-[4/3] w-full">
              <img
                src="https://picsum.photos/seed/homepage-hero/1200/900"
                alt="Curated handmade goods on display"
                className="object-cover w-full h-full"
                data-ai-hint="curated goods shelf"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
