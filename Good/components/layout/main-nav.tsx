
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navLinks = [
  { href: '/browse', label: 'All' },
  { href: '/collector-cards', label: 'Cards' },
  { href: '/collectibles', label: 'Collectibles' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/business', label: 'Business' },
];

const iconNavLinks = [
    {
        href: '/browse',
        label: 'Marketplace',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21V8L4.33013 5.33975C4.71714 4.56372 5.48531 4 6.33013 4H17.6699C18.5147 4 19.2829 4.56372 19.6699 5.33975L21 8V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 21H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        )
    },
    {
        href: '/collector-cards',
        label: 'Collector Cards',
        icon: (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="6" y="5" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="6" y="11" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
        )
    },
    {
        href: '/collectibles',
        label: 'Collectibles',
        icon: (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 21H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 21V10H14V21" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 7H5C3.89543 7 3 7.89543 3 9V17C3 18.1046 3.89543 19 5 19H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        )
    },
    {
        href: '/auctions',
        label: 'Auctions',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 2.5L3.5 12.5L9.5 18.5L19.5 8.5L13.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 15L1 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M17.5 15H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        )
    }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Text links for medium screens and up */}
      <nav className="hidden md:flex items-center gap-6 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors text-foreground/60 hover:text-foreground/80',
              {
                'text-foreground font-semibold': pathname.startsWith(link.href),
              }
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Icon links for small screens (mobile) - handled by MobileNav, so this can be removed or kept for specific small-but-not-mobile cases if any */}
      <nav className="hidden items-center gap-4">
        <TooltipProvider>
          {iconNavLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    'p-2 rounded-md transition-colors hover:bg-muted',
                    { 'bg-muted': pathname.startsWith(link.href) }
                  )}
                >
                  {link.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </>
  );
}
