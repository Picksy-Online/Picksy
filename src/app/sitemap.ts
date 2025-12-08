import { MetadataRoute } from 'next';
import { products, users, categories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://picksy.au';

    // Static routes
    const routes = [
        '',
        '/browse',
        '/collector-cards',
        '/collectable-coins',
        '/collectibles',
        '/auctions',
        '/sellers',
        '/business',
        '/login',
        '/register',
        '/sell-cards',
        '/sell-coins',
        '/sell-collectibles',
        '/wanted',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Product routes
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Store routes
    const storeRoutes = users.map((user) => ({
        url: `${baseUrl}/store/${user.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Category/Collection routes
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/collections/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...productRoutes, ...storeRoutes, ...categoryRoutes];
}
