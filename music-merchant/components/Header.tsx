'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Disc, ShoppingBag, Receipt, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Merchant Brand Identity */}
        <NextLink href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs group-hover:opacity-90 transition-opacity">
            <Disc className="h-5 w-5 animate-[spin_8s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                SoundWave Digital
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-border">
                Merchant A
              </Badge>
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Lossless Master Stems & Digital Licenses
            </span>
          </div>
        </NextLink>

        {/* Navigation Items composed with shadcn Button and Badge */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NextLink href="/">
            <Button
              variant={pathname === '/' ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs h-9 gap-1.5"
            >
              <Disc className="h-4 w-4" />
              <span className="hidden sm:inline">Releases</span>
            </Button>
          </NextLink>

          <NextLink href="/orders">
            <Button
              variant={pathname.startsWith('/orders') ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs h-9 gap-1.5"
            >
              <Receipt className="h-4 w-4" />
              <span>Orders</span>
            </Button>
          </NextLink>

          <NextLink href="/outbox">
            <Button
              variant={pathname === '/outbox' ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs h-9 gap-1.5"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Outbox</span>
            </Button>
          </NextLink>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Cart Trigger */}
          <NextLink href="/cart">
            <Button
              variant={pathname === '/cart' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-9 gap-2 relative"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <Badge
                  variant={pathname === '/cart' ? 'secondary' : 'default'}
                  className="h-5 min-w-5 px-1.5 text-[11px] font-bold flex items-center justify-center rounded-full"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </NextLink>

          {/* Connected TD Retail Support Trigger */}
          <NextLink href="/orders">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5 border-border bg-card hidden md:inline-flex"
            >
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>Get Support</span>
            </Button>
          </NextLink>
        </nav>
      </div>
    </header>
  );
}
