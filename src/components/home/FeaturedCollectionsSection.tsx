import React from "react";
import { FeaturedCollections } from "@/components/featured-collections";

/**
 * This section wraps your existing FeaturedCollections component.
 */
export default function FeaturedCollectionsSection() {
  return (
    <section className="my-16">
        <FeaturedCollections />
    </section>
  );
}
