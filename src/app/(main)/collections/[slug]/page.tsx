import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import CollectionPageContent from "./CollectionPageContent";
import { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${category.name} Collection`,
    description: category.description || `Browse our ${category.name} collection on Picksy.`,
    openGraph: {
      title: `${category.name} Collection`,
      description: category.description || `Browse our ${category.name} collection on Picksy.`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return <CollectionPageContent category={category} />;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
