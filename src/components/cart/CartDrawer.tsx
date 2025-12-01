"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, Store } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CartDrawer() {
    const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const [isCashOnCollection, setIsCashOnCollection] = useState(false);

    // Calculate deposit (20%)
    const depositAmount = cartTotal * 0.20;
    const remainingAmount = cartTotal - depositAmount;

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Your cart is empty</p>
                        <p className="text-sm">Looks like you haven&apos;t added anything yet.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-primary"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                                            <Image
                                                src={item.imageUrls[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium line-clamp-2 text-sm">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-6 mt-auto space-y-4">
                            <div className="flex items-center space-x-2 border p-3 rounded-lg bg-secondary/20">
                                <Switch
                                    id="cash-collection"
                                    checked={isCashOnCollection}
                                    onCheckedChange={setIsCashOnCollection}
                                />
                                <Label htmlFor="cash-collection" className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Store className="w-4 h-4" />
                                        Cash on Collection
                                    </div>
                                </Label>
                            </div>

                            {isCashOnCollection && (
                                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
                                    <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Collection Terms</AlertTitle>
                                    <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs space-y-1">
                                        <p>• Pay a <strong>20% deposit</strong> now via card to reserve items.</p>
                                        <p>• Items are held for <strong>48 hours</strong>.</p>
                                        <p>• Pay the remaining balance in-store upon collection.</p>
                                        <p>• <strong>Deposit is forfeited</strong> if not collected within 48h.</p>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>

                                {isCashOnCollection && (
                                    <>
                                        <div className="flex justify-between text-base text-muted-foreground">
                                            <span>Deposit (20%)</span>
                                            <span className="font-medium text-foreground">{formatCurrency(depositAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-base text-muted-foreground">
                                            <span>Pay on Collection</span>
                                            <span>{formatCurrency(remainingAmount)}</span>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>{isCashOnCollection ? 'Pay Now' : 'Total'}</span>
                                    <span>{formatCurrency(isCashOnCollection ? depositAmount : cartTotal)}</span>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Button className="w-full" size="lg">
                                    {isCashOnCollection ? 'Pay Deposit & Reserve' : 'Checkout'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
