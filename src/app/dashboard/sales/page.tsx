'use client';

import { useAuth } from '@/hooks/use-auth';
import { products as allProducts, users } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Package,
  CreditCard,
  Users,
  PlusCircle,
  BarChart,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for top purchasers and recent sales
const topPurchasers = [
  { id: 'user_4', name: 'Sophia', avatarUrl: 'https://picsum.photos/seed/sophia/100/100', purchases: 12, totalSpent: 450.75 },
  { id: 'user_5', name: 'Liam', avatarUrl: 'https://picsum.photos/seed/liam/100/100', purchases: 9, totalSpent: 320.50 },
  { id: 'user_6', name: 'Olivia', avatarUrl: 'https://picsum.photos/seed/olivia/100/100', purchases: 7, totalSpent: 280.00 },
];

const recentSales = allProducts.slice(0, 3).map(p => ({ ...p, date: new Date().toLocaleDateString() }));

export default function SalesPage() {
  const { user } = useAuth();

  if (!user || !user.id) {
    return null; // or a loading spinner
  }

  const sellerProducts = allProducts.filter(p => p.sellerId === user.id);
  const totalRevenue = sellerProducts.reduce((acc, p) => acc + p.price, 0); // Simplified for example
  const totalSales = sellerProducts.length; // Simplified, assuming all listed are sold for this example
  const advertisedListings = sellerProducts.filter(p => !p.isPrivate).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: `+${totalSales}`,
      change: '+19% from last month',
      icon: CreditCard,
    },
    {
      title: 'Active Listings',
      value: advertisedListings,
      change: 'Your current products for sale',
      icon: Package,
    },
    {
      title: 'Top Viewers',
      value: '1,204',
      change: 'Total views this month',
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            A complete overview of your store's performance.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/sell-cards">Sell Card</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sell-coins">Sell Coin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sell-collectibles">Sell Collectible</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/wanted/create">Post Wanted Item</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>Manage your current product listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="rounded-md aspect-square object-cover"
                        height="64"
                        src={product.imageUrls[0]}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.isPrivate ? 'outline' : 'secondary'}>
                        {product.isPrivate ? 'Private' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="secondary" size="sm">Renew</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Purchasers</CardTitle>
              <CardDescription>Your most loyal customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPurchasers.map(p => (
                <div key={p.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={p.avatarUrl} />
                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.purchases} purchases</p>
                  </div>
                  <div className="font-medium">{formatCurrency(p.totalSpent)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {recentSales.map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div className="font-medium">{sale.name}</div>
                        <div className="text-sm text-muted-foreground">{sale.date}</div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
