'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Disc,
  ShoppingBag,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  Music,
  ArrowRight,
  Headphones,
  Sliders,
  Receipt,
  DownloadCloud,
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

export default function StorefrontHomePage() {
  const router = useRouter();
  const { addItem } = useCart();

  const handleBuyNow = (productId: string) => {
    router.push(`/checkout?productId=${productId}`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section with Audio Wave Grid, Radial Glow & React Bits Aurora */}
      <section className="relative overflow-hidden border-b border-border bg-background py-16 sm:py-24">
        {/* Layer 1: Guaranteed Deep Ambient Mesh Gradient & Audio Studio Grid */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle Studio Blueprint Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
            }}
          />

          {/* Vibrant Multi-Color Audio Wave Nebulas */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-r from-indigo-600/35 via-purple-600/35 to-pink-600/35 blur-3xl rounded-full opacity-80" />
          <div className="absolute top-20 left-1/4 w-[350px] h-[250px] bg-cyan-500/20 blur-3xl rounded-full" />
          <div className="absolute top-10 right-1/4 w-[400px] h-[280px] bg-rose-500/20 blur-3xl rounded-full" />

          {/* React Bits Aurora Canvas Layer */}
          <div className="absolute inset-0 opacity-90">
            <Antigravity
    colors={["#5227FF","#FF9FFC","#B497CF"]}
    count={1500}
    magnetRadius={9}
    ringRadius={7}
    particleSize={0.9}
    autoAnimate
    colorMode="conic"
    colorSpeed={0.05}
    particleShape="capsule"
    particleVariance={1}
    fieldStrength={10}
    waveAmplitude={1}
    waveCount={3}
    waveSpeed={0.4}
    rotationSpeed={0}
    pulseSpeed={3}
    depthFactor={1}
    ambient={0.25}
    lerpSpeed={0.05}
    interactive
    clickBurst
    intro
    lightMode={false}
/>
          </div>

          {/* Bottom Vignette Fade to Store Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-6">
          {/* Shimmering Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/80 shadow-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <ShinyText
              text="Direct Studio Master Audio • TD Retail AI Resolution Enabled"
              className="text-xs font-semibold"
              speed={3}
            />
          </div>

          {/* Staggered Heading with SplitText */}
          <div className="max-w-4xl mx-auto">
            <SplitText
              text="Bit-Perfect Lossless Audio & Master Stems"
              tag="h1"
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
              delay={30}
              duration={0.9}
              effect="rise"
            />
          </div>

          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Premier independent digital music distributor. Discover bit-perfect 24-bit FLAC releases, multi-track creator stems, and verified digital ownership keys with instant customer support resolution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#catalogue">
              <Button size="lg" className="h-11 px-6 text-sm font-semibold gap-2 shadow-xs">
                <Disc className="h-4 w-4" />
                <span>Explore 5 Seeded Releases</span>
              </Button>
            </a>
            <NextLink href="/orders">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold gap-2 border-border">
                <Receipt className="h-4 w-4" />
                <span>My Vault & Orders</span>
              </Button>
            </NextLink>
          </div>
        </div>
      </section>

      {/* Pillars Section Composed with shadcn Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Headphones className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">24-Bit / 96kHz Lossless</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Direct studio master transfers in bit-perfect FLAC and DSD formats. Zero compression or lossy transcoding.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sliders className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Multi-Track Creator Stems</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Uncompressed WAV drum, synth, and vocal stems included for remixers, game developers, and producers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="space-y-2 p-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">Connected AI Support</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Embedded resolution engine grounded by TD Retail. Retrieve license keys, download links, and instant assistance without leaving the storefront.
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
                Store Catalog
              </Badge>
              <span className="text-xs text-muted-foreground">• 5 Available Releases</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Official Digital Releases
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Each purchase includes verified digital license keys and permanent customer vault access.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-border gap-1.5 py-1 px-3">
              <DownloadCloud className="h-3.5 w-3.5 text-primary" />
              <span>Simulated Instant Checkout</span>
            </Badge>
          </div>
        </div>

        {/* 5 Products Grid Composed with official shadcn Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEEDED_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between border-border bg-card shadow-xs hover:border-primary/50 transition-all hover:shadow-md duration-300"
            >
              <CardHeader className="p-5 pb-3 space-y-3">
                <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted border border-border">
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  {product.badge && (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge variant="default" className="text-[10px] font-bold shadow-xs">
                        {product.badge}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{product.artist}</span>
                    <span>{product.duration}</span>
                  </div>
                  <CardTitle className="text-base font-bold line-clamp-1">
                    {product.title}
                  </CardTitle>
                </div>

                <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                  {product.description}
                </CardDescription>

                <div className="pt-1">
                  <Badge variant="secondary" className="text-[10px] font-mono line-clamp-1 max-w-full">
                    {product.format}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <Separator className="my-2" />
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Direct Download</span>
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
                  onClick={() => addItem(product, 1)}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Cart</span>
                </Button>

                <Button
                  size="sm"
                  className="w-full text-xs gap-1.5 shadow-xs"
                  onClick={() => handleBuyNow(product.id)}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Buy Now</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
