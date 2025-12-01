
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { List, X, MessageSquare, Loader2 } from 'lucide-react';
import { proactiveItemFinder } from '@/ai/flows/proactive-item-finder';
import { useRouter } from 'next/navigation';

type WantedItem = {
  name: string;
  imageUrl: string;
};

const initialWantedItems: WantedItem[] = [
  { name: 'Holographic Charizard', imageUrl: 'https://picsum.photos/seed/charizard/100/140' },
  { name: 'Michael Jordan Rookie Card', imageUrl: 'https://picsum.photos/seed/jordan/100/140' },
];

export default function WantedCardsPage() {
  const [wantedItems, setWantedItems] = useState<WantedItem[]>(initialWantedItems);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() === '') return;

    setIsLoading(true);
    try {
      const result = await proactiveItemFinder({
        itemDescription: newItem,
        userId: 'user-123', // In a real app, this would be the logged-in user's ID
      });

      if (result.searchInitiated) {
        // Use a placeholder image for newly added items
        const newWantedItem: WantedItem = {
            name: newItem,
            imageUrl: `https://picsum.photos/seed/${newItem.replace(/\s/g, '-')}/100/140`
        };
        setWantedItems((prev) => [...prev, newWantedItem]);
        setNewItem('');
        toast({
          title: 'Watchlist Updated',
          description: `We'll notify you when a "${newItem}" is listed.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: 'Failed to add item',
          description: result.reason || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add item to your watchlist.',
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRemoveItem = (itemToRemove: WantedItem) => {
      setWantedItems(prev => prev.filter(item => item.name !== itemToRemove.name));
      toast({
          title: 'Item Removed',
          description: `"${itemToRemove.name}" has been removed from your watchlist.`,
      })
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-start mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">My Card Watchlist</h1>
            <p className="text-muted-foreground mt-2">Add cards to your watchlist and get notified when they are listed.</p>
        </div>
        <Button onClick={() => router.push('/messages')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            View Messages
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add a Card to Watch</CardTitle>
               <CardDescription>Enter a card title or player name.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <Label htmlFor="newItem">Card Name / Player</Label>
                  <Input
                    id="newItem"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g., 'Mickey Mantle 1952 Topps'"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <List className="mr-2 h-4 w-4" />}
                  Add to Watchlist
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Your Watchlist</CardTitle>
                    <CardDescription>You are currently watching for {wantedItems.length} items.</CardDescription>
                </CardHeader>
                <CardContent>
                    {wantedItems.length > 0 ? (
                        <ul className="space-y-3">
                            {wantedItems.map((item, index) => (
                                <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                    <div className="flex items-center gap-4">
                                        <Image 
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={50}
                                            height={70}
                                            className="rounded-md object-cover aspect-[5/7]"
                                        />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Your watchlist is empty.</p>
                            <p className="text-sm">Add an item using the form to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
