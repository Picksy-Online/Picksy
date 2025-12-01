
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const featuredCategories = categories.slice(0, 4);

export function FeaturedCollections() {
  return (
    <section className="w-full">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">
          Featured Collections
        </h2>
        <p className="max-w-2xl mt-2 text-lg text-muted-foreground">
          Explore curated collections from our vibrant community of sellers. Each piece has a story to tell.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCategories.map(category => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="group block w-full"
          >
            <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative h-96">
                  <Image
                    src={`https://picsum.photos/seed/${category.slug}/600/800`}
                    alt={category.name}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.name.toLowerCase()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-2xl font-bold text-white font-headline">
                      {category.name}
                    </h3>
                    <div className="flex items-center mt-2 text-sm font-medium text-white transition-transform group-hover:translate-x-1">
                      Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
