'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Zap,
  ArrowLeft,
  ShieldCheck,
  Package,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
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
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/products';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalAmount, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Cart is Empty</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            You have not added any tech accessories to your cart yet. Explore our product catalogue.
          </p>
        </div>
        <NextLink href="/">
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            <span>Browse Products</span>
          </Button>
        </NextLink>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <NextLink
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Continue Shopping</span>
        </NextLink>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-destructive h-8"
          onClick={clearCart}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          <span>Clear Cart</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-muted-foreground">
              Review your tech accessories before simulated checkout.
            </p>
          </div>

          <Card className="border-border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%] text-xs font-semibold">Product</TableHead>
                  <TableHead className="text-center text-xs font-semibold">Qty</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Price</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(({ product, quantity }) => (
                  <TableRow key={product.id}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="h-12 w-12 rounded-md object-cover border border-border shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-foreground truncate">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {product.brand}
                          </p>
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-border font-mono">
                            {product.id}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-4">
                      <div className="inline-flex items-center border border-border rounded-lg p-0.5 bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-xs font-bold text-center">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-right py-4 font-bold text-sm text-foreground">
                      {formatINR(product.price * quantity)}
                    </TableCell>

                    <TableCell className="text-right py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-bold">Order Summary</CardTitle>
              <CardDescription className="text-xs">
                Simulated checkout — no payment required.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-foreground font-medium">{formatINR(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground font-medium">Free</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Taxes & Duties</span>
                <span className="text-foreground font-medium">Included</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-foreground">Estimated Total</span>
                <span className="text-xl font-extrabold text-foreground">{formatINR(totalAmount)}</span>
              </div>

              <div className="p-3 bg-muted/60 rounded-lg border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>All orders backed by Volt Nest 10-day replacement + 1-year warranty.</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              <Button
                className="w-full text-xs font-semibold gap-2 h-10 shadow-xs vn-glow-blue"
                onClick={() => router.push('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
