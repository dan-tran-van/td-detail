'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Zap,
  ShoppingBag,
  ShieldCheck,
  ArrowLeft,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { getProductById, formatINR } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AVAILABILITY_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  in_stock: { label: 'In Stock', variant: 'default' },
  low_stock: { label: 'Low Stock', variant: 'secondary' },
  out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
};

function ProductDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { addItem } = useCart();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested tech accessory ({id}) does not exist in our seeded catalogue.
        </p>
        <NextLink href="/">
          <Button variant="default">Back to Catalogue</Button>
        </NextLink>
      </div>
    );
  }

  const avail = AVAILABILITY_LABELS[product.availabilityStatus];
  const isOutOfStock = product.availabilityStatus === 'out_of_stock';

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${product.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <NextLink href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </Button>
        </NextLink>
        <span className="text-muted-foreground text-xs">•</span>
        <span className="text-xs text-muted-foreground font-mono">{product.id}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted border border-border shadow-md">
            <img
              src={product.coverImage}
              alt={product.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4">
              <Badge variant={avail.variant} className="text-xs font-bold shadow-md">
                {avail.label}
              </Badge>
            </div>
            {product.badge && (
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="text-xs font-bold border-primary text-primary bg-background/80 backdrop-blur shadow-md">
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg border border-border bg-card/60 flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>{product.warranty}</span>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/40">
                {product.brand}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">{product.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {product.title}
            </h1>

            <div className="text-2xl font-black text-foreground">
              {formatINR(product.price)}
              <span className="text-xs font-normal text-muted-foreground ml-2">All inclusive of taxes</span>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Specifications</h3>
              <div className="p-3 rounded-md bg-muted/60 border border-border font-mono text-xs text-foreground">
                {product.specs}
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border bg-card flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block">Free Express Delivery</span>
                  <span className="text-muted-foreground text-[11px]">3–5 business days dispatch</span>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card flex items-start gap-2.5">
                <RotateCcw className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block">10-Day Replacement</span>
                  <span className="text-muted-foreground text-[11px]">Direct courier pickup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-sm font-semibold gap-2 border-border"
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && addItem(product, 1)}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>

              <Button
                size="lg"
                className="h-12 text-sm font-semibold gap-2 shadow-xs vn-glow-blue"
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && handleBuyNow()}
              >
                <Zap className="h-4 w-4" />
                <span>Buy Now</span>
              </Button>
            </div>

            {isOutOfStock && (
              <p className="text-xs text-destructive text-center font-medium">
                This item is currently out of stock and cannot be ordered.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-muted-foreground">Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
