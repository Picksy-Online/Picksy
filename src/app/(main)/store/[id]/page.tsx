
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { users } from '@/lib/data';
import { getProductsBySellerId } from '@/services/product-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, ShieldAlert, UserPlus, Ban } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Product, User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

interface StorePageProps {
  params: {
    id: string;
  };
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
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
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const { user: authUser } = useAuth();
  const user = authUser as unknown as User | null;
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.email === '1@1.com';

  const seller = users.find((user) => user.id === params.id);

  useEffect(() => {
    if (seller) {
      setLoading(true);
      getProductsBySellerId(seller.id)
        .then(setSellerProducts)
        .finally(() => setLoading(false));
    }
  }, [seller]);

  if (!seller) {
    notFound();
  }

  if (user?.blockedSellerIds?.includes(seller.id) && !isSuperAdmin) {
    return (
      <div className="container py-12 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Ban className="w-4 h-4" />
          <AlertTitle>Seller Blocked</AlertTitle>
          <AlertDescription>
            You have blocked this seller. You cannot view their store or products.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const publicProducts = sellerProducts.filter((p) => !p.isPrivate);
  const privateProducts = sellerProducts.filter((p) => p.isPrivate);

  const hasPrivateProducts = privateProducts.length > 0;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === seller.privateCollectionPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const getPrivateCollectionAccessState = () => {
    if (isSuperAdmin) {
      return { canAccess: true, reason: null, message: null, icon: null };
    }
    if (!user) {
      return {
        canAccess: false,
        reason: 'login',
        message: 'You must be logged in to view private collections.',
        icon: <UserPlus />,
      };
    }
    if (!user.birthDate || calculateAge(user.birthDate) < 18) {
      return {
        canAccess: false,
        reason: 'age',
        message: 'You must be 18 or older to view this collection.',
        icon: <ShieldAlert />,
      };
    }
    if (!user.friendIds?.includes(seller.id)) {
      return {
        canAccess: false,
        reason: 'friend',
        message: `You must be friends with ${seller.storeName} to view this collection.`,
        icon: <UserPlus />,
      };
    }
    return { canAccess: true, reason: null, message: null, icon: null };
  };

  const accessState = getPrivateCollectionAccessState();

  const renderPrivateCollection = () => {
    if (!accessState.canAccess) {
      return (
        <div className="max-w-md p-6 mx-auto rounded-lg bg-secondary">
          <Alert variant="destructive">
            <div className="flex items-center gap-3">
              {accessState.icon}
              <AlertTitle>{accessState.message}</AlertTitle>
            </div>
            {accessState.reason === 'login' && (
              <Button asChild className="mt-4">
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </Alert>
        </div>
      );
    }

    if (!isUnlocked && !isSuperAdmin) {
      return (
        <div className="max-w-md p-6 mx-auto rounded-lg bg-secondary">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <p className="font-semibold">This collection is password protected.</p>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <Button type="submit" className="w-full">Unlock</Button>
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-0">
        {privateProducts.map((product) => (
          <ProductCard key={product.id} product={product} forceSquare />
        ))}
      </div>
    );
  };


  return (
    <div className="container py-12">
      <h1 className="sr-only">Store page for {seller.storeName}</h1>
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left md:items-start">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage src={seller.avatarUrl} alt={seller.name} />
          <AvatarFallback className="text-4xl">
            {(seller.name || 'U').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">{seller.storeName}</h1>
          <p className="text-lg text-muted-foreground">{seller.name}</p>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground md:mx-0">
            {seller.bio}
          </p>
        </div>
        {user && user.id !== seller.id && !isSuperAdmin && (
          <div>
            <Button variant="destructive" size="sm">
              <Ban className="mr-2 h-4 w-4" />
              Block Seller
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="mb-8 text-2xl font-bold text-center font-headline md:text-left">
          Products from {seller.storeName}
        </h2>
        {loading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-0">
            {publicProducts.length > 0 ? (
              publicProducts.map((product) => (
                <ProductCard key={product.id} product={product} forceSquare />
              ))
            ) : (
              <p className="col-span-full">This seller has no public products yet.</p>
            )}
          </div>
        )}
      </div>

      {hasPrivateProducts && (
        <>
          <Separator className="my-12" />
          <div className="mt-12">
            <h2 className="mb-8 text-2xl font-bold text-center font-headline md:text-left">
              Private Collection
            </h2>
            {renderPrivateCollection()}
          </div>
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: seller.storeName || seller.name,
              description: seller.bio,
              image: seller.avatarUrl,
            },
          }),
        }}
      />
    </div>
  );
}
