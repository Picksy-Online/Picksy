
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section 
        className="relative bg-cover bg-center text-white" 
        style={{backgroundImage: "url('https://picsum.photos/seed/hero-background/1800/1000')"}}
        data-ai-hint="hero background"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container flex items-center justify-center text-center min-h-[70vh] lg:min-h-[80vh]">
        <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-headline tracking-tight" data-ai-hint="hero title">
              Discover Unique Goods, Make a Big Impact.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90" data-ai-hint="hero description">
              Explore a curated marketplace of handcrafted treasures and vintage finds from Australia's best not-for-profits and small businesses.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg font-semibold">
                <Link href="/browse">
                  Explore Marketplace <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="text-lg font-semibold">
                <Link href="/collector-cards">Shop Collector Cards</Link>
              </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
