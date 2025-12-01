import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, BarChart, Zap, Award } from "lucide-react";
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

export default function BecomeASellerPage() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-center font-headline md:text-4xl">Start Selling on Picksy</h1>
        <p className="mt-2 text-lg text-center text-muted-foreground">Join a community of creators and entrepreneurs.</p>
      </div>
      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/seller-application">Apply to Become a Seller</Link>
        </Button>
      </div>

      <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                  <benefit.icon className="w-6 h-6" />
                </div>
              </div>
              <CardTitle className="text-xl font-headline">
                {benefit.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
