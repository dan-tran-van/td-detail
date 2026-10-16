'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Receipt,
  Disc,
  ArrowRight,
  MessageSquare,
  Key,
  DownloadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useOrders } from '@/context/OrderContext';
import { formatINR } from '@/lib/products';
import { SupportChatWidget } from '@/components/SupportChatWidget';

export default function OrdersPage() {
  const { orders } = useOrders();
  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<string | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleOpenSupport = (orderId: string) => {
    setSelectedOrderForSupport(orderId);
    setIsSupportOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[11px] font-semibold">
              Customer Vault
            </Badge>
            <span className="text-xs text-muted-foreground">• {orders.length} Registered Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Orders & Digital Licenses
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Access lossless audio stems, permanent cryptographic license keys, and trigger instant AI support.
          </p>
        </div>

        <NextLink href="/">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 border-border">
            <Disc className="h-4 w-4" />
            <span>Store Catalogue</span>
          </Button>
        </NextLink>
      </div>

      {orders.length === 0 ? (
        <Card className="border-border bg-card shadow-xs p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Receipt className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">No Orders Found</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven't placed any orders yet. Visit our catalogue to download bit-perfect digital master stems.
            </p>
          </div>
          <NextLink href="/">
            <Button size="sm">Browse Releases</Button>
          </NextLink>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isDelivered = order.orderStatus === 'delivered';

            return (
              <Card key={order.orderId} className="border-border bg-card shadow-xs overflow-hidden">
                <CardHeader className="p-5 pb-3 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {order.orderId}
                      </span>
                      <Badge
                        variant={isDelivered ? 'default' : 'secondary'}
                        className="text-[10px] font-semibold"
                      >
                        {isDelivered ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        <span>{order.orderStatusDisplay}</span>
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Purchased on {new Date(order.createdAt).toLocaleDateString()} • Registered to {order.customerEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 border-border bg-background"
                      onClick={() => handleOpenSupport(order.orderId)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      <span>Get Support Now</span>
                    </Button>

                    <NextLink href={`/orders/${order.orderId}`}>
                      <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </NextLink>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  {/* Order Items */}
                  <div className="divide-y divide-border">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-foreground">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground font-normal">
                              ({item.quantity}x)
                            </span>
                          </div>
                          {item.artistOrBrand && (
                            <p className="text-[11px] text-muted-foreground">{item.artistOrBrand}</p>
                          )}
                          {item.formatOrWeight && (
                            <Badge variant="outline" className="text-[9px] font-mono border-border">
                              {item.formatOrWeight}
                            </Badge>
                          )}
                        </div>

                        {/* License key and download link pill */}
                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          {item.licenseKey && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-[11px] font-mono border border-border">
                              <Key className="h-3 w-3 text-primary" />
                              <span className="text-muted-foreground">Key:</span>
                              <span className="font-bold text-foreground">{item.licenseKey}</span>
                            </div>
                          )}

                          {item.downloadUrl && (
                            <a
                              href={item.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors"
                            >
                              <DownloadCloud className="h-3.5 w-3.5" />
                              <span>Download Vault</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Summary & Carrier Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>{order.carrierOrCourier} • Tracking: <span className="font-mono">{order.trackingNumber}</span></span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span>Total Paid:</span>
                      <span className="font-bold text-sm text-foreground">{formatINR(order.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Embedded Support Chat Widget Drawer */}
      <SupportChatWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialOrderId={selectedOrderForSupport || undefined}
      />
    </div>
  );
}
