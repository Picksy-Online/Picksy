
import { getProductById } from "@/services/product-service";
import ProductPageLayoutClient from "./ProductPageLayoutClient";

export default async function ProductPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  return (
    <ProductPageLayoutClient product={product}>
        {children}
    </ProductPageLayoutClient>
  );
}
