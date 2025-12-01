
'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ImageZoomProps = {
  src: string;
  alt: string;
  className?: string;
  imageHint?: string;
};

export function ImageZoom({ src, alt, className, imageHint }: ImageZoomProps) {
  return (
    <Dialog>
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
      <DialogContent className="sm:max-w-[90vw] h-[90vh] p-4 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
