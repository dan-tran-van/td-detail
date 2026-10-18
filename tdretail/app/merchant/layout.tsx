'use client';

import React, { useState, useEffect, Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  LayoutDashboard,
  AlertTriangle,
  Package,
  Mail,
  PlusCircle,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Disc,
  Zap,
  ShoppingBag,
  RefreshCw,
  Home,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { resolveMerchantStorefrontUrl } from '@/lib/storefrontConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MerchantSessionData } from '@/lib/types';

function getMerchantIcon(category?: string, id?: string) {
  if (category === 'digital_music' || id === 'merchant_a' || id === 'merchant_music') {
    return Disc;
  }
  if (category === 'tech_accessories' || id === 'merchant_b' || id === 'merchant_tech') {
    return Zap;
  }
  return ShoppingBag;
}

function MerchantLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<MerchantSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [escalationsCount, setEscalationsCount] = useState<number>(0);

  const isAuthPage =
    pathname === '/merchant/login' || pathname === '/merchant/register';

  const checkSession = async () => {
    try {
      const res = await fetch('/api/merchant/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setSession(data);
          // Fetch pending escalations count
          try {
            const escRes = await fetch('/api/merchant/escalations');
            if (escRes.ok) {
              const escData = await escRes.json();
              setEscalationsCount(escData.count || 0);
            }
          } catch {
            // ignore
          }
        } else if (!isAuthPage) {
          router.push('/merchant/login');
        }
      } else if (!isAuthPage) {
        router.push('/merchant/login');
      }
    } catch (err) {
      if (!isAuthPage) {
        router.push('/merchant/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/merchant/session', { method: 'DELETE' });
      setSession(null);
      router.push('/merchant/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSwitchMerchant = async (merchantId: string) => {
    try {
      const res = await fetch('/api/merchant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoMerchantId: merchantId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        try {
          const escRes = await fetch('/api/merchant/escalations');
          if (escRes.ok) {
            const escData = await escRes.json();
            setEscalationsCount(escData.count || 0);
          }
        } catch {}
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to switch merchant:', err);
    }
  };

  // If on login or registration page, render without the dashboard sidebar wrapper
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        {children}
      </div>
    );
  }

  const MerchantIcon = getMerchantIcon(session?.merchant?.category, session?.merchant?.id);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar className="border-r border-border bg-card">
          {/* Sidebar Header: Active Merchant Switcher */}
          <SidebarHeader className="border-b border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/70 transition-all text-left w-full group cursor-pointer">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-primary-foreground shadow-xs shrink-0"
                        style={{ backgroundColor: session?.merchant?.brandColor || '#3b82f6' }}
                      >
                        <MerchantIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                          {session?.merchant?.name || 'Merchant Portal'}
                          <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground shrink-0" />
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          ID: {session?.merchant?.id || '—'}
                        </div>
                      </div>
                    </button>
                  }
                />
                <DropdownMenuContent align="start" className="w-64 p-1.5">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-2 py-1">
                      Quick Switch Storefront
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleSwitchMerchant('merchant_music')}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                    >
                      <Disc className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-medium text-foreground">SoundWave Digital</div>
                        <div className="text-[10px] text-muted-foreground">Digital Music Store (Merchant A)</div>
                      </div>
                      {(session?.merchant?.id === 'merchant_music' || session?.merchant?.id === 'merchant_a') && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleSwitchMerchant('merchant_b')}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                    >
                      <Zap className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="text-xs font-medium text-foreground">Volt Nest Storefront</div>
                        <div className="text-[10px] text-muted-foreground">Consumer Tech Store (Merchant B)</div>
                      </div>
                      {session?.merchant?.id === 'merchant_b' && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={<NextLink href="/merchant/register" />}
                    className="flex items-center gap-2 p-2 rounded-lg text-primary cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-medium">Register New Merchant</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarHeader>

          {/* Sidebar Nav Items */}
          <SidebarContent className="px-2 py-3 space-y-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-2">
                Merchant Operations
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1 pt-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant" />}
                      isActive={pathname === '/merchant'}
                      tooltip="Dashboard Overview"
                      className="cursor-pointer font-medium text-xs rounded-lg"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant/escalations" />}
                      isActive={pathname?.startsWith('/merchant/escalations')}
                      tooltip="Escalated Support Requests"
                      className="cursor-pointer font-medium text-xs rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Escalations</span>
                      </div>
                      {escalationsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-4 px-1.5 text-[10px] font-bold rounded-full"
                        >
                          {escalationsCount}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant/orders" />}
                      isActive={pathname?.startsWith('/merchant/orders')}
                      tooltip="Orders & Fulfillment"
                      className="cursor-pointer font-medium text-xs rounded-lg"
                    >
                      <Package className="h-4 w-4" />
                      <span>Order Fulfillment</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant/outbox" />}
                      isActive={pathname?.startsWith('/merchant/outbox')}
                      tooltip="Dispatched Outbox Emails"
                      className="cursor-pointer font-medium text-xs rounded-lg"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Dispatched Outbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-2">
                Configuration
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1 pt-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant/settings" />}
                      isActive={pathname === '/merchant/settings'}
                      tooltip="Store Details & AI Policy"
                      className="cursor-pointer font-medium text-xs rounded-lg"
                    >
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>Store Details & Policy</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/merchant/register" />}
                      isActive={pathname === '/merchant/register'}
                      tooltip="Register New Storefront"
                      className="cursor-pointer font-medium text-xs rounded-lg"
                    >
                      <PlusCircle className="h-4 w-4 text-primary" />
                      <span>Register Merchant</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<NextLink href="/" />}
                      tooltip="Back to Public Site"
                      className="cursor-pointer font-medium text-xs rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-4 w-4" />
                      <span>Platform Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer: Staff Account & Logout */}
          <SidebarFooter className="border-t border-border p-3 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <div className="truncate">
                <p className="font-semibold text-foreground truncate text-xs">
                  {session?.user?.name || 'Staff User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main Content View with Topbar */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-foreground">
                  {session?.merchant?.name || 'Merchant Dashboard'}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {session?.merchant?.category?.replace('_', ' ') || 'Merchant'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const storefrontLink = resolveMerchantStorefrontUrl(session?.merchant);
                if (!storefrontLink || storefrontLink === '#') return null;
                return (
                  <a
                    href={storefrontLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <span>Live Storefront</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                );
              })()}
              <NextLink href={`/chat/new?merchantId=${session?.merchant?.id || 'merchant_music'}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Consumer Chat</span>
                </Button>
              </NextLink>
            </div>
          </header>

          <main key={session?.merchant?.id || 'default'} className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <MerchantLayoutInner>{children}</MerchantLayoutInner>
    </Suspense>
  );
}
