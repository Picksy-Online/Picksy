
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Zap, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products as productsData, Product } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { crossPlatformPost, CrossPlatformPostOutput } from '@/ai/flows/cross-platform-posting';

const marketplaces = ['eBay', 'Etsy', 'Amazon', 'Facebook Marketplace'];

const formSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
  marketplace: z.string().min(1, 'Please select a marketplace.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CrossPlatformPostingPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrossPlatformPostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      marketplace: '',
    }
  });

  useEffect(() => {
    // In a real app, you'd fetch products for the current seller
    if (user) {
      setProducts(productsData.filter(p => p.sellerId === user.id));
    }
  }, [user]);

  const selectedProduct = form.watch('productId') 
    ? products.find(p => p.id === form.watch('productId'))
    : null;
    
  const selectedMarketplace = form.watch('marketplace');

  const onSubmit = async (values: FormValues) => {
    if (!selectedProduct) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await crossPlatformPost({
        productDescription: selectedProduct.description,
        marketplace: values.marketplace,
        currentListing: `Title: ${selectedProduct.name}\nPrice: ${selectedProduct.price}`,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate optimized listing.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleShareToFacebook = () => {
    if (!selectedProduct || !result) return;
    
    // It's best to get the origin dynamically in a real app
    const siteUrl = window.location.origin;
    const productUrl = `${siteUrl}/product/${selectedProduct.id}`;
    
    // The quote param is used by Facebook to pre-fill the post text
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(result.optimizedListing)}`;
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Cross-Platform Lister</h1>
        <p className="text-muted-foreground">
          Optimize your product listings for other marketplaces using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select a Product and Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
                <Select onValueChange={(value) => form.setValue('productId', value)} defaultValue={form.getValues('productId')}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product to optimize..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.productId && <p className="text-sm text-red-600 mt-1">{form.formState.errors.productId.message}</p>}
              </div>

              <div>
                <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700">Marketplace</label>
                <Select onValueChange={(value) => form.setValue('marketplace', value)} defaultValue={form.getValues('marketplace')}>
                  <SelectTrigger id="marketplace">
                    <SelectValue placeholder="Select a target marketplace..." />
                  </SelectTrigger>
                  <SelectContent>
                    {marketplaces.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                 {form.formState.errors.marketplace && <p className="text-sm text-red-600 mt-1">{form.formState.errors.marketplace.message}</p>}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Optimize Listing
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Optimized Listing</CardTitle>
            <CardDescription>
              Your generated listing and tags will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Optimized Description</h3>
                  <div className="relative">
                    <Textarea value={result.optimizedListing} readOnly rows={8} className="bg-muted" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => copyToClipboard(result.optimizedListing)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {result.tags && result.tags.length > 0 && (
                   <div>
                    <h3 className="font-semibold mb-2">Suggested Tags</h3>
                    <div className="relative">
                      <Textarea value={result.tags.join(', ')} readOnly rows={3} className="bg-muted" />
                       <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => copyToClipboard(result.tags?.join(', ') || '')}
                      >
                        <Copy className="h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                 {selectedMarketplace === 'Facebook Marketplace' && (
                  <Button onClick={handleShareToFacebook} className="w-full">
                    <Facebook className="mr-2 h-4 w-4" />
                    Share on Facebook
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    