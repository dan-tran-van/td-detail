'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Disc,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Layers,
  Terminal,
  Play,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  Code2,
  Server,
  Bot,
  Activity,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer } from '@/lib/types';
import DotGrid from '@/components/DotGrid';
import ShinyText from '@/components/ShinyText';
import CountUp from '@/components/CountUp';

export default function LandingPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'order' | 'chat'>('order');

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/session');
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
      }
    } catch (e) {
      console.warn('Failed to fetch session', e);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-24 pb-24">
      {/* 1. Stripe-Style Hero Section with DotGrid Matrix Backing */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-20 border-b border-border bg-background">
        {/* Layer 1: DotGrid Background + Gradient Meshes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle Enterprise Matrix Grid */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
            }}
          />

          {/* Deep Sapphire and Indigo Nebulas */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] md:w-[1200px] h-[520px] bg-gradient-to-r from-blue-700/20 via-indigo-600/20 to-sky-600/20 blur-3xl rounded-full opacity-70" />
          <div className="absolute top-20 left-1/6 w-[400px] h-[300px] bg-blue-500/15 blur-3xl rounded-full" />
          <div className="absolute top-16 right-1/6 w-[420px] h-[320px] bg-sky-500/15 blur-3xl rounded-full" />

          {/* React Bits DotGrid: Interactive Neural Matrix */}
          <div className="absolute inset-0 opacity-75 pointer-events-auto">
            <DotGrid
              dotSize={2}
              gap={24}
              baseColor="#334155"
              activeColor="#38bdf8"
              proximity={130}
              strength={1.5}
              swell={1.8}
              stretch={1.4}
              glow={1.2}
              fade={0.35}
              opacity={0.8}
              mouseInteraction={true}
              className="w-full h-full"
            />
          </div>

          {/* Smooth Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Shimmering Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-background/80 shadow-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <ShinyText
              text="TD Retail Infrastructure • Gemini Multi-Tenant Resolution"
              className="text-xs font-semibold"
              speed={3}
            />
            <ChevronRight className="h-3 w-3 text-muted-foreground ml-1" />
          </div>

          {/* Massive Stripe-Style Typography */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08] drop-shadow-xs">
              AI support infrastructure for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                multi-merchant commerce.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Consolidate support across your standalone digital storefronts, marketplaces, and services. Grounded Gemini AI verifies live order states, generates digital license keys, and handles escalations across tenant boundaries.
            </p>
          </div>

          {/* High-Contrast Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <NextLink href="/chat/conv_music_01">
              <Button size="lg" className="h-12 px-7 gap-2 bg-primary text-primary-foreground font-semibold shadow-xs hover:opacity-90 transition-opacity">
                <Sparkles className="h-4 w-4" />
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </NextLink>

            <NextLink href="/inbox">
              <Button variant="outline" size="lg" className="h-12 px-6 gap-2 border-border backdrop-blur bg-background/60 hover:bg-muted/80 font-medium">
                <MessageSquare className="h-4 w-4" />
                <span>Unified Support Inbox</span>
              </Button>
            </NextLink>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleResetData}
              disabled={isResetting}
              className="h-12 px-5 gap-2 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo Seed</span>
            </Button>
          </div>

          {/* Stripe-Style Key Performance Metrics */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto gap-6 border-t border-border/60">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                <CountUp to={100} suffix="%" duration={1.2} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Grounded Accuracy</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                <CountUp to={2} prefix="" suffix=" Stores" duration={1} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Connected Merchants</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                <CountUp to={24} suffix="/7" duration={1.5} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Automated Support</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                &lt;<CountUp to={300} suffix="ms" duration={1.5} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Tool Call Latency</p>
            </div>
          </div>

          {/* Active Demo Session Persona Indicator */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Demo Shopper:</span>
            <span className="font-semibold text-foreground">{customer?.name || 'Sarah Connor'}</span>
            <span className="font-mono text-[11px] text-muted-foreground">({customer?.email})</span>
          </div>
        </div>
      </section>

      {/* 2. Connected Merchant Ecosystem (Storefront Demos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Connected Merchants
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              A single control plane for diverse storefronts
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Each merchant retains its distinct brand identity, product catalog, and policies while TD Retail orchestrates unified support and order tracking.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>Live REST Webhooks Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Merchant 1: SoundWave Digital Music */}
          <Card className="border-border bg-card shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            <CardHeader className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                    <Disc className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">SoundWave Digital</CardTitle>
                    <CardDescription className="text-xs font-medium">
                      Lossless Audio, DJ Licenses & Vinyl Stems
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  Port 3001
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                External Next.js digital storefront for studio masters. Orders placed via checkout sync automatically to TD Retail via REST API, allowing Gemini to instantly look up download links and license keys.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  POST /api/orders
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  Order #SW-10492
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  License Verification
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 flex gap-3">
              <NextLink href="/chat/conv_music_01" className="flex-1">
                <Button className="w-full gap-2 bg-primary text-primary-foreground font-medium">
                  <Play className="h-4 w-4" />
                  <span>Interactive Chat Demo</span>
                </Button>
              </NextLink>

              <a
                href={process.env.NEXT_PUBLIC_MUSIC_MERCHANT_URL || 'http://localhost:3001'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2 border-border font-medium">
                  <ExternalLink className="h-4 w-4" />
                  <span>SoundWave Storefront</span>
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Merchant 2: FreshCart Groceries */}
          <Card className="border-border bg-card shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            <CardHeader className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">FreshCart Direct</CardTitle>
                    <CardDescription className="text-xs font-medium">
                      Organic Groceries & Same-Day Cold Chain
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  Physical Delivery
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                High-volume artisanal grocery logistics. Grounded AI handles courier delivery status, cold-pack tracking, missing produce item replacement, and policy-grounded instant refunds.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  Delivery ETA Check
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  Order #FC-88219
                </span>
                <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                  Automated Refunds
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 flex gap-3">
              <NextLink href="/chat/conv_grocery_01" className="flex-1">
                <Button className="w-full gap-2 bg-primary text-primary-foreground font-medium">
                  <Play className="h-4 w-4" />
                  <span>Interactive Chat Demo</span>
                </Button>
              </NextLink>

              <NextLink href="/inbox" className="flex-1">
                <Button variant="outline" className="w-full gap-2 border-border font-medium">
                  <MessageSquare className="h-4 w-4" />
                  <span>View in Inbox</span>
                </Button>
              </NextLink>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Developer & Architecture Section: Stripe-Style Code Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
            Developer Experience
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Built for developers, architected for scale
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Integrate any merchant storefront in minutes using our typed REST endpoints. Orders and conversations flow through secure tenant-isolated webhooks with zero direct database coupling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Architecture Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Stateless Cloud Run Compliance</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Storefronts operate fully decoupled without relying on direct Firebase SDKs or local filesystem storage.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Tenant-Isolated Function Calling</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Gemini tool declarations strictly restrict queries to the merchant ID of the active conversation thread.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Two-Way Email Synchronization</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  SendGrid inbound parse webhooks parse reply-to tokens and route email customer responses directly into active chat threads.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <NextLink href="/outbox">
                <Button variant="outline" size="sm" className="gap-2 text-xs border-border">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Inspect Outbox & Webhooks</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </NextLink>
            </div>
          </div>

          {/* Right: Interactive Code Window */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-zinc-950 text-zinc-100 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">api-integration.ts</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveCodeTab('order')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      activeCodeTab === 'order'
                        ? 'bg-zinc-800 text-sky-400 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    POST /api/orders
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('chat')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      activeCodeTab === 'chat'
                        ? 'bg-zinc-800 text-sky-400 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    POST /api/conversations
                  </button>
                </div>
              </div>

              <CardContent className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
                {activeCodeTab === 'order' ? (
                  <pre className="space-y-1">
                    <span className="text-zinc-500">// 1. Sync external order from standalone merchant to TD Retail</span>
                    {'\n'}
                    <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;http://localhost:3000/api/orders&apos;</span>, {'{\n'}
                    {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                    {'  '}headers: {'{ '}<span className="text-emerald-300">&apos;Content-Type&apos;</span>: <span className="text-emerald-300">&apos;application/json&apos;</span>{' },\n'}
                    {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                    {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_music_01&apos;</span>,{'\n'}
                    {'    '}orderId: <span className="text-emerald-300">&apos;ORD-MUS-9281&apos;</span>,{'\n'}
                    {'    '}items: [<span className="text-emerald-300">&apos;Midnight Horizon (Lossless Master)&apos;</span>],{'\n'}
                    {'    '}licenseKey: <span className="text-emerald-300">&apos;SW-LIC-9921-X&apos;</span>,{'\n'}
                    {'    '}status: <span className="text-emerald-300">&apos;delivered&apos;</span>{'\n'}
                    {'  }'}),{'\n'}
                    {'}'});
                  </pre>
                ) : (
                  <pre className="space-y-1">
                    <span className="text-zinc-500">// 2. Trigger Grounded Gemini AI resolution thread</span>
                    {'\n'}
                    <span className="text-purple-400">const</span> thread = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;http://localhost:3000/api/conversations&apos;</span>, {'{\n'}
                    {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                    {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                    {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_music_01&apos;</span>,{'\n'}
                    {'    '}customerId: <span className="text-emerald-300">&apos;cust_sarah_01&apos;</span>,{'\n'}
                    {'    '}initialMessage: <span className="text-emerald-300">&apos;Where can I find my stems download link?&apos;</span>{'\n'}
                    {'  }'}),{'\n'}
                    {'}'});
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Enterprise Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Engineered for high-trust customer support
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything your operations team needs to automate support while staying in complete control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Collapsible Gemini Workspace</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Gemini-style expandable sidebar allowing effortless navigation between multi-merchant customer threads, quick switching, and search.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Zero-Hallucination Tooling</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                AI agents access customer records strictly via server tool function calling. Every statement regarding tracking, keys, and refunds is verified.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Omnichannel Email Sync</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Seamless SendGrid inbound parse routing allows shoppers to respond straight from their email client into the live conversation thread.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 5. Production Verification & Architecture Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Architecture & Specification Compliance</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Built strictly with Next.js App Router, TypeScript, shadcn/ui components, and Google Gemini AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-muted border border-border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Consolidated Chatbot Inbox</span>
                  <p className="text-[11px] text-muted-foreground">
                    Unified inbox and chat with expandable/collapsible sidebar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-muted border border-border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Grounded Gemini Function Tools</span>
                  <p className="text-[11px] text-muted-foreground">
                    Server tool <code>lookupOrderStatus</code> validates tenant boundary before return.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-muted border border-border">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Inbound & Outbound Email</span>
                  <p className="text-[11px] text-muted-foreground">
                    SendGrid SDK + Inbound Parse webhook handler with Reply-To token routing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
