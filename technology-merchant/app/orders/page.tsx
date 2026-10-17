'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Receipt,
  Zap,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/context/OrderContext';
import { formatINR } from '@/lib/products';
import { SupportChatWidget } from '@/components/SupportChatWidget';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  delivered: <CheckCircle2 className="h-3 w-3 mr-1" />,
  shipped: <Truck className="h-3 w-3 mr-1" />,
  processing: <Clock className="h-3 w-3 mr-1" />,
  confirmed: <Package className="h-3 w-3 mr-1" />,
};

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
              Order History
            </Badge>
            <span className="text-xs text-muted-foreground">• {orders.length} Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Orders & Warranty Tracker
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track shipments, activate warranty claims, and get instant AI support for all Volt Nest purchases.
          </p>
        </div>

        <NextLink href="/">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 border-border">
            <Zap className="h-4 w-4" />
            <span>Shop More</span>
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
              You haven&apos;t placed any orders yet. Browse the Volt Nest catalogue to find your next tech upgrade.
            </p>
          </div>
          <NextLink href="/">
            <Button size="sm">Browse Products</Button>
          </NextLink>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusIcon = STATUS_ICONS[order.orderStatus] ?? <Package className="h-3 w-3 mr-1" />;
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
                        {statusIcon}
                        <span>{order.orderStatusDisplay}</span>
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()} • {order.customerEmail}
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
                      <div
                        key={item.id}
                        className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
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

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      <span>{order.carrierOrCourier} • <span className="font-mono">{order.trackingNumber}</span></span>
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

      {/* Embedded Support Chat */}
      <SupportChatWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialOrderId={selectedOrderForSupport || undefined}
      />
    </div>
  );
}
