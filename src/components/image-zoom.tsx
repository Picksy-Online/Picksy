import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ImageZoomProps = {
  src: string;
  alt: string;
  className?: string;
  imageHint?: string;
};

export function ImageZoom({ src, alt, className, imageHint }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setZoom(1); // Reset zoom on close
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div
          className={cn(
            'group relative cursor-zoom-in overflow-hidden',
            className
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
            data-ai-hint={imageHint}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-hidden">
        <DialogTitle className="sr-only">Zoomed image of {alt}</DialogTitle>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
          >
            <ZoomOut className="h-5 w-5" />
            <span className="sr-only">Zoom Out</span>
          </Button>
          <span className="flex items-center text-white text-sm font-medium px-2 min-w-[3ch] justify-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-5 w-5" />
            <span className="sr-only">Zoom In</span>
          </Button>
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full h-full transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
