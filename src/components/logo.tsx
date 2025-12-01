import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
}

export function Logo({ className, src = "/picksy-logo-header.png", alt = "Picksy Logo" }: LogoProps) {
  return (
    <div className={cn("relative w-32 h-10", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
