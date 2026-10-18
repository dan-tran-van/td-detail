'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  AlertTriangle,
  Package,
  Mail,
  Store,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Disc,
  Zap,
  Sliders,
} from 'lucide-react';
import { resolveMerchantStorefrontUrl } from '@/lib/storefrontConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Conversation, Order, OutboxEmail, MerchantSessionData } from '@/lib/types';

export default function MerchantOverviewPage() {
  const [session, setSession] = useState<MerchantSessionData | null>(null);
  const [escalations, setEscalations] = useState<Conversation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [outboxEmails, setOutboxEmails] = useState<OutboxEmail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [sessRes, escRes, ordRes, outRes] = await Promise.all([
        fetch('/api/merchant/session'),
        fetch('/api/merchant/escalations'),
        fetch('/api/merchant/orders'),
        fetch('/api/merchant/outbox'),
      ]);

      if (sessRes.ok) {
        const sData = await sessRes.json();
        setSession(sData);
      }

      if (escRes.ok) {
        const eData = await escRes.json();
        setEscalations(eData.escalations || []);
      }

      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData.orders || []);
      }

      if (outRes.ok) {
        const outData = await outRes.json();
        setOutboxEmails(outData.emails || []);
      }
    } catch (err) {
      console.error('Error loading merchant dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingFulfillmentCount = orders.filter(
    (o) => o.orderStatus === 'processing' || o.orderStatus === 'out_for_delivery'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {session?.merchant?.name || 'Storefront Dashboard'}
            </h1>
            <Badge variant="outline" className="text-[10px] font-semibold uppercase">
              {session?.merchant?.category?.replace('_', ' ') || 'Merchant'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-merchant operations center. Monitored by Gemini 2.5 Flash with ground-truth support policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-8 text-xs gap-1.5 rounded-lg"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {(() => {
            const storefrontLink = resolveMerchantStorefrontUrl(session?.merchant);
            if (!storefrontLink || storefrontLink === '#') return null;
            return (
              <a
                href={storefrontLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button size="sm" className="h-8 text-xs gap-1.5 rounded-lg bg-primary text-primary-foreground">
                  <span>View Storefront</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            );
          })()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Escalated Requests */}
        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Escalations
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {escalations.length}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              {escalations.length > 0 ? (
                <span className="text-amber-500 font-medium">Requires human specialist response</span>
              ) : (
                <span className="text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> All inquiries handled by AI
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Orders to Fulfill */}
        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Orders Requiring Fulfillment
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {pendingFulfillmentCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {orders.length} total orders registered in platform store
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Gemini Outbox Emails */}
        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gemini Outbox Dispatched
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Mail className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {outboxEmails.length}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Direct email notifications to customers with Reply-To routing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Pending Escalations & Orders Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalated Support Tickets */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-border">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Escalated Inquiries</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Inquiries where Gemini triggered human escalation
              </CardDescription>
            </div>
            <NextLink href="/merchant/escalations">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </NextLink>
          </CardHeader>

          <CardContent className="p-3 divide-y divide-border">
            {escalations.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto opacity-80" />
                <p>No active escalations. Gemini is successfully resolving queries automatically.</p>
              </div>
            ) : (
              escalations.slice(0, 3).map((conv) => (
                <div key={conv.id} className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {conv.subject}
                      </span>
                      <Badge variant="destructive" className="text-[9px] py-0 px-1.5 uppercase">
                        Escalated
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Customer: {conv.customerName} ({conv.customerEmail})
                    </p>
                    {conv.escalationReason && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded px-2 py-0.5 line-clamp-1">
                        Reason: {conv.escalationReason}
                      </p>
                    )}
                  </div>
                  <NextLink href={`/merchant/escalations?id=${conv.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 cursor-pointer">
                      Reply
                    </Button>
                  </NextLink>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Storefront Orders Overview */}
        <Card className="border-border bg-card">
          <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b border-border">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Recent Customer Orders</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Verified orders synchronized with TD Retail
              </CardDescription>
            </div>
            <NextLink href="/merchant/orders">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                <span>Manage Orders</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </NextLink>
          </CardHeader>

          <CardContent className="p-3 divide-y divide-border">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <Package className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                <p>No orders recorded for this merchant yet.</p>
              </div>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-foreground">
                        {order.orderId}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 px-1.5 capitalize ${
                          order.orderStatus === 'delivered'
                            ? 'text-emerald-500 border-emerald-500/30'
                            : order.orderStatus === 'out_for_delivery'
                            ? 'text-indigo-500 border-indigo-500/30'
                            : 'text-amber-500 border-amber-500/30'
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {order.customerName} • {order.items.length} item(s) • ${order.totalAmount.toFixed(2)}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-[10px] text-muted-foreground font-mono">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <NextLink href={`/merchant/orders?orderId=${order.orderId}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 cursor-pointer">
                      Update
                    </Button>
                  </NextLink>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active AI Policy Grounding Card */}
      {session?.merchant?.supportPolicy && (
        <Card className="border-border bg-card/60">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Active Gemini Grounding Rules ({session.merchant.name})</span>
            </CardTitle>
            <NextLink href="/merchant/settings">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                <Sliders className="h-3 w-3" />
                <span>Edit Policies</span>
              </Button>
            </NextLink>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="font-semibold text-foreground block mb-1">Return Window</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {session.merchant.supportPolicy.returns}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="font-semibold text-foreground block mb-1">Refund Terms</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {session.merchant.supportPolicy.refunds}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="font-semibold text-foreground block mb-1">Fulfillment Mode</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {session.merchant.supportPolicy.deliveryOrDownload}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="font-semibold text-foreground block mb-1">Escalation Trigger</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {session.merchant.supportPolicy.escalationThreshold}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
