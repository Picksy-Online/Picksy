import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket, Target, BarChart, ShieldCheck, Star, DollarSign, Zap, Paintbrush, Gem, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Picksy for Business | Grow Your Australian Business',
  description: 'Leverage Picksy to grow your small business. Reach thousands of Australian shoppers, utilize powerful AI seller tools, and sell on a secure and reliable platform.',
};

const businessBenefits = [
  {
    icon: Rocket,
    title: "Accelerate Your Growth",
    description:
      "Expand your reach and connect with a dedicated audience ready to discover new brands.",
  },
  {
    icon: Target,
    title: "Reach a Vast Audience",
    description:
      "Showcase your products to thousands of shoppers across Australia, from major cities to regional areas.",
  },
  {
    icon: BarChart,
    title: "Powerful AI Seller Tools",
    description:
      "Utilize advanced AI to optimize your listings, understand market trends, and make data-driven decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable Platform",
    description:
      "Sell with confidence on a platform that prioritizes security for both buyers and sellers.",
  },
];

const howItWorks = [
  {
    icon: Star,
    title: 'List Your Products',
    description:
      'Create a listing for your products in minutes. Add photos, a description, and set your price.',
  },
  {
    icon: DollarSign,
    title: 'Sell to a Vast Audience',
    description:
      'Reach thousands of potential buyers across Australia who are looking for unique products like yours.',
  },
  {
    icon: Zap,
    title: 'Get Paid Securely',
    description:
      'We handle the payments and provide a secure platform for you to sell your products.',
  },
];

const whatYouCanSell = [
  { icon: Paintbrush, label: 'Handmade Goods' },
  { icon: Gem, label: 'Vintage Items' },
  { icon: BookOpen, label: 'Digital Products' },
];


export default function ForBusinessPage() {
  return (
    <div className="container py-12 space-y-16 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center font-headline md:text-4xl">Picksy for Business</h1>
        <p className="mt-2 text-lg text-center text-muted-foreground">Empower your brand and grow your sales with our powerful marketplace.</p>
      </div>
      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/seller-application">Get Started</Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {businessBenefits.map((benefit) => (
          <Card key={benefit.title} className="text-center h-full">
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

      {/* How It Works Section */}
      <section className="text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold font-headline mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {howItWorks.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 text-primary">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold font-headline mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Can Sell Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-headline mb-12">
          What You Can Sell
        </h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {whatYouCanSell.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
                <item.icon className="w-10 h-10" />
              </div>
              <span className="font-semibold text-lg">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold font-headline mb-12">
          Why Choose Picksy?
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">For Not-for-Profits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Raise funds for your cause by selling products to a community
                that cares. We offer lower fees for non-profit organizations.
              </p>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">For Small Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Grow your business and reach a new audience. Our platform is
                designed to help you succeed with powerful tools and support.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
