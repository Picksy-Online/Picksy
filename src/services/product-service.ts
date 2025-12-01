
import { products as allProducts, users, categories } from '@/lib/data';
import type { Product, Category, ProductSearchParams } from '@/lib/types';

/**
 * Fetches products with filtering, sorting, and pagination.
 * This function simulates a database query.
 * @param params - The search parameters for filtering and sorting.
 * @returns A promise that resolves to an object containing the products and a flag indicating if there are more products.
 */
export const getProducts = async (
  params: ProductSearchParams
): Promise<{ products: Product[]; hasMore: boolean }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const {
    sort = 'newest',
    page = '1',
    limit = '12',
    category,
    seller,
    minPrice,
    maxPrice,
  } = params;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  let filteredProducts = allProducts.filter(p => !p.isPrivate);

  // Apply filters
  if (category) {
    if (category.startsWith('!')) {
        const catToExclude = category.substring(1);
        filteredProducts = filteredProducts.filter(p => p.category !== catToExclude);
    } else {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
  }
  if (seller) {
    filteredProducts = filteredProducts.filter(p => p.sellerId === seller);
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice, 10));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice, 10));
  }
  
  // Apply sorting
  filteredProducts.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
      default:
        // Assuming higher ID means newer
        return parseInt(b.id.split('_')[1]) - parseInt(a.id.split('_')[1]);
    }
  });

  // Apply pagination
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginatedProducts = filteredProducts.slice(start, end);
  const hasMore = end < filteredProducts.length;

  return { products: paginatedProducts, hasMore };
};

/**
 * Fetches a single product by its ID.
 * @param id The ID of the product to fetch.
 * @returns A promise that resolves to the product or undefined if not found.
 */
export const getProductById = async (id: string): Promise<Product | undefined> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return allProducts.find(p => p.id === id);
};

/**
 * Fetches all products for a given seller.
 * @param sellerId The ID of the seller.
 * @returns A promise that resolves to an array of the seller's products.
 */
export const getProductsBySellerId = async (sellerId: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return allProducts.filter(p => p.sellerId === sellerId);
}

/**
 * Fetches all categories.
 * @returns A promise that resolves to an array of categories.
 */
export const getCategories = async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return categories;
}
