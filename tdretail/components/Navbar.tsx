'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Store,
  Disc,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Terminal,
  Menu,
  X,
  ArrowRight,
  Zap,
  Code2,
} from 'lucide-react';
import { resolveStorefrontUrl } from '@/lib/storefrontConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const isChatView = pathname?.startsWith('/chat');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl rounded-full border border-border/80 bg-background/85 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-border/95 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2">
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-xs">
              TD
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-foreground">
                Retail
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground hidden md:inline px-1.5 py-0.5 rounded-full bg-muted border border-border/50">
                AI Platform
              </span>
            </div>
          </NextLink>
        </div>

        {/* Desktop Floating Navigation Menu Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Merchants Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 px-3 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted/60 data-popup-open:bg-muted/80">
                  <Store className="h-3.5 w-3.5 mr-1" />
                  <span>Merchants</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-3 w-80 bg-popover/95 backdrop-blur-md border border-border rounded-2xl shadow-xl">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 tracking-wider">
                      Live Merchant Storefronts
                    </p>
                    <a
                      href={resolveStorefrontUrl('music')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Disc className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            SoundWave Digital
                            <Badge variant="outline" className="text-[9px] py-0 px-1 text-indigo-500 border-indigo-500/30">
                              Port 3001
                            </Badge>
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          Lossless masters, vinyl stems & licenses
                        </p>
                      </div>
                    </a>

                    <a
                      href={resolveStorefrontUrl('technology')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            Volt Nest
                            <Badge variant="outline" className="text-[9px] py-0 px-1 text-cyan-500 border-cyan-500/30">
                              Port 3002
                            </Badge>
                          </span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          GaN fast chargers, ANC earbuds & smart gear
                        </p>
                      </div>
                    </a>

                    <div className="pt-2 border-t border-border space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 tracking-wider">
                        AI Agent Chat Demos
                      </p>
                      <NavigationMenuLink
                        render={<NextLink href="/chat/new?merchantId=merchant_music" />}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-xs text-foreground cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Disc className="h-3 w-3 text-indigo-500" />
                          <span>SoundWave License Support</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Chat &rarr;</span>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        render={<NextLink href="/chat/new?merchantId=merchant_b" />}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted text-xs text-foreground cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-cyan-500" />
                          <span>Volt Nest Warranty & RMA</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Chat &rarr;</span>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Chat & Inbox Direct Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<NextLink href="/inbox" />}
                  className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    pathname?.startsWith('/inbox') || isChatView
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1 inline" />
                  <span>Chat & Inbox</span>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Outbox & Webhooks Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<NextLink href="/outbox" />}
                  className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    pathname === '/outbox'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 mr-1 inline" />
                  <span>Outbox</span>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Merchant Portal Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<NextLink href="/merchant" />}
                  className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    pathname?.startsWith('/merchant')
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Store className="h-3.5 w-3.5 mr-1 inline text-primary" />
                  <span>Merchant Portal</span>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* API Documentation Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<NextLink href="/docs" />}
                  className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    pathname?.startsWith('/docs')
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5 mr-1 inline" />
                  <span>API Docs</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right CTA & Mobile Hamburger Sheet */}
        <div className="flex items-center gap-2 pr-1">
          <NextLink href="/login" className="hidden sm:inline-flex">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
          </NextLink>

          <NextLink href="/chat/new?merchantId=merchant_music" className="hidden sm:inline-flex">
            <Button
              size="sm"
              className="h-8 px-3.5 rounded-full text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-all hover:scale-102"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Demo</span>
            </Button>
          </NextLink>

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-foreground">
                    <Menu className="h-4 w-4" />
                  </Button>
                }
              />
              <SheetContent side="top" className="rounded-b-3xl border-border bg-background/95 backdrop-blur-xl pt-6 pb-8">
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <SheetTitle className="text-sm font-bold flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      TD
                    </span>
                    <span>TD Retail Navigation</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="pt-4 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 tracking-wider">
                      Storefronts
                    </p>
                    <NextLink
                      href="/chat/new?merchantId=merchant_music"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Disc className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">SoundWave Digital</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        AI Chat
                      </Badge>
                    </NextLink>

                    <NextLink
                      href="/chat/new?merchantId=merchant_b"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Zap className="h-4 w-4 text-cyan-500" />
                        <span className="text-xs font-medium text-foreground">Volt Nest Smart Tech</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        AI Chat
                      </Badge>
                    </NextLink>
                  </div>

                  <div className="space-y-1 border-t border-border pt-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 tracking-wider">
                      Workspaces
                    </p>
                    <NextLink
                      href="/inbox"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-medium text-foreground"
                    >
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Consolidated Chat & Inbox</span>
                    </NextLink>

                    <NextLink
                      href="/outbox"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-medium text-foreground"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Email Outbox & Webhooks</span>
                    </NextLink>

                    <NextLink
                      href="/merchant"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-medium text-foreground"
                    >
                      <Store className="h-4 w-4 text-primary" />
                      <span>Merchant Portal (Staff & Admin)</span>
                    </NextLink>

                    <NextLink
                      href="/docs"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-medium text-foreground"
                    >
                      <Code2 className="h-4 w-4 text-primary" />
                      <span>API Reference & Docs</span>
                    </NextLink>
                  </div>

                  <div className="pt-2">
                    <NextLink href="/chat/new?merchantId=merchant_music" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-full gap-2 text-xs font-semibold bg-primary text-primary-foreground h-10">
                        <Sparkles className="h-4 w-4" />
                        <span>Launch Interactive Demo</span>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </NextLink>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
