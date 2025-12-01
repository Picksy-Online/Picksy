import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative w-32 h-10", className)}>
      <Image
        src="/picksy-logo-v2.png"
        alt="Picksy Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
