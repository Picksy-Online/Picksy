
import React from "react";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import FeaturedCollectionsSection from "@/components/home/FeaturedCollectionsSection";
import ProductsGrid from "@/components/home/ProductsGrid";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Newsletter from "@/components/home/Newsletter";
import { CollectorCardCarousel } from "@/components/collector-card-carousel";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="bg-background">
      <Hero />

      <div className="container mx-auto px-4 lg:px-8">
        <Highlights />
      </div>

      <div className="py-12">
        <CollectorCardCarousel />
      </div>

       <div className="container mx-auto px-4 lg:px-8">
        <FeaturedCollectionsSection />
       </div>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-foreground container mx-auto px-4 lg:px-8">
            New & Trending
          </h2>
          <ProductsGrid />
        </section>

      <div className="container mx-auto px-4 lg:px-8">
        <Testimonials />

        <CTA />

        <Newsletter />
      </div>
    </main>
  );
}
