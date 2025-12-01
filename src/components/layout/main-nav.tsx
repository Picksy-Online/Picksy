
import Link from "next/link";
import { cn } from "@/lib/utils";

export function MainNav() {
  const navLinks = [
    { href: "/browse", label: "All" },
    { href: "/collector-cards", label: "Cards" },
    { href: "/collectable-coins", label: "Coins" },
    { href: "/collectibles", label: "Collectables" },
    { href: "/sellers", label: "Sellers" },
    { href: "/business", label: "Business" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="transition-colors text-foreground/60 hover:text-foreground/80"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
