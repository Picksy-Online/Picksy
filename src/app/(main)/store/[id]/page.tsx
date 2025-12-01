import { notFound } from 'next/navigation';
import { users } from '@/lib/data';
import { Metadata } from 'next';
import StorePageContent from './StorePageContent';

interface StorePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const seller = users.find((user) => user.id === params.id);

  if (!seller) {
    return {
      title: "Store Not Found",
    };
  }

  return {
    title: `${seller.storeName || seller.name}'s Store`,
    description: seller.bio || `Check out ${seller.storeName || seller.name}'s collection on Picksy.`,
    openGraph: {
      title: `${seller.storeName || seller.name}'s Store`,
      description: seller.bio || `Check out ${seller.storeName || seller.name}'s collection on Picksy.`,
      images: [seller.avatarUrl || "/og-image.jpg"],
    },
  };
}

export default function StorePage({ params }: StorePageProps) {
  const seller = users.find((user) => user.id === params.id);

  if (!seller) {
    notFound();
  }

  return <StorePageContent sellerId={params.id} />;
}
