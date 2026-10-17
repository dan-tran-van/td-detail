'use client';

import React, { useState, Suspense } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  MessageSquare,
  ArrowRight,
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

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);

  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success banner */}
      <div className="p-6 rounded-xl border border-primary/40 bg-primary/5 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-md vn-glow-blue">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <Badge variant="outline" className="border-primary/50 text-primary">
            Order Confirmed • Merchant B
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Order <span className="font-mono font-bold text-foreground">#{orderId}</span> has been confirmed and synchronized with the TD Retail support platform.
          </p>
        </div>
      </div>

      {order ? (
        <Card className="border-border bg-card shadow-xs overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-border bg-muted/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-foreground">{order.orderId}</span>
              <Badge variant="default" className="text-xs font-semibold">
                {order.orderStatusDisplay}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmation sent to <strong className="text-foreground">{order.customerEmail}</strong>
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Items In This Order
              </h3>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">Qty: {item.quantity} • {item.artistOrBrand}</p>
                    </div>
                    <span className="font-bold text-sm text-foreground">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-muted-foreground">Total Paid (INR)</span>
              <span className="text-xl font-black text-foreground">{formatINR(order.totalAmount)}</span>
            </div>

            {/* Courier & Tracking */}
            <div className="p-4 rounded-lg border border-border bg-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground block">Courier</span>
                <span className="text-foreground">{order.carrierOrCourier}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block">Tracking ID</span>
                <span className="font-mono text-foreground">{order.trackingNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block">Estimated Delivery</span>
                <span className="text-foreground">{order.estimatedDelivery}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground block">Warranty</span>
                <span className="text-foreground">1-Year Auto-Registered</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs gap-1.5 border-border"
              onClick={() => setIsSupportOpen(true)}
            >
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>Get Support Now</span>
            </Button>

            <NextLink href={`/orders/${order.orderId}`}>
              <Button size="sm" className="w-full sm:w-auto text-xs gap-1.5 shadow-xs vn-glow-blue">
                <span>View Full Order Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </NextLink>
          </CardFooter>
        </Card>
      ) : (
        <div className="p-6 rounded-lg border border-border text-center space-y-3">
          <p className="text-xs text-muted-foreground">Order details are synchronized in your active session.</p>
          <NextLink href="/orders">
            <Button size="sm">Go to Orders</Button>
          </NextLink>
        </div>
      )}

      {/* Embedded Support Chat */}
      <SupportChatWidget
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        initialOrderId={orderId}
      />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-muted-foreground">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
