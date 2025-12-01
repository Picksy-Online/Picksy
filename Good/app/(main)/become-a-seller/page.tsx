
import { Button } from "@/components/ui/button";
import { Users, BarChart, Zap, Award, Star, DollarSign, Upload } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Seller on Picksy | Join Our Artisan & NFP Marketplace',
  description: 'Start selling your handmade goods, vintage items, or unique products on Picksy. We empower Australian not-for-profits and small businesses with powerful tools and low fees.',
};

const benefits = [
  {
    icon: Users,
    title: "Large Buyer Community",
    description:
      "Tap into a vibrant community of buyers across Australia actively looking for unique items.",
  },
  {
    icon: BarChart,
    title: "Powerful AI Tools",
    description:
      "Leverage our AI-powered tools for pricing suggestions, description generation, and trend analysis.",
  },
  {
    icon: Zap,
    title: "Low Commission Fees",
    description:
      "Keep more of your earnings with our competitive and transparent commission structure.",
  },
  {
    icon: Award,
    title: "Fast Payouts",
    description:
      "Get your money quickly and securely with our streamlined payout system.",
  },
];

const howItWorks = [
  {
    icon: Upload,
    title: 'List Your Items',
    description: 'Easily create listings with our AI-powered tools or simple-to-use forms. Upload photos, write descriptions, and set your prices in minutes.',
  },
  {
    icon: Star,
    title: 'Reach Buyers',
    description: 'Your products will be showcased to a large community of shoppers actively searching for unique and handcrafted goods across Australia.',
  },
  {
    icon: DollarSign,
    title: 'Get Paid Securely',
    description: 'We handle all payment processing securely. Once you make a sale, your earnings are transferred to you quickly and reliably.',
  },
];

export default function BecomeASellerPage() {
  return (
    <div className="flex-1 flex flex-col">
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-center font-headline md:text-5xl lg:text-6xl">
              Join a Thriving Marketplace
            </h1>
            <p className="text-lg text-center text-muted-foreground md:text-xl">
              Picksy is the perfect place to turn your passion into a business. Sell your handmade goods, vintage items, and unique creations to a community that values quality and craftsmanship.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild>
                <Link href="/seller-application">Apply to Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-center font-headline">Why Sell on Picksy?</h2>
              <p className="text-muted-foreground md:text-lg">Powerful features to help you grow your business.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center space-y-3">
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                      <benefit.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold font-headline">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-center font-headline">How It Works</h2>
                    <p className="text-muted-foreground md:text-lg">A simple and straightforward process.</p>
                </div>
                <div className="grid gap-10 md:grid-cols-3">
                    {howItWorks.map((step) => (
                    <div key={step.title} className="text-center space-y-3">
                        <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/20 bg-primary/10 text-primary">
                            <step.icon className="w-8 h-8" />
                        </div>
                        </div>
                        <h3 className="text-xl font-semibold font-headline">
                        {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
