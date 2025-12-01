
'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, Settings, User as UserIcon, Shield, Loader2, MessageSquare, Palette, Sparkles } from "lucide-react";
import { useFirebase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAnimation } from "@/context/AnimationContext";
import { Switch } from "../ui/switch";


export function UserNav() {
  const { user, isUserLoading } = useFirebase();
  const auth = getAuth();
  const { animationsEnabled, setAnimationsEnabled } = useAnimation();
  
  if (isUserLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const isSuperUser = user.email === '1@1.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/sales">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Messages</span>
            </Link>
          </DropdownMenuItem>
           {isSuperUser ? (
             <DropdownMenuItem asChild>
                <Link href="/admin/site-content">
                  <Palette className="w-4 h-4 mr-2" />
                  <span>Site Content</span>
                </Link>
              </DropdownMenuItem>
           ) : (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield className="w-4 h-4 mr-2" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
           )}
          <DropdownMenuItem asChild>
            <Link href="/profile/settings">
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Card Animations</span>
            <Switch
                className="ml-auto"
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
            />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => auth.signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
