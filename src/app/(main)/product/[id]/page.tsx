import { notFound } from "next/navigation";
import { products, users } from "@/lib/data";
import ProductPageContent from "./ProductPageContent";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.imageUrls[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const seller = users.find((u) => u.id === product.sellerId);

  // Filter recommended products (same category, excluding current product)
  const recommendedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrls,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: seller?.storeName || seller?.name || "Picksy Seller",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageContent product={product} initialRecommendedProducts={recommendedProducts} />
    </>
  );
}
