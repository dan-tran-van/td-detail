'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Inbox,
  Disc,
  ShoppingBag,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomerAuthDialog } from '@/components/CustomerAuthDialog';
import { Conversation, Merchant, Order, Customer } from '@/lib/types';

export default function ConsolidatedInboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMerchantFilter, setSelectedMerchantFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store Discovery & Search Dialog state
  const [isStoreSearchOpen, setIsStoreSearchOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);

      const sessRes = await fetch('/api/session');
      if (sessRes.ok) {
        const sData = await sessRes.json();
        setCustomer(sData.customer);
        setIsGuest(Boolean(sData.isGuest));
      }

      const convRes = await fetch('/api/conversations');
      if (convRes.ok) {
        const cData = await convRes.json();
        setConversations(cData.conversations || []);
      }

      const merchRes = await fetch('/api/merchants');
      if (merchRes.ok) {
        const mData = await merchRes.json();
        setMerchants(mData.merchants || []);
      }
    } catch (err) {
      console.error('Error fetching inbox conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Derive userMerchants: only merchants for which the user actually has conversations
  const userMerchants = React.useMemo(() => {
    const merchantIdsWithConversations = new Set(conversations.map((c) => c.merchantId));
    const list: { id: string; name: string; category?: string }[] = [];

    merchantIdsWithConversations.forEach((mId) => {
      const found = merchants.find((m) => m.id === mId);
      if (found) {
        list.push(found);
      } else {
        const sampleConv = conversations.find((c) => c.merchantId === mId);
        list.push({
          id: mId,
          name: sampleConv?.merchantName || 'Other Store',
        });
      }
    });

    return list;
  }, [conversations, merchants]);

  // Auto-reset merchant filter if selected merchant has no conversations
  useEffect(() => {
    if (selectedMerchantFilter !== 'all' && !userMerchants.some((m) => m.id === selectedMerchantFilter)) {
      setSelectedMerchantFilter('all');
    }
  }, [userMerchants, selectedMerchantFilter]);

  // Filtered merchants for the Store Discovery & Search Dialog
  const filteredSearchMerchants = React.useMemo(() => {
    const q = storeSearchQuery.trim().toLowerCase();
    const deduped = Array.from(new Map(merchants.map((m) => [m.id, m])).values());
    if (!q) return deduped;
    return deduped.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.category || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.tagline || '').toLowerCase().includes(q)
    );
  }, [merchants, storeSearchQuery]);

  const filteredConversations = conversations.filter((conv) => {
    if (selectedMerchantFilter !== 'all' && conv.merchantId !== selectedMerchantFilter) {
      return false;
    }
    if (selectedStatusFilter !== 'all' && conv.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = conv.subject.toLowerCase().includes(q);
      const matchMerchant = (conv.merchantName || '').toLowerCase().includes(q);
      const matchCustomer = (conv.customerName || '').toLowerCase().includes(q) || (conv.customerEmail || '').toLowerCase().includes(q);
      const matchOrder = (conv.orderId || '').toLowerCase().includes(q);
      const matchSnippet = (conv.lastMessageSnippet || '').toLowerCase().includes(q);
      const matchId = (conv.id || '').toLowerCase().includes(q);
      return matchSubject || matchMerchant || matchCustomer || matchOrder || matchSnippet || matchId;
    }
    return true;
  });

  const activeCount = conversations.filter((c) => c.status === 'active').length;
  const escalatedCount = conversations.filter((c) => c.status === 'escalated').length;
  const resolvedCount = conversations.filter((c) => c.status === 'resolved').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Support Inbox
                </h1>
                <Badge variant="outline" className="text-xs">
                  {conversations.length} Threads
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                All merchant conversations in one unified inbox with Gemini AI resolution and order grounding.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="gap-2 text-xs h-8 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setIsStoreSearchOpen(true)}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </Button>
            </div>
          </div>

          {/* Guest Mode Info Banner */}
          {isGuest && (
            <div className="p-4 rounded-xl border border-border bg-card/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">Guest Support Inbox</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 h-4">
                      Guest Session
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Browsing as {customer?.name || 'Guest'}. Log in to view your complete multi-merchant purchase and support history.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAuthDialog(true)}
                className="text-xs h-8 gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <span>Log In / Switch Account</span>
              </Button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-card border-border shadow-xs">
              <CardContent className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Active AI
                  </p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{activeCount}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-xs">
              <CardContent className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Escalated
                  </p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{escalatedCount}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-xs">
              <CardContent className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Resolved
                  </p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{resolvedCount}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between p-2 rounded-xl bg-card border border-border">
            {/* Merchant Filter Pills - only display if the customer has conversations with 2 or more stores */}
            {userMerchants.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <Button
                  variant={selectedMerchantFilter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedMerchantFilter('all')}
                  className="text-xs h-7 px-2.5 rounded-lg shrink-0 cursor-pointer"
                >
                  All
                </Button>

                {userMerchants.map((m) => {
                  const isSelected = selectedMerchantFilter === m.id;
                  const isMusic = m.id === 'merchant_music' || m.category === 'digital_music';

                  return (
                    <Button
                      key={m.id}
                      variant={isSelected ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedMerchantFilter(m.id)}
                      className="text-xs h-7 px-2.5 rounded-lg gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isMusic ? (
                        <Disc className="h-3 w-3" />
                      ) : (
                        <ShoppingBag className="h-3 w-3" />
                      )}
                      <span>{m.name}</span>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Status and Search */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="h-7 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none shrink-0"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>

              <div className="relative flex-1 sm:w-56">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 pl-8 pr-7 text-xs rounded-lg w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
                    title="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Conversation List Cards */}
          <div className="flex flex-col gap-3 pb-8">
            {loading ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground border-dashed bg-card/50">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <h3 className="text-base font-semibold text-foreground">No conversations yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  You haven't started any support inquiries yet. Select a store from the sidebar or start a new chat with Gemini AI.
                </p>
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() => setIsStoreSearchOpen(true)}
                    className="text-xs h-8 gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Start New Chat</span>
                  </Button>
                </div>
              </Card>
            ) : filteredConversations.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground border-dashed">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground">No conversations match your filter</p>
                <p className="text-xs mt-1">Try clearing your search query or resetting filters.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMerchantFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="mt-3 text-xs h-7 cursor-pointer"
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              filteredConversations.map((conv) => {
                const isMusic = conv.merchantId === 'merchant_music';

                return (
                  <NextLink key={conv.id} href={`/chat/${conv.id}`} className="block focus:outline-none">
                    <Card className="group hover:border-primary/50 transition-all cursor-pointer border-border bg-card shadow-xs">
                      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className="p-2.5 rounded-xl bg-muted text-foreground shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {isMusic ? (
                              <Disc className="h-4 w-4" />
                            ) : (
                              <ShoppingBag className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-xs text-foreground">
                                {conv.merchantName}
                              </span>

                              {conv.orderId && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-mono">
                                  Order #{conv.orderId}
                                </Badge>
                              )}

                              {conv.status === 'active' && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-1 animate-pulse" />
                                  Active AI
                                </Badge>
                              )}

                              {conv.status === 'escalated' && (
                                <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                                  <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                                  Escalated
                                </Badge>
                              )}

                              {conv.status === 'resolved' && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                                  <CheckCircle2 className="h-2.5 w-2.5 mr-1 text-primary" />
                                  Resolved
                                </Badge>
                              )}
                            </div>

                            <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {conv.subject}
                            </h4>

                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              <span className="font-medium text-foreground/80">
                                {conv.lastMessageSender === 'ai'
                                  ? 'Gemini: '
                                  : conv.lastMessageSender === 'human_agent'
                                  ? 'Human Specialist: '
                                  : 'You: '}
                              </span>
                              {conv.lastMessageSnippet}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto shrink-0 gap-1.5 text-muted-foreground pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                            <span>Open Thread</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </NextLink>
                );
              })
            )}
          </div>
        </div>

      <CustomerAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Store Discovery & Search Dialog */}
      <Dialog open={isStoreSearchOpen} onOpenChange={setIsStoreSearchOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Select Store for Support</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Choose a merchant to start a new Gemini-grounded customer support inquiry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-1">
            {/* Real-time search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores by name, category, or products..."
                value={storeSearchQuery}
                onChange={(e) => setStoreSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-9 text-xs"
                autoFocus
              />
              {storeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setStoreSearchQuery('')}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Merchant Cards List */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredSearchMerchants.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                  No stores match "{storeSearchQuery}"
                </div>
              ) : (
                filteredSearchMerchants.map((m) => {
                  const isMusic = m.id === 'merchant_music' || m.category === 'digital_music';
                  const ItemIcon = isMusic ? Disc : ShoppingBag;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setIsStoreSearchOpen(false);
                        setStoreSearchQuery('');
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
    </div>
  );
}
