
import { notFound } from "next/navigation";
import { products as mockProducts, users } from "@/lib/data";
import ProductPageContent from "./ProductPageContent";
import { Metadata } from "next";
import db from "@/lib/db";
import { Product } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<Product | undefined> {
  // 1. Try DB first
  try {
    const dbProduct = await db.product.findUnique({
      where: { id },
      include: { seller: true } // Include seller for metadata
    });

    if (dbProduct) {
      let images: string[] = [];
      try {
        images = JSON.parse(dbProduct.imageUrls);
      } catch (e) {
        images = dbProduct.imageUrls ? [dbProduct.imageUrls] : [];
      }

      return {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        price: dbProduct.price,
        category: dbProduct.category,
        sellerId: dbProduct.sellerId,
        imageUrls: images,
        imageHint: dbProduct.imageHint || 'front',
        year: dbProduct.year || undefined,
        gradingCompany: (dbProduct as any).gradingCompany,
        grade: (dbProduct as any).grade,
        certNumber: (dbProduct as any).certNumber,
      } as Product;
    }
  } catch (error) {
    console.error("Error fetching product from DB:", error);
  }

  // 2. Fallback to Mock Data
  return mockProducts.find((p) => p.id === id);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

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
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Fetch Recommended (Mock + DB ideally, but for now simple Mock fallback or DB query is tricky to mix.
  // We will just use Mock for recommended for speed/stability unless we want to query DB again.)
  const recommendedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Get Seller (DB or Mock)
  // If product came from DB, we might want to fetch seller from DB.
  // Our `getProduct` above fetched it but didn't return it in the mapped type.
  // For metadata schemas, let's just do a best effort.
  // Since `users` mock data won't have the new DB seller, this might be undefined for DB products.
  let sellerName = "Picksy Seller";
  if (product.sellerId.startsWith('user_')) { // Mock ID usually
    const mockSeller = users.find(u => u.id === product.sellerId);
    if (mockSeller) sellerName = mockSeller.storeName || mockSeller.name || sellerName;
  } else {
    // Must be DB ID (clerk ID). Fetch if needed or assume user name if we passed it.
    // For now, default is acceptable.
  }

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
        name: sellerName,
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
