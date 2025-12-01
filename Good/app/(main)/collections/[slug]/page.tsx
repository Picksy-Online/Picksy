
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { getProducts } from "@/services/product-service";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) {
    return {
      title: 'Collection Not Found | Picksy',
      description: 'The collection you are looking for could not be found.',
    }
  }

  return {
    title: `${category.name} | Picksy Marketplace`,
    description: category.description,
  }
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = categories.find((cat) => cat.slug === params.slug);
  if (!category) {
    notFound();
  }

  const { products: categoryProducts } = await getProducts({ category: category.name });

  return (
    <div className="py-12">
      <div className="px-4 lg:px-8">
        <h1 className="text-3xl font-bold font-headline mb-2">{category.name}</h1>
        <p className="text-lg text-muted-foreground">{category.description}</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-0 justify-center mt-8">
        {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full px-4 lg:px-8">
            No products found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
