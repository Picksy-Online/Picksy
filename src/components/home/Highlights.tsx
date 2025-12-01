import { Gem, ShieldCheck, Truck } from "lucide-react";
import React from "react";

/**
 * Small utility highlight cards below the hero to show reasons to buy/sell.
 */
export default function Highlights() {
  const items = [
    {
      icon: Gem,
      title: "Handpicked Makers",
      desc: "Each seller is reviewed by our team to ensure quality and authenticity.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "Fast, encrypted checkout and buyer protection on all orders.",
    },
    {
      icon: Truck,
      title: "Local Shipping",
      desc: "Get your items quickly from sellers based right here in Australia.",
    },
  ];

  return (
    <section className="my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((it) => (
          <div
            key={it.title}
            className="p-6 bg-card rounded-lg border flex items-start gap-4"
          >
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                <it.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{it.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
