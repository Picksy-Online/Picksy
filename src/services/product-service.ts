
import { products as allProducts, users, categories, wantedItems } from '@/lib/data';
import type { Product, Category, ProductSearchParams, WantedItem } from '@/lib/types';

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

  const pageStr = Array.isArray(page) ? page[0] : (page as string);
  const limitStr = Array.isArray(limit) ? limit[0] : (limit as string);
  const pageNum = parseInt(pageStr || '1', 10);
  const limitNum = parseInt(limitStr || '12', 10);

  let filteredProducts = allProducts.filter(p => !p.isPrivate);

  // Apply filters
  if (category) {
    const categoryStr = Array.isArray(category) ? category[0] : (category as string);
    if (categoryStr.startsWith('!')) {
      const catToExclude = categoryStr.substring(1);
      filteredProducts = filteredProducts.filter(p => p.category !== catToExclude);
    } else {
      filteredProducts = filteredProducts.filter(p => p.category === categoryStr);
    }
  }
  if (seller) {
    const sellerStr = Array.isArray(seller) ? seller[0] : (seller as string);
    filteredProducts = filteredProducts.filter(p => p.sellerId === sellerStr);
  }
  if (minPrice) {
    const minPriceStr = Array.isArray(minPrice) ? minPrice[0] : (minPrice as string);
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPriceStr, 10));
  }
  if (maxPrice) {
    const maxPriceStr = Array.isArray(maxPrice) ? maxPrice[0] : (maxPrice as string);
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPriceStr, 10));
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

/**
 * Creates a new category if it doesn't exist.
 * @param name The name of the category.
 * @returns The created or existing category.
 */
export const createCategory = async (name: string): Promise<Category> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const newCategory: Category = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    description: `Products in the ${name} category.`
  };
  categories.push(newCategory);
  return newCategory;
}

/**
 * Bulk creates products.
 * @param newProducts Array of products to create.
 * @param sellerId The ID of the seller creating the products.
 * @returns The created products.
 */
export const bulkCreateProducts = async (newProducts: Omit<Product, 'id' | 'sellerId'>[], sellerId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const createdProducts: Product[] = [];

  for (const p of newProducts) {
    // Ensure category exists
    await createCategory(p.category);

    const product: Product = {
      ...p,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sellerId,
    };
    allProducts.push(product);
    createdProducts.push(product);
  }

  return createdProducts;
}

/**
 * Fetches all wanted items.
 * @returns A promise that resolves to an array of wanted items.
 */
export const getWantedItems = async (): Promise<WantedItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return wantedItems;
}

/**
 * Creates a new wanted item.
 * @param item The wanted item to create.
 * @returns The created item.
 */
export const createWantedItem = async (item: Omit<WantedItem, 'id' | 'createdAt'>): Promise<WantedItem> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newItem: WantedItem = {
    ...item,
    id: `wanted_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  wantedItems.push(newItem);
  return newItem;
}

/**
 * Deletes a wanted item.
 * @param id The ID of the item to delete.
 */
export const deleteWantedItem = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = wantedItems.findIndex(i => i.id === id);
  if (index !== -1) {
    wantedItems.splice(index, 1);
  }
}
