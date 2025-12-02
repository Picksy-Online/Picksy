'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductImageLightboxProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductImageLightbox({ product, isOpen, onClose }: ProductImageLightboxProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
            setIsZoomed(false);
        }
    }, [isOpen]);

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
        setIsZoomed(false);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
        setIsZoomed(false);
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-none text-white flex flex-col items-center justify-center overflow-hidden">
                <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 text-white">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                </DialogClose>

                {/* Main Image Area */}
                <div className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden">
                    {/* Navigation Arrows */}
                    {product.imageUrls.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </>
                    )}

                    {/* Image */}
                    <div
                        className={cn(
                            "relative transition-transform duration-300 ease-in-out cursor-zoom-in",
                            isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
                        )}
                        onClick={toggleZoom}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div className={cn(
                            "relative w-full h-full",
                            isZoomed ? "overflow-auto" : "overflow-hidden"
                        )}>
                            <Image
                                src={product.imageUrls[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Zoom Indicator/Controls */}
                    <div className="absolute bottom-4 right-4 z-50 flex gap-2">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); toggleZoom(); }}>
                            {isZoomed ? <ZoomOut className="h-4 w-4 mr-2" /> : <ZoomIn className="h-4 w-4 mr-2" />}
                            {isZoomed ? "Zoom Out" : "Zoom In"}
                        </Button>
                    </div>
                </div>

                {/* Thumbnails */}
                {product.imageUrls.length > 1 && (
                    <div className="w-full p-4 bg-black/80 overflow-x-auto flex justify-center gap-2 z-50">
                        {product.imageUrls.map((url, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setCurrentImageIndex(idx); setIsZoomed(false); }}
                                className={cn(
                                    "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                                    currentImageIndex === idx ? "border-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
