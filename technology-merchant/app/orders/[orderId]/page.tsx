'use client';

import React, { useState, Suspense } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Sparkles,
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
import { useOrders } from '@/context/OrderContext';
import { formatINR } from '@/lib/products';
import { SupportChatWidget } from '@/components/SupportChatWidget';

function OrderDetailsContent() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);

  const [isSupportOpen, setIsSupportOpen] = useState(false);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order Not Found</h1>
        <p className="text-xs text-muted-foreground">Order #{orderId} was not found in your session.</p>
        <NextLink href="/orders">
          <Button size="sm">View All Orders</Button>
        </NextLink>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'delivered';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <NextLink href="/orders" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Orders</span>
        </NextLink>

        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 border-border bg-card"
          onClick={() => setIsSupportOpen(true)}
        >
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
          <span>Get Support for this Order</span>
        </Button>
      </div>

      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-foreground">{order.orderId}</span>
              <Badge variant={isDelivered ? 'default' : 'secondary'} className="text-[11px] font-semibold">
                {isDelivered ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : <Clock className="h-3.5 w-3.5 mr-1" />}
                {order.orderStatusDisplay}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <CardDescription className="text-xs">
            Registered to <strong className="text-foreground">{order.customerName}</strong> ({order.customerEmail})
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Purchased Items */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Purchased Tech Accessories
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm text-foreground">{item.title}</p>
                      {item.artistOrBrand && <p className="text-xs text-muted-foreground">{item.artistOrBrand}</p>}
                      {item.formatOrWeight && (
                        <Badge variant="outline" className="text-[10px] font-mono mt-1 border-border">
                          {item.formatOrWeight}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery & Warranty info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground block mb-0.5">Carrier / Courier</span>
              <span className="text-foreground">{order.carrierOrCourier}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground block mb-0.5">Tracking Number</span>
              <span className="font-mono text-foreground">{order.trackingNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground block mb-0.5">Estimated Delivery</span>
              <span className="text-foreground">{order.estimatedDelivery}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground block mb-0.5">Total Paid (INR)</span>
              <span className="text-sm font-extrabold text-foreground">{formatINR(order.totalAmount)}</span>
            </div>
          </div>

          {order.courierNotes && (
            <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">Warranty & Support Terms</span>
              <span>{order.courierNotes}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Synchronized with TD Retail Central Resolution Platform</span>
          </div>

          <Button
            size="sm"
            className="w-full sm:w-auto text-xs gap-1.5 shadow-xs vn-glow-blue"
            onClick={() => setIsSupportOpen(true)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask Gemini About This Order</span>
          </Button>
        </CardFooter>
      </Card>

      <SupportChatWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialOrderId={order.orderId}
      />
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-muted-foreground">Loading order details...</div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}
