'use client';

import React, { useState } from 'react';
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
  Headphones,
  Watch,
  Award,
  CheckCircle2,
  Mail,
  Flame,
  Star,
  ChevronRight,
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
import { TEMPLATE_EDITORIAL_ASSETS } from '@/lib/template-assets';
import { useCart } from '@/context/CartContext';
import SplitText from '@/components/SplitText';
import ShinyText from '@/components/ShinyText';
import TiltedCard from '@/components/TiltedCard';
import MagicRings from '@/components/MagicRings';
import { CategoryPills } from '@/components/CategoryPills';

const AVAILABILITY_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  in_stock: { label: 'In Stock', variant: 'default' },
  low_stock: { label: 'Low Stock', variant: 'secondary' },
  out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
};

export default function StorefrontHomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleBuyNow = (productId: string) => {
    router.push(`/checkout?productId=${productId}`);
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? SEEDED_PRODUCTS
      : SEEDED_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* ============================================================
          SECTION 1: HERO FLAGSHIP SHOWCASE (Template ColorFit Pro 4 Alpha Style)
          ============================================================ */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-white via-slate-50/60 to-white pt-10 pb-16 sm:pt-14 sm:pb-24">
        {/* React Bits Background: Magic Rings */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle dot matrix pattern matching template */}
          <div className="absolute inset-0 opacity-30 bg-dot-pattern" />

          {/* Magic Rings background animation from React Bits */}
          <div className="absolute inset-0 opacity-70">
            <MagicRings
              color="#0d9488"
              colorTwo="#06b6d4"
              ringCount={7}
              motion="pulse"
              speed={0.8}
              lineThickness={1.8}
              glow={1.2}
              opacity={0.7}
              baseRadius={0.25}
              radiusStep={0.08}
              expansion={0.08}
              taper={1.4}
              tilt={15}
              followMouse={true}
              mouseInfluence={0.25}
              clickBurst={true}
              theme="light"
              maxDevicePixelRatio={2}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-5">
          {/* Clean ColorFit Pro 4 Alpha Typography matching Noise template */}
          <div className="max-w-4xl mx-auto space-y-1">
            <SplitText
              text="ColorFit Pro 4 Alpha"
              tag="h1"
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 leading-tight"
              delay={25}
              duration={0.8}
              effect="rise"
            />
            <p className="text-xl sm:text-3xl font-light text-slate-400 tracking-wide">
              Redefine your Quest
            </p>
          </div>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Aerospace-grade zinc alloy body, 1.96&quot; AMOLED true-color display, fast GaN power ecosystem, and 24/7 health tracking backed by TD Retail AI resolution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="h-11 px-7 text-sm font-bold gap-2 shadow-sm vn-glow-blue cursor-pointer"
              onClick={() => handleBuyNow('VN-2004')}
            >
              <Zap className="h-4 w-4" />
              <span>Buy Alpha Watch • ₹9,499</span>
            </Button>
            <a href="#catalogue">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-semibold gap-2 border-border cursor-pointer">
                <span>Explore 5 Gadgets</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* 3D Tilted Card Hero Showcase (Template Front & Center Smartwatch / Device Showcase) */}
          <div className="pt-8 sm:pt-12 w-full max-w-2xl flex justify-center">
            <div className="relative group cursor-pointer">
              <TiltedCard
                imageSrc={TEMPLATE_EDITORIAL_ASSETS.flagshipHero.image}
                altText="VoltPulse Alpha Pro Flagship"
                captionText="VoltPulse Alpha Pro • Titanium Edition"
                containerHeight="360px"
                containerWidth="340px"
                imageHeight="340px"
                imageWidth="320px"
                rotateAmplitude={12}
                scaleOnHover={1.06}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <div className="p-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-left text-white shadow-lg pointer-events-none">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
                      <Zap className="h-3.5 w-3.5" />
                      <span>FLAGSHIP HERO</span>
                    </div>
                    <div className="text-sm font-extrabold">VoltPulse Alpha Pro</div>
                    <div className="text-[11px] text-gray-300">Continuous SpO2 • 7-Day Battery • IP68</div>
                  </div>
                }
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-5 bg-primary/20 blur-xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: CIRCULAR CATEGORY PILLS (Template Icon Avatar Navigation)
          ============================================================ */}
      <section className="border-b border-border bg-card/40 backdrop-blur-xs">
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('catalogue');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* ============================================================
          SECTION 3: BENTO SHOWCASE ("Find Your Match" & "Watch for Innovation")
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs font-semibold border-primary/40 text-primary">
            Curated Form Factors
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Watch for Innovation & Seamless Performance
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Explore curated tech tailored for creators, travellers, and high-output professionals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Lifestyle Spotlight */}
          <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm group">
            <div className="relative aspect-[16/10] md:h-full min-h-[300px]">
              <img
                src={TEMPLATE_EDITORIAL_ASSETS.bentoShowcases[0].image}
                alt={TEMPLATE_EDITORIAL_ASSETS.bentoShowcases[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <Badge variant="secondary" className="text-[10px] font-bold">
                  {TEMPLATE_EDITORIAL_ASSETS.bentoShowcases[0].tagline}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {TEMPLATE_EDITORIAL_ASSETS.bentoShowcases[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 max-w-md">
                  {TEMPLATE_EDITORIAL_ASSETS.bentoShowcases[0].description}
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="text-xs font-semibold gap-1.5 cursor-pointer"
                    onClick={() => router.push('/products/VN-2004')}
                  >
                    <span>Discover Wearables</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dual Compact Bento Showcase */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Top Mini Card */}
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-6 flex flex-col justify-between group flex-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] font-bold border-border">
                    100W GaN III
                  </Badge>
                  <h4 className="text-lg font-bold text-foreground">VoltCore Pro Charger</h4>
                  <p className="text-xs text-muted-foreground">Charge laptop & phone at full speed.</p>
                </div>
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&auto=format&fit=crop&q=80"
                    alt="GaN Charger"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                <span className="text-sm font-extrabold text-foreground">₹3,499</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 cursor-pointer"
                  onClick={() => handleBuyNow('VN-2001')}
                >
                  Quick Buy
                </Button>
              </div>
            </div>

            {/* Bottom Mini Card */}
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-6 flex flex-col justify-between group flex-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] font-bold border-border">
                    Thunderbolt 4
                  </Badge>
                  <h4 className="text-lg font-bold text-foreground">GridHub 12-in-1 Dock</h4>
                  <p className="text-xs text-muted-foreground">Dual 4K displays with 96W PD.</p>
                </div>
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&auto=format&fit=crop&q=80"
                    alt="Thunderbolt Dock"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                <Badge variant="destructive" className="text-[10px]">
                  Out of Stock
                </Badge>
                <NextLink href="/products/VN-2005">
                  <Button size="sm" variant="ghost" className="text-xs h-8 cursor-pointer">
                    View Specs →
                  </Button>
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: EDITORIAL AUDIO BANNER ("Discover Audio for Life" Template Style)
          ============================================================ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-r from-slate-50 via-white to-pink-50/30 p-8 sm:p-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & SplitText */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <SplitText
                  text="Discover Audio for Life"
                  tag="h2"
                  className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400"
                  delay={25}
                  duration={0.8}
                />
                <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed pt-2">
                  Studio-tuned 10mm dynamic acoustic drivers with Hybrid Active Noise Cancellation and multipoint Bluetooth 5.3 pairing.
                </p>
              </div>

              {/* Quick specs pill row */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-white border border-border text-slate-700 font-mono shadow-2xs">32h Playtime</span>
                <span className="px-3 py-1 rounded-full bg-white border border-border text-slate-700 font-mono shadow-2xs">Hybrid ANC</span>
                <span className="px-3 py-1 rounded-full bg-white border border-border text-slate-700 font-mono shadow-2xs">IPX5 Splash</span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <Button
                  size="lg"
                  className="h-11 px-6 text-sm font-bold gap-2 cursor-pointer shadow-sm vn-glow-blue"
                  onClick={() => handleBuyNow('VN-2002')}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop NeoArc X1 • ₹5,999</span>
                </Button>
                <NextLink href="/products/VN-2002">
                  <Button variant="outline" size="lg" className="h-11 px-5 text-sm font-semibold border-border cursor-pointer">
                    Read Review
                  </Button>
                </NextLink>
              </div>
            </div>

            {/* Right Headphone / Lifestyle Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-border shadow-xl group">
                <img
                  src={TEMPLATE_EDITORIAL_ASSETS.editorialAudio.lifestyleModelImage}
                  alt="Acoustics for Life"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Acoustic Precision</div>
                  <div className="text-base font-extrabold">NeoArc X1 ANC Earbuds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: BRAND TRUST & VALIDATION ("Celebrating the best...")
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-border space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Ambassador / Lifestyle Brand Image */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-card shadow-md">
              <img
                src={TEMPLATE_EDITORIAL_ASSETS.brandMilestones.ambassadorImage}
                alt="Brand Ambassador"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs font-bold text-primary">#VoltStandard</div>
                <div className="text-lg font-black text-foreground">Engineered for Daily Excellence</div>
                <div className="text-xs text-muted-foreground">Certified quality across all accessories</div>
              </div>
            </div>
          </div>

          {/* Validation Metrics */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs font-semibold border-border">
                {TEMPLATE_EDITORIAL_ASSETS.brandMilestones.subtitle}
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                {TEMPLATE_EDITORIAL_ASSETS.brandMilestones.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Volt Nest is committed to zero compromises: every component is stress-tested, certified with industrial safety standards, and grounded with the TD Retail AI resolution architecture.
              </p>
            </div>

            {/* Metric Cards (Matching Template NO.1 style cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {TEMPLATE_EDITORIAL_ASSETS.brandMilestones.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card/70 p-4 space-y-1.5 shadow-xs hover:border-primary/50 transition-colors"
                >
                  <div className="text-2xl font-black text-primary tracking-tight font-mono">{m.rank}</div>
                  <div className="text-xs font-bold text-foreground">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Policy & AI Resolution Notice */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>
                Orders are protected by an automated <strong className="text-foreground">10-day replacement policy</strong> and{' '}
                <strong className="text-foreground">1-year manufacturer warranty</strong> with instant human support escalation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: PRODUCT CATALOGUE GRID (The 5 Seeded Storefront Products)
          ============================================================ */}
      <section id="catalogue" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px] font-semibold">
                Catalogue Inventory
              </Badge>
              <span className="text-xs text-muted-foreground">
                • {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Shown
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {selectedCategory === 'all'
                ? 'Volt Nest Hardware Gear'
                : `${selectedCategory.toUpperCase()} Lineup`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every item ships directly from certified warehouses with genuine serial number validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                Reset Filter
              </Button>
            )}
            <Badge variant="outline" className="text-xs border-border gap-1.5 py-1 px-3">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span>Official Merchant B Stock</span>
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
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
                          <Badge variant="outline" className="text-[10px] font-bold shadow-xs border-primary/60 text-primary bg-background/80 backdrop-blur-xs">
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
                    className="w-full text-xs gap-1.5 border-border hover:bg-muted cursor-pointer"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && addItem(product, 1)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Add to Cart</span>
                  </Button>

                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5 shadow-xs cursor-pointer"
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
      </section>

      {/* ============================================================
          SECTION 7: VIP NEWSLETTER & COMMUNITY ("Hear the Noise first" style)
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card/70 to-card p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-semibold text-primary">
            <Flame className="h-3.5 w-3.5" />
            <span>Volt Nest VIP Access</span>
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Hear the Volt First
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign up for private hardware drop alerts, early GaN release firmware, and exclusive bundle promotions.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 max-w-md mx-auto flex items-center justify-center gap-2 text-primary text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>You are on the VIP early access list! Check your inbox soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="w-full sm:w-auto h-11 px-6 text-xs font-bold shrink-0 cursor-pointer">
                Sign Up
              </Button>
            </form>
          )}

          <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-4 pt-2">
            <span>• No spam guaranteed</span>
            <span>• Instant unsubscribe anytime</span>
            <span>• 10% Welcome Voucher</span>
          </div>
        </div>
      </section>
    </div>
  );
}
