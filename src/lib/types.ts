
import { type User as FirebaseUser } from 'firebase/auth';

// We can extend the FirebaseUser type to include our custom fields
export type User = FirebaseUser & {
  id: string; // Mock data uses id
  name?: string; // Mock data uses name
  avatarUrl?: string; // Mock data uses avatarUrl
  storeName?: string;
  bio?: string;
  friendIds?: string[];
  blockedSellerIds?: string[];
  birthDate?: string;
  privateCollectionPassword?: string;
  postcode?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerId: string;
  imageUrls: string[];
  imageHint: string;
  isPrivate?: boolean;
};

export type Auction = {
  id: string;
  name: string;
  description: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  sellerId: string;
  imageUrl: string;
  imageHint: string;
};

export type ProductSearchParams = {
  [key: string]: string | string[] | undefined
  sort?: 'newest' | 'price-asc' | 'price-desc';
  view?: 'grid' | 'list' | 'gallery';
  page?: string;
  limit?: string;
  category?: string;
  seller?: string;
  minPrice?: string;
  maxPrice?: string;
};
