'use client';

import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Mail,
  Store,
  Disc,
  ShoppingBag,
  Home,
  RefreshCw,
  Sparkles,
  ChevronRight,
  User,
  AlertTriangle,
  ChevronDown,
  PanelLeft,
  PanelLeftClose,
  LogOut,
  Search,
  ArrowRight,
} from 'lucide-react';
import { CustomerAuthDialog } from '@/components/CustomerAuthDialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Conversation, Customer, Merchant, Order } from '@/lib/types';
import { getCookie, setCookie } from 'cookies-next';

function getMerchantIcon(merchantId?: string, category?: string) {
  if (merchantId === 'merchant_music' || category === 'digital_music') {
    return Disc;
  }
  return ShoppingBag;
}

export function ModernAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive active conversation ID from URL path
  const activeConversationId = pathname?.startsWith('/chat/')
    ? pathname.split('/chat/')[1]?.split('/')[0]
    : undefined;

  // Sidebar state
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Restore saved collapse state on client mount before paint
  useLayoutEffect(() => {
    try {
      const localVal = localStorage.getItem('sidebar_state');
      if (localVal !== null) {
        setSidebarOpen(localVal === 'true');
      } else {
        const cookieMatch = document.cookie.match(/(?:^|;\s*)sidebar_state=([^;]*)/);
        if (cookieMatch) {
          setSidebarOpen(cookieMatch[1] === 'true');
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setSidebarOpen(open);
    try {
      localStorage.setItem('sidebar_state', String(open));
      document.cookie = `sidebar_state=${open}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.cookie = `tdretail_sidebar_open=${open}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch (e) {
      // ignore
    }
  };

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Ticket Dialog & Search state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [merchantSearchQuery, setMerchantSearchQuery] = useState('');
  const [isPersonaDialogOpen, setIsPersonaDialogOpen] = useState(false);
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Session - Pass any customerEmail/customerId query params from external links
      const urlQuery = typeof window !== 'undefined' ? window.location.search : '';
      const sessRes = await fetch(`/api/session${urlQuery}`);
      if (sessRes.ok) {
        const sData = await sessRes.json();
        setCustomer(sData.customer);
        setIsGuest(Boolean(sData.isGuest));
        setAvailableCustomers(sData.availableCustomers || []);
      }

      // 2. Conversations
      const convRes = await fetch('/api/conversations');
      if (convRes.ok) {
        const cData = await convRes.json();
        setConversations(cData.conversations || []);
      }

      // 3. Merchants
      const merchRes = await fetch('/api/merchants');
      if (merchRes.ok) {
        const mData = await merchRes.json();
        setMerchants(mData.merchants || []);
      }
    } catch (e) {
      console.error('App shell fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [pathname, activeConversationId]);

  // Group conversations by merchant - strictly scoped to user's conversation history
  const groupedConversations = useMemo(() => {
    const merchantMap = new Map<string, { merchant: Merchant | { id: string; name: string; category?: string }; convs: Conversation[] }>();

    // Populate ONLY for merchants with actual conversations
    conversations.forEach((conv) => {
      const mId = conv.merchantId || 'other';
      if (!merchantMap.has(mId)) {
        const found = merchants.find((m) => m.id === mId);
        merchantMap.set(mId, {
          merchant: found || { id: mId, name: conv.merchantName || 'Other Store' },
          convs: [],
        });
      }
      merchantMap.get(mId)!.convs.push(conv);
    });

    // Only return merchant groups that have at least one conversation
    return Array.from(merchantMap.values()).filter((group) => group.convs.length > 0);
  }, [conversations, merchants]);

  // Filtered merchants for the Store Discovery & Search Dialog
  const filteredMerchants = useMemo(() => {
    const query = merchantSearchQuery.trim().toLowerCase();
    const deduped = Array.from(new Map(merchants.map((m) => [m.id, m])).values());
    if (!query) return deduped;
    return deduped.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.category || '').toLowerCase().includes(query) ||
        (m.description || '').toLowerCase().includes(query) ||
        (m.tagline || '').toLowerCase().includes(query)
    );
  }, [merchants, merchantSearchQuery]);

  const switchCustomer = async (customerId: string) => {
    try {
      setIsSwitchingPersona(true);
      document.cookie = `td_customer_id=${customerId}; path=/; max-age=604800`;

      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.customer) {
          setCustomer(data.customer);
        }
        setIsPersonaDialogOpen(false);
        window.location.href = '/inbox';
      }
    } catch (e) {
      console.error('Error switching persona:', e);
    } finally {
      setIsSwitchingPersona(false);
    }
  };


  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/session/logout', { method: 'POST' });
      await fetchData();
      window.location.reload();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={handleOpenChange}
      className={cn("h-screen w-screen overflow-hidden", !mounted && "[&_*]:transition-none!")}
    >
      <Sidebar collapsible="icon" className="border-r border-border">
        {/* Sidebar Header: Brand / Toggle + New Inquiry + Nav Links */}
        <SidebarHeader className="border-b border-border/80 gap-1 pb-2">
          <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              TD Support
            </span>
            <button
              type="button"
              onClick={() => handleOpenChange(!sidebarOpen)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="New Inquiry"
                onClick={() => setIsNewTicketOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">New Inquiry</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/'}
                tooltip="Home & Demos"
                className="group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto"
                render={
                  <NextLink href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                    <Home className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Home & Demos</span>
                  </NextLink>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === '/inbox'}
                tooltip="All Conversations"
                className="group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto"
                render={
                  <NextLink href="/inbox" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center w-full">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">All Conversations</span>
                  </NextLink>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Sidebar Content: Chats Grouped By Merchant */}
        <SidebarContent className="py-2">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-1 text-primary" />
              <span className="group-data-[collapsible=icon]:hidden">Loading chats...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              <p>No conversations yet.</p>
              <p className="mt-1 text-[11px]">Click "New Inquiry" to ask Gemini.</p>
            </div>
          ) : (
            groupedConversations.map((group) => {
              const MerchantIcon = getMerchantIcon(group.merchant.id, (group.merchant as Merchant).category);
              const hasActiveChat = group.convs.some((c) => c.id === activeConversationId);

              return (
                <Collapsible
                  key={group.merchant.id}
                  defaultOpen={true}
                  className="group/collapsible"
                >
                  <SidebarGroup className="p-1 group-data-[collapsible=icon]:p-0">
                    <SidebarGroupLabel
                      className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto"
                      render={
                        <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground py-1 px-2 rounded-md hover:bg-sidebar-accent/50 transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8">
                          <span className="flex items-center gap-2 truncate group-data-[collapsible=icon]:justify-center">
                            <MerchantIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="truncate group-data-[collapsible=icon]:hidden">
                              {group.merchant.name}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                            <span className="text-[10px] font-normal text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded-full">
                              {group.convs.length}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-open/collapsible:rotate-180" />
                          </span>
                        </CollapsibleTrigger>
                      }
                    />

                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {group.convs.length === 0 ? (
                            <div className="px-3 py-1.5 text-[11px] text-muted-foreground italic group-data-[collapsible=icon]:hidden">
                              No chats
                            </div>
                          ) : (
                            group.convs.map((conv) => {
                              const isActive = activeConversationId === conv.id;
                              const ItemIcon = getMerchantIcon(conv.merchantId);

                              return (
                                <SidebarMenuItem key={conv.id}>
                                  <SidebarMenuButton
                                    isActive={isActive}
                                    tooltip={conv.subject}
                                    className="h-8 text-xs font-normal group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto"
                                    render={
                                      <NextLink
                                        href={`/chat/${conv.id}`}
                                        className="flex items-center gap-2 w-full min-w-0 group-data-[collapsible=icon]:justify-center"
                                      >
                                        <ItemIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-data-active/menu-button:text-primary" />
                                        <span className="truncate text-xs group-data-[collapsible=icon]:hidden">{conv.subject}</span>
                                      </NextLink>
                                    }
                                  />
                                </SidebarMenuItem>
                              );
                            })
                          )}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              );
            })
          )}
        </SidebarContent>

        {/* Sidebar Footer: Active Shopper Persona / Guest State */}
        <SidebarFooter className="p-2 border-t border-border/80 group-data-[collapsible=icon]:p-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-1 w-full">
                <SidebarMenuButton
                  size="lg"
                  tooltip={
                    isGuest
                      ? 'Browsing as Guest · Click to sign in'
                      : customer
                      ? `${customer.name} (${customer.email}) · Switch account`
                      : 'Shopper Persona'
                  }
                  onClick={() => setIsPersonaDialogOpen(true)}
                  className="flex-1 h-11 p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto"
                >
                  <Avatar className="h-7 w-7 border border-border shrink-0">
                    <AvatarImage src={customer?.avatarUrl} />
                    <AvatarFallback className="text-xs bg-muted text-foreground font-semibold">
                      {isGuest ? 'G' : customer?.name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {isGuest ? (customer?.name || 'Guest Shopper') : (customer?.name || 'Customer')}
                      </span>
                      <Badge
                        variant={isGuest ? 'default' : 'outline'}
                        className={`text-[9px] h-3.5 px-1 font-normal ${
                          isGuest ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {isGuest ? 'Sign In' : 'Switch'}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {isGuest ? 'Browsing as Guest' : customer?.email}
                    </span>
                  </div>
                </SidebarMenuButton>

                {!isGuest && (
                  <button
                    type="button"
                    title="Sign out to Guest mode"
                    onClick={handleSignOut}
                    className="p-2 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground cursor-pointer shrink-0 group-data-[collapsible=icon]:hidden transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main App Content View Area */}
      <SidebarInset className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Compact sticky top-bar with sidebar toggle (visible when sidebar is collapsed on desktop or mobile) */}
        {!sidebarOpen && (
          <div className="flex items-center h-10 px-3 border-b border-border/60 shrink-0 bg-card/40 gap-2" data-sidebar-inset-header>
            <button
              type="button"
              onClick={() => handleOpenChange(true)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground truncate">
              TD Retail Support Platform
            </span>
          </div>
        )}
        {children}
      </SidebarInset>

      {/* New Support Inquiry - Merchant Search & Select Modal Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Select Store to Chat With</span>
            </DialogTitle>
            <DialogDescription>
              Choose any participating merchant to start a new chat. Gemini AI grounds answers in the store's verified orders and policies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search stores by name, category, or keywords..."
                value={merchantSearchQuery}
                onChange={(e) => setMerchantSearchQuery(e.target.value)}
                className="pl-9 pr-14 text-xs h-9"
                autoFocus
              />
              {merchantSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMerchantSearchQuery('')}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Merchant Cards List */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredMerchants.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                  No stores match "{merchantSearchQuery}"
                </div>
              ) : (
                filteredMerchants.map((m) => {
                  const ItemIcon = getMerchantIcon(m.id, m.category);

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setIsNewTicketOpen(false);
                        setMerchantSearchQuery('');
                        router.push(`/chat/new?merchantId=${m.id}`);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/50 transition-all flex items-start gap-3 group cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                            {m.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 capitalize">
                            {(m.category || '').replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {m.tagline || m.description || m.supportPolicy?.returns || 'Official Store Support'}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified Customer Authentication & Persona Dialog */}
      <CustomerAuthDialog
        open={isPersonaDialogOpen}
        onOpenChange={setIsPersonaDialogOpen}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </SidebarProvider>
  );
}
