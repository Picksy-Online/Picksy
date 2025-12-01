import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Strong CTA before newsletter.
 */
export default function CTA() {
  return (
    <section className="my-16">
      <div className="bg-primary/10 rounded-lg p-12 text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold font-headline text-primary">
          Ready to Start Selling?
        </h2>
        <p className="mt-2 text-lg text-primary/80 max-w-2xl">
          Join our community of creators, curators, and not-for-profits. We give you the tools to succeed.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/become-a-seller">Become a Seller</Link>
        </Button>
      </div>
    </section>
  );
}
