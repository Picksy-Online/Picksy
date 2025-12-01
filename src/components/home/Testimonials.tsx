import React from "react";
import { Star } from "lucide-react";

/**
 * Simple testimonials strip.
 */
export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Picksy is my go-to for unique gifts. I love supporting local makers and the quality is always outstanding.",
      author: "Sarah L.",
      location: "Melbourne, VIC",
    },
    {
      quote:
        "Finally, a marketplace that feels curated and trustworthy. Found a vintage piece I'd been searching for for years!",
      author: "David R.",
      location: "Sydney, NSW",
    },
     {
      quote:
        "As a seller, the platform is so easy to use. The AI tools for writing descriptions are a game-changer for me.",
      author: "Anya T.",
      location: "Brisbane, QLD",
    },
  ];

  return (
    <section className="my-16 py-16 bg-muted/50 rounded-lg">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl font-bold font-headline mb-12">
          Loved by our Community
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="bg-card p-6 rounded-lg shadow-sm text-left">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">"{testimonial.quote}"</p>
              <p className="font-semibold mt-4 text-foreground">
                {testimonial.author}
              </p>
               <p className="text-sm text-muted-foreground">
                {testimonial.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
