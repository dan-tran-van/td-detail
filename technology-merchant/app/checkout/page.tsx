'use client';

import React, { useState, useEffect, Suspense } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Zap,
  ArrowLeft,
  AlertTriangle,
  Package,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useVisitor } from '@/context/VisitorContext';
import { getProductById, formatINR } from '@/lib/products';
import { Product } from '@/lib/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const singleProductId = searchParams.get('productId');

  const { items: cartItems, clearCart, totalAmount: cartTotal } = useCart();
  const { saveOrder } = useOrders();
  const { visitor, updateVisitor, isLoaded: isVisitorLoaded } = useVisitor();

  const [directProduct, setDirectProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (singleProductId) {
      const p = getProductById(singleProductId);
      if (p) {
        setDirectProduct(p);
      }
    }
  }, [singleProductId]);

  const itemsToBuy = directProduct
    ? [{ product: directProduct, quantity: 1 }]
    : cartItems;

  const orderTotal = directProduct ? directProduct.price : cartTotal;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isVisitorLoaded && visitor) {
      setName(visitor.name);
      setEmail(visitor.email);
    }
  }, [isVisitorLoaded, visitor]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please enter your name and email address.');
      return;
    }

    if (itemsToBuy.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    updateVisitor({ name: name.trim(), email: email.trim() });

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToBuy,
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
          isDirectBuy: !!directProduct,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'Failed to complete order');
      }

      if ((data as { order?: ReturnType<typeof saveOrder> }).order) {
        saveOrder((data as { order: Parameters<typeof saveOrder>[0] }).order);
      }

      if (!directProduct) {
        clearCart();
      }

      router.push(`/orders/${(data as { order: { orderId: string } }).order.orderId}/confirmation`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong during checkout.';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  if (itemsToBuy.length === 0 && !directProduct) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">No Items to Checkout</h1>
        <p className="text-xs text-muted-foreground">Please select a product before proceeding to checkout.</p>
        <NextLink href="/">
          <Button size="sm">Browse Products</Button>
        </NextLink>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <NextLink
          href={directProduct ? '/' : '/cart'}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{directProduct ? 'Back to Products' : 'Back to Cart'}</span>
        </NextLink>

        <Badge variant="outline" className="text-xs border-border gap-1.5 py-1 px-3">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <span>Simulated Checkout</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Checkout Form */}
        <div className="md:col-span-3 space-y-4">
          <form onSubmit={handleSubmitOrder}>
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-bold">Customer Details</CardTitle>
                <CardDescription className="text-xs">
                  Your order will be registered and synced with the TD Retail AI support platform.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-semibold">Error</AlertTitle>
                    <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Demo persona prefilled
                    </span>
                  </label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="h-9 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Matches the TD Retail demo persona for consolidated multi-merchant support.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="p-3 bg-muted/60 rounded-lg border border-border text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span>No Payment Gateway Required</span>
                  </div>
                  <p className="text-[11px]">
                    This is a hackathon demo storefront. Clicking confirm places the order immediately and registers
                    it with the TD Retail AI support engine for warranty and tracking.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-xs font-semibold h-10 gap-2 shadow-xs vn-glow-blue"
                >
                  {isSubmitting ? (
                    <span>Processing & Syncing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Order Preview */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold">Order Items ({itemsToBuy.length})</CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="space-y-3">
                {itemsToBuy.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{product.title}</p>
                      <p className="text-[10px] text-muted-foreground">{product.brand} • Qty {quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formatINR(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-semibold text-muted-foreground">Total (INR)</span>
                <span className="text-lg font-black text-foreground">{formatINR(orderTotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-primary" />
                <span>1-year warranty on all electronics</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-muted-foreground">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
