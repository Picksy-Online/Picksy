"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Newsletter signup (non-blocking).
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the form submission here.
    console.log("Newsletter signup for:", email);
    alert("Thank you for signing up!");
    setEmail("");
  };

  return (
    <section className="my-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground">
          Stay in the Loop
        </h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Get the latest on new arrivals, special offers, and behind-the-scenes stories from our makers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-base"
            suppressHydrationWarning
          />
          <Button type="submit" className="w-full sm:w-auto">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
