
import { getProductById } from "@/services/product-service";
import ProductPageLayoutClient from "./ProductPageLayoutClient";

export default async function ProductPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <ProductPageLayoutClient product={product}>
      {children}
    </ProductPageLayoutClient>
  );
}
