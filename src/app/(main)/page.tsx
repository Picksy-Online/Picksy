'use client';

import React from "react";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import FeaturedCollectionsSection from "@/components/home/FeaturedCollectionsSection";
import ProductsGrid from "@/components/home/ProductsGrid";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Newsletter from "@/components/home/Newsletter";

/**
 * New homepage layout - composition only. Header/footer are provided by the global layout.
 * This preserves all existing components (carousel, cards) by referencing them inside sections.
 */
export default function HomePage() {
  return (
    <main className="bg-background">
      <Hero />

      <div className="container mx-auto px-4 lg:px-8">
        <Highlights />

        <FeaturedCollectionsSection />

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-foreground">
            New & Trending
          </h2>
          <ProductsGrid />
        </section>

        <Testimonials />

        <CTA />

        <Newsletter />
      </div>
    </main>
  );
}