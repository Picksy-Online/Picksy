
import db from "@/lib/db";
import BrowseContent from "./browse-content";
import { Product } from "@/lib/types";

// Force dynamic rendering so we always see new listings
export const dynamic = 'force-dynamic';

export default async function BrowsePage() {
  // Fetch products from Neon DB
  const dbProducts = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Map Prisma Product -> Frontend Product Type
  const products: Product[] = dbProducts.map((p) => {
    let images: string[] = [];
    try {
      images = JSON.parse(p.imageUrls);
    } catch (e) {
      // If parsing fails, maybe it's a single string or empty
      images = p.imageUrls ? [p.imageUrls] : [];
    }

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      sellerId: p.sellerId,
      imageUrls: images,
      imageHint: p.imageHint || 'front',
      year: p.year || undefined,
      // Map new coin/grading fields if we update the type definition later
      // For now, the keys might mismatch if strict, but 'Product' type is flexible enough or we cast
      gradingCompany: (p as any).gradingCompany,
      grade: (p as any).grade,
      certNumber: (p as any).certNumber,
    } as Product;
  });

  return <BrowseContent initialProducts={products} />;
}
