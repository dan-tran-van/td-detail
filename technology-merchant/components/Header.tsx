'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Receipt, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Minimalist Brand Identity matching template */}
        <NextLink href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1.5 font-black text-xl tracking-tighter text-foreground uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block group-hover:scale-125 transition-transform" />
            <span>Volt Nest</span>
          </div>
        </NextLink>

        {/* Center: Clean Consumer Tech Category Links (Noise template style) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide text-muted-foreground">
          <a href="/#catalogue" className="hover:text-foreground transition-colors">
            Smart Watches
          </a>
          <a href="/#catalogue" className="hover:text-foreground transition-colors">
            Wireless Audio
          </a>
          <a href="/#catalogue" className="hover:text-foreground transition-colors">
            GaN Chargers
          </a>
          <NextLink
            href="/policy"
            className={pathname === '/policy' ? 'text-primary font-bold' : 'hover:text-foreground transition-colors'}
          >
            Warranty Policy
          </NextLink>
        </nav>

        {/* Right: Essential Quick Actions (Orders & Cart) */}
        <div className="flex items-center gap-2">
          {/* Orders quick link */}
          <NextLink href="/orders">
            <Button
              variant={pathname.startsWith('/orders') ? 'secondary' : 'ghost'}
              size="sm"
              className="text-xs h-9 gap-1.5 font-semibold text-muted-foreground hover:text-foreground"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </Button>
          </NextLink>

          {/* Cart with badge */}
          <NextLink href="/cart">
            <Button
              variant={pathname === '/cart' ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-9 px-3 gap-2 relative border-border font-semibold shadow-2xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <Badge
                  variant={pathname === '/cart' ? 'secondary' : 'default'}
                  className="h-5 min-w-5 px-1.5 text-[10px] font-black flex items-center justify-center rounded-full"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </NextLink>
        </div>
      </div>
    </header>
  );
}
