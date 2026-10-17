'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Package,
  ArrowRight,
  Receipt,
  Cpu,
  Wifi,
  BatteryCharging,
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
import { SEEDED_PRODUCTS, formatINR } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import SplitText from '@/components/SplitText';
import ShinyText from '@/components/ShinyText';
import Antigravity from '@/components/Antigravity';

const AVAILABILITY_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  in_stock: { label: 'In Stock', variant: 'default' },
  low_stock: { label: 'Low Stock', variant: 'secondary' },
  out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
};

export default function StorefrontHomePage() {
  const router = useRouter();
  const { addItem } = useCart();

  const handleBuyNow = (productId: string) => {
    router.push(`/checkout?productId=${productId}`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section — Dark charcoal + electric blue particle field */}
      <section className="relative overflow-hidden border-b border-border bg-background py-16 sm:py-24">
        {/* Background layers */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Geometric circuit-board grid */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(100, 180, 255, 0.15) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(100, 180, 255, 0.15) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 75% 65% at 50% 30%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 30%, black 40%, transparent 100%)',
            }}
          />

          {/* Electric blue / neon lime glow orbs */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[420px] bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-blue-700/25 blur-3xl rounded-full opacity-90" />
          <div className="absolute top-16 left-1/4 w-[300px] h-[200px] bg-lime-400/15 blur-3xl rounded-full" />
          <div className="absolute top-8 right-1/4 w-[350px] h-[220px] bg-blue-500/20 blur-3xl rounded-full" />

          {/* Antigravity particle field — electric blue + neon lime */}
          <div className="absolute inset-0 opacity-85">
            <Antigravity
              colors={['#3B82F6', '#06B6D4', '#84CC16', '#60A5FA']}
              count={1200}
              magnetRadius={10}
              ringRadius={6}
              particleSize={0.85}
              autoAnimate
              colorMode="conic"
              colorSpeed={0.04}
              particleShape="capsule"
              particleVariance={1}
              fieldStrength={12}
              waveAmplitude={1.2}
              waveCount={4}
              waveSpeed={0.35}
              rotationSpeed={0}
              pulseSpeed={3.5}
              depthFactor={1}
              ambient={0.3}
              lerpSpeed={0.05}
              interactive
              clickBurst
              intro
              lightMode={false}
            />
          </div>

          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/80 shadow-xs backdrop-blur">
            <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
            <ShinyText
              text="GaN Charging • Smart Wearables • TB4 Hubs • TD Retail AI Support"
              className="text-xs font-semibold"
              speed={3}
            />
          </div>

          {/* Staggered heading */}
          <div className="max-w-4xl mx-auto">
            <SplitText
              text="Premium Tech Accessories for Modern Professionals"
              tag="h1"
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
              delay={30}
              duration={0.9}
              effect="rise"
            />
          </div>

          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Volt Nest delivers cutting-edge GaN chargers, noise-cancelling earbuds, portable 4K displays,
            health wearables and Thunderbolt hubs — backed by a 10-day replacement guarantee and AI-powered
            customer support.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#catalogue">
              <Button size="lg" className="h-11 px-6 text-sm font-semibold gap-2 shadow-xs vn-glow-blue">
                <Zap className="h-4 w-4" />
                <span>Shop 5 Products</span>
              </Button>
            </a>
            <NextLink href="/orders">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold gap-2 border-border">
                <Receipt className="h-4 w-4" />
                <span>My Orders</span>
              </Button>
            </NextLink>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">GaN III Technology</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Next-gen Gallium Nitride chargers that are 40% smaller yet deliver 100W+ output to charge
                your laptop, phone and earbuds simultaneously.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Thunderbolt 4 Ecosystem</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Expand any laptop into a dual-4K workstation with 10Gbps data, 96W charging, 2.5GbE Ethernet,
                and 12 ports — all from a single cable.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">AI-Backed Support</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Every order connects to the TD Retail AI resolution engine. Track shipments, trigger
                10-day replacements, or escalate to human specialists — instantly.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Product Catalogue Grid */}
      <section id="catalogue" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px] font-semibold">
                Product Catalogue
              </Badge>
              <span className="text-xs text-muted-foreground">• 5 Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Volt Nest Tech Accessories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every product ships with a 1-year warranty and 10-day replacement guarantee for defective items.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-border gap-1.5 py-1 px-3">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span>Simulated Checkout</span>
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEEDED_PRODUCTS.map((product) => {
            const avail = AVAILABILITY_LABELS[product.availabilityStatus];
            const isOutOfStock = product.availabilityStatus === 'out_of_stock';

            return (
              <Card
                key={product.id}
                className={`flex flex-col justify-between border-border bg-card shadow-xs transition-all duration-300 ${
                  isOutOfStock
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-primary/50 hover:shadow-md hover:vn-glow-blue'
                }`}
              >
                <CardHeader className="p-5 pb-3 space-y-3">
                  <NextLink href={`/products/${product.id}`} className="block group">
                    <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted border border-border">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Availability badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant={avail.variant} className="text-[10px] font-bold shadow-xs">
                          {avail.label}
                        </Badge>
                      </div>
                      {product.badge && (
                        <div className="absolute top-2.5 right-2.5">
                          <Badge variant="outline" className="text-[10px] font-bold shadow-xs border-primary/60 text-primary bg-background/80 backdrop-blur">
                            {product.badge}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </NextLink>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">{product.brand}</span>
                      <span className="font-mono text-[10px]">{product.id}</span>
                    </div>
                    <NextLink href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                      <CardTitle className="text-base font-bold line-clamp-1">
                        {product.title}
                      </CardTitle>
                    </NextLink>
                  </div>

                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                    {product.description}
                  </CardDescription>

                  <div className="pt-1">
                    <Badge variant="secondary" className="text-[10px] font-mono line-clamp-1 max-w-full">
                      {product.specs}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  <Separator className="my-2" />
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-muted-foreground">Free Shipping</span>
                    <div className="text-lg font-black tracking-tight text-foreground">
                      {formatINR(product.price)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1.5 border-border hover:bg-muted"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && addItem(product, 1)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </Button>

                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5 shadow-xs"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && handleBuyNow(product.id)}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Buy Now</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Warranty notice */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card/60 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              All Volt Nest products are covered by a <strong className="text-foreground">1-year warranty</strong> and{' '}
              <strong className="text-foreground">10-day replacement</strong> for defective items. Refunds within 3–5 business days after inspection.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
