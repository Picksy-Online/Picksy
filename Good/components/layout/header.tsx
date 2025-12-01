
import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserNav } from "@/components/layout/user-nav";
import { MainNav } from "./main-nav";
import { SearchBar } from "./search-bar";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div
        className={cn(
          "grid grid-cols-[auto,1fr] gap-4 px-4 py-3 md:px-6"
        )}
      >
        {/* This div acts as a spacer, taking up the width of the sidebar */}
        <div className={cn(
            "w-0 md:w-[var(--sidebar-width-icon)] lg:group-data-[state=expanded]:w-[var(--sidebar-width)] transition-all duration-200"
        )}></div>

        {/* This div contains the actual header content */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center h-16 justify-end">
              <div className="flex items-center gap-6 md:gap-10">
                 <div className="hidden md:block"><SearchBar /></div>
                 <MainNav />
                 <UserNav />
              </div>
              <div className="ml-4 md:hidden">
                <MobileNav />
              </div>
            </div>
            <div className="flex justify-center md:hidden">
              <SearchBar />
            </div>
        </div>
      </div>
    </header>
  );
}
