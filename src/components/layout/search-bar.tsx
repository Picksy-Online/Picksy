
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function SearchBar({ className }: { className?: string }) {
  const [isCardSearch, setIsCardSearch] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (isCardSearch) {
      params.set('category', 'Collector Cards');
    }
    router.push(`/browse?${params.toString()}`);
  };

  const handleCardSearchToggle = () => {
    const newIsCardSearch = !isCardSearch;
    setIsCardSearch(newIsCardSearch);

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (newIsCardSearch) {
      params.set('category', 'Collector Cards');
    }
    router.push(`/browse?${params.toString()}`);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className={cn("flex w-full items-center space-x-2", className)}>
      <Input
        type="search"
        placeholder="Search for items..."
        className="flex-1"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button type="submit" onClick={handleSearch}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isCardSearch ? 'secondary' : 'outline'}
              size="icon"
              onClick={handleCardSearchToggle}
              aria-pressed={isCardSearch}
            >
              <CreditCard className={cn("h-4 w-4", isCardSearch && "text-chart-5")} />
              <span className="sr-only">Toggle card-only search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search for Collector Cards only</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
