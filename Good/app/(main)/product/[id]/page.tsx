
import { getProductById, getProducts } from "@/services/product-service";
import { notFound } from "next/navigation";
import ProductPageContent from "./ProductPageContent";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Pre-fetch related products on the server
  const { products: recommendedProducts } = await getProducts({
    category: product.category,
    limit: '5', // Fetch one extra to filter out the current product
  });
  
  const filteredRecs = recommendedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return <ProductPageContent product={product} initialRecommendedProducts={filteredRecs} />;
}
