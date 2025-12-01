
'use client';
import { products as initialProducts, users } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { deleteProductAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function AdminProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState(initialProducts);

    const handleDelete = async (productId: string, sellerId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        const seller = users.find(u => u.id === sellerId);
        if (!seller) {
            toast({ variant: 'destructive', title: 'Error', description: 'Seller not found.' });
            return;
        }

        const result = await deleteProductAction({ 
            productId, 
            sellerEmail: seller.email || 'No email on file',
            sellerName: seller.name || 'Seller',
            productName: products.find(p => p.id === productId)?.name || 'the product'
        });

        if (result.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        } else {
            toast({ title: 'Success', description: 'Product has been deleted and the seller has been notified.' });
            // Here you would typically re-fetch the products data to update the UI
            setProducts(prev => prev.filter(p => p.id !== productId));
        }
    };

  return (
    <div>
      <h1 className="sr-only">Manage Products</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>A list of all products on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
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
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {users.find(u => u.id === product.sellerId)?.storeName || product.sellerId}
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(product.id, product.sellerId)}
                        >
                            Delete
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
