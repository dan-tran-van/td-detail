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
  Layers2,
  ArrowUpRight,
  Database,
  KeyRound,
  FileCheck2,
  Building2,
  Scale,
  Gauge,
  Workflow,
  Network,
  Webhook,
  Headphones,
  Sliders,
  Radio,
  FileText,
  Boxes,
  Clock,
  Sparkle,
  Copy,
  Check,
  HelpCircle,
  BarChart3,
  GitBranch,
  Star,
  Quote,
  Newspaper,
  Send,
  X,
  CreditCard,
  TrendingUp,
  LineChart,
  Users,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from '@/lib/types';
import DotGrid from '@/components/DotGrid';
import ShinyText from '@/components/ShinyText';
import CountUp from '@/components/CountUp';

export default function LandingPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Hello! Welcome to TD Retail Global Support. How can we help orchestrate your multi-storefront customer service today?",
      time: 'Just now',
    },
  ]);

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

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatLog((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatMessage('');
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: "Thank you for reaching out! Our grounded AI agent is standing by. You can also explore live thread triage in the Unified Operations Console.",
          time: 'Just now',
        },
      ]);
    }, 700);
  };

  return (
    <TooltipProvider delay={100}>
      <div className="flex-1 flex flex-col space-y-36 pb-36 relative">
        {/* 1. Flagship Stripe Hero Section */}
        <section className="relative overflow-hidden pt-28 sm:pt-36 md:pt-44 pb-32 border-b border-border/70 bg-background">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
                maskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 40%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 40%, transparent 100%)',
              }}
            />

            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] md:w-[1300px] h-[580px] bg-gradient-to-r from-blue-700/25 via-indigo-600/25 to-sky-600/25 blur-3xl rounded-full opacity-70" />
            <div className="absolute top-10 left-1/8 w-[450px] h-[350px] bg-blue-500/15 blur-3xl rounded-full" />
            <div className="absolute top-8 right-1/8 w-[460px] h-[360px] bg-sky-500/15 blur-3xl rounded-full" />

            <div className="absolute inset-0 opacity-80 pointer-events-auto">
              <DotGrid
                dotSize={2}
                gap={24}
                baseColor="#334155"
                activeColor="#38bdf8"
                proximity={135}
                strength={1.6}
                swell={1.9}
                stretch={1.4}
                glow={1.3}
                fade={0.35}
                opacity={0.85}
                mouseInteraction={true}
                className="w-full h-full"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-background/80 shadow-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <ShinyText
                text="TD Retail Global Cloud • Grounded AI Support Platform"
                className="text-xs font-semibold"
                speed={3}
              />
              <ChevronRight className="h-3 w-3 text-muted-foreground ml-1" />
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08] drop-shadow-xs">
                Autonomous customer operations for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
                  modern enterprise commerce.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
                Unified AI service infrastructure for multi-brand retail ecosystems. Seamlessly orchestrate real-time order lookups, automated fulfillment actions, and multi-tenant workflows with zero hallucinations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <NextLink href="/chat/conv_music_01">
                <Button size="lg" className="h-12 px-7 rounded-full gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-90 transition-all hover:scale-102">
                  <Sparkles className="h-4 w-4" />
                  <span>Launch Live Agent Demo</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </NextLink>

              <NextLink href="/inbox">
                <Button variant="outline" size="lg" className="h-12 px-6 rounded-full gap-2 border-border backdrop-blur bg-background/60 hover:bg-muted/80 font-medium">
                  <MessageSquare className="h-4 w-4" />
                  <span>Unified Operations Console</span>
                </Button>
              </NextLink>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleResetData}
                disabled={isResetting}
                className="h-12 px-5 rounded-full gap-2 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Reset Sandbox</span>
              </Button>
            </div>

            {/* Enterprise Performance Strip with Tooltip annotations */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto gap-6 border-t border-border/60">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <div className="space-y-1 cursor-help group text-center">
                      <div className="text-3xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                        <CountUp to={100} suffix="%" duration={1.2} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <span>Grounded Fact Accuracy</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </p>
                    </div>
                  }
                />
                <TooltipContent>Strict tool-based facts: agent never invents order IDs or states.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <div className="space-y-1 cursor-help group text-center">
                      <div className="text-3xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                        <CountUp to={2} prefix="" suffix=" Brands" duration={1} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <span>Connected Stores</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </p>
                    </div>
                  }
                />
                <TooltipContent>Independent storefronts federated into a single tenant controller.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <div className="space-y-1 cursor-help group text-center">
                      <div className="text-3xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                        <CountUp to={24} suffix="/7" duration={1.5} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <span>Autonomous Triage</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </p>
                    </div>
                  }
                />
                <TooltipContent>Instant classification, intent identification, and SLA tiering.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <div className="space-y-1 cursor-help group text-center">
                      <div className="text-3xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                        &lt;<CountUp to={240} suffix="ms" duration={1.5} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <span>Deterministic Latency</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </p>
                    </div>
                  }
                />
                <TooltipContent>Server-side execution time across tenant REST gateways.</TooltipContent>
              </Tooltip>
            </div>

            {/* Active Enterprise Session Indicator */}
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Enterprise Session:</span>
              <span className="font-semibold text-foreground">{customer?.name || 'Sarah Connor'}</span>
              <span className="font-mono text-[11px] text-muted-foreground">({customer?.email || 'sarah.connor@cyberdyne.io'})</span>
            </div>
          </div>
        </section>

        {/* 2. Stripe-Style Logo Cloud: Trusted by Leading Modern Brands */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Powering customer operations across global multi-merchant networks
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <Disc className="h-4 w-4 text-sky-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">SoundWave</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">FreshCart</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <Boxes className="h-4 w-4 text-purple-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">AeroLogix</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <Globe2 className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">ApexDirect</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <Cpu className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">Cyberdyne</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60">
                <Layers className="h-4 w-4 text-rose-400" />
                <span className="font-bold text-sm tracking-tight text-foreground">ZenithHub</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Connected Merchant Ecosystem: Multi-Merchant Control Plane */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
                Multi-Tenant Architecture
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                One unified platform, limitless merchant storefronts
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Maintain distinct brand identities, inventory schemas, and merchant policies while TD Retail unifies customer inquiries, automated resolutions, and cross-channel sync.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-1.5 rounded-full bg-background border border-border shadow-xs">
              <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>Real-Time Bi-Directional Event Stream</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Merchant 1: SoundWave Digital Music */}
            <Card className="border-border/80 bg-card shadow-md hover:border-primary/60 transition-all flex flex-col justify-between overflow-hidden relative group rounded-2xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
              <CardHeader className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <Disc className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        SoundWave Digital
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        Lossless Audio & Digital Media Rights Management
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    Digital Delivery
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Autonomous support for digital storefronts. Gemini identifies customer purchases, validates license authenticity, delivers secure stem download links, and resolves key activation issues in real-time.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    POST /api/orders
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    License Verification
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    Zero-Copy Stem Retrieval
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex gap-3">
                <NextLink href="/chat/conv_music_01" className="flex-1">
                  <Button className="w-full rounded-full gap-2 bg-primary text-primary-foreground font-medium shadow-sm">
                    <Play className="h-4 w-4" />
                    <span>Launch Agent Chat</span>
                  </Button>
                </NextLink>

                <a
                  href={process.env.NEXT_PUBLIC_MUSIC_MERCHANT_URL || 'http://localhost:3001'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full rounded-full gap-2 border-border font-medium bg-background/50 hover:bg-background">
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Storefront</span>
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Merchant 2: FreshCart Direct */}
            <Card className="border-border/80 bg-card shadow-md hover:border-primary/60 transition-all flex flex-col justify-between overflow-hidden relative group rounded-2xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
              <CardHeader className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        FreshCart Direct
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        Perishable Goods & Cold-Chain Logistics
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    Physical Logistics
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Real-time resolution for physical delivery pipelines. Grounded AI monitors courier delivery windows, processes item replacements, and evaluates refund eligibility against cold-chain SLA policies.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    Courier Geofencing
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    SLA Validation
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                    Autonomous Refund Auth
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex gap-3">
                <NextLink href="/chat/conv_grocery_01" className="flex-1">
                  <Button className="w-full rounded-full gap-2 bg-primary text-primary-foreground font-medium shadow-sm">
                    <Play className="h-4 w-4" />
                    <span>Launch Agent Chat</span>
                  </Button>
                </NextLink>

                <NextLink href="/inbox" className="flex-1">
                  <Button variant="outline" className="w-full rounded-full gap-2 border-border font-medium bg-background/50 hover:bg-background">
                    <MessageSquare className="h-4 w-4" />
                    <span>Operations Inbox</span>
                  </Button>
                </NextLink>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Stripe-Style Bento Grid: Modular Business Solutions */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
          <div className="space-y-3">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Enterprise Modularity
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Flexible solutions for every commerce model
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Equip your brand with modular customer infrastructure. Activate agentic triage, automated dispute resolution, and cross-channel sync—designed to work independently or orchestrated together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Agentic Commerce */}
            <Card className="md:col-span-2 border-border/80 bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4 max-w-lg z-10 relative">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none font-medium">
                  Autonomous Workflow
                </Badge>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Monetize & retain through agentic customer support
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Turn support tickets into revenue opportunities. When shoppers report sizing or compatibility questions, Gemini cross-references live catalog feeds to propose alternatives and issue instant exchange vouchers.
                </p>
              </div>

              {/* Visualized mock chat widget inside card */}
              <div className="mt-8 bg-background/90 border border-border/80 rounded-2xl p-5 space-y-3 shadow-lg max-w-md backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>Agentic Recommendation Stream</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/60 text-xs text-foreground space-y-1">
                  <p className="font-semibold text-primary">Live Resolution Event #EV-4820</p>
                  <p className="text-muted-foreground">Detected request for lossless DJ stems. Order #SW-10492 validated via REST gateway. Generated temporary high-bandwidth download token.</p>
                </div>
              </div>
            </Card>

            {/* Bento Card 2: Multi-Store Identity */}
            <Card className="border-border/80 bg-card rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Unified Shopper Graph</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Map customer identities across Shopify, custom Next.js storefronts, and mobile apps into one persistent history thread.
                </p>
              </div>
              <div className="pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">Sync latency: &lt;50ms</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> 99.99% Uptime
                </span>
              </div>
            </Card>

            {/* Bento Card 3: Deterministic Safety */}
            <Card className="border-border/80 bg-card rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Hallucination Firewall</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Deterministic tool gating ensures the AI never promises discounts, ships unverified orders, or breaches merchant SLA boundaries.
                </p>
              </div>
              <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Zero Database SDK Leakage</span>
              </div>
            </Card>

            {/* Bento Card 4: Global Webhook Network */}
            <Card className="md:col-span-2 border-border/80 bg-gradient-to-br from-card via-card to-sky-500/5 rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-3 max-w-lg">
                <Badge className="bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 border-none font-medium">
                  Distributed Event Bus
                </Badge>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  Enterprise Webhooks & SendGrid Inbound Relay
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  SendGrid inbound parse webhooks parse reply-to tokens and route email customer responses directly into active chat threads.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground">POST /api/webhooks/sendgrid</span>
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground">HMAC-SHA256 Signatures</span>
                <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground">Idempotent Replay Buffer</span>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. Developer & Architecture Section: Stripe-Style Code Tabs */}
        <section className="relative overflow-hidden py-32 border-y border-border/70 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 relative z-10">
            <div className="space-y-3">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
                Developer Architecture
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Designed for developers. Engineered for mission-critical scale.
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Integrate any ecommerce storefront or ERP in minutes. Order events, fulfillment statuses, and customer conversations synchronize over deterministic REST and webhook boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Architecture Highlights */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex gap-4 items-start p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Tenant-Isolated Execution Boundaries</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      AI tool calls are scoped to the active tenant ID. An agent resolving SoundWave inquiries cannot access or query FreshCart records.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Stateless Enterprise Cloud Deployment</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Zero local disk or native runtime lock-in. Fully decoupled architectures deploy natively to Google Cloud Run and high-availability serverless containers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Omnichannel Asynchronous Email Relay</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Integrated SendGrid inbound parse webhooks process customer email responses, maintain conversation states, and trigger AI resolutions transparently.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <NextLink href="/outbox">
                    <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs border-border px-4 bg-background">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Inspect System Outbox & Webhooks</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </NextLink>
                </div>
              </div>

              {/* Right: Interactive Code Window with shadcn Tabs */}
              <div className="lg:col-span-7">
                <Tabs defaultValue="orders" className="w-full">
                  <Card className="border-border/80 bg-zinc-950 text-zinc-100 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 bg-zinc-900 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                        <span className="ml-2 text-xs font-mono text-zinc-400">tdretail-sdk.ts</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <TabsList className="bg-zinc-800/90 text-zinc-400 p-0.5 rounded-xl border border-zinc-700/50">
                          <TabsTrigger value="orders" className="text-xs font-mono py-1 px-3 data-active:bg-zinc-700 data-active:text-sky-300">
                            POST /orders
                          </TabsTrigger>
                          <TabsTrigger value="webhooks" className="text-xs font-mono py-1 px-3 data-active:bg-zinc-700 data-active:text-sky-300">
                            Inbound Webhook
                          </TabsTrigger>
                          <TabsTrigger value="conversations" className="text-xs font-mono py-1 px-3 data-active:bg-zinc-700 data-active:text-sky-300">
                            AI Resolution
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    <CardContent className="p-6 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
                      <TabsContent value="orders" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 1. Sync external order from standalone merchant to TD Retail</span>
                          {'\n'}
                          <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;https://api.tdretail.com/v1/orders&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                          {'  '}headers: {'{ '}<span className="text-emerald-300">&apos;Authorization&apos;</span>: <span className="text-emerald-300">&apos;Bearer td_sec_live_9921&apos;</span>{' },\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_soundwave_01&apos;</span>,{'\n'}
                          {'    '}orderId: <span className="text-emerald-300">&apos;ORD-SW-9021&apos;</span>,{'\n'}
                          {'    '}items: [<span className="text-emerald-300">&apos;Lossless Studio Master (WAV)&apos;</span>],{'\n'}
                          {'    '}licenseKey: <span className="text-emerald-300">&apos;SW-LIC-9921-X&apos;</span>,{'\n'}
                          {'    '}fulfillmentStatus: <span className="text-emerald-300">&apos;completed&apos;</span>{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>

                      <TabsContent value="webhooks" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 2. Inbound SendGrid webhook routing with token authentication</span>
                          {'\n'}
                          <span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span>(request: Request) {'{\n'}
                          {'  '}<span className="text-purple-400">const</span> formData = <span className="text-purple-400">await</span> request.<span className="text-blue-400">formData</span>();{'\n'}
                          {'  '}<span className="text-purple-400">const</span> replyToken = <span className="text-blue-400">extractToken</span>(formData.<span className="text-blue-400">get</span>(<span className="text-emerald-300">&apos;to&apos;</span>));{'\n'}
                          {'  '}<span className="text-purple-400">const</span> resolution = <span className="text-purple-400">await</span> tdEngine.<span className="text-blue-400">processCustomerResponse</span>({'{ \n'}
                          {'    '}threadToken: replyToken,{'\n'}
                          {'    '}body: formData.<span className="text-blue-400">get</span>(<span className="text-emerald-300">&apos;text&apos;</span>),{'\n'}
                          {'    '}groundedVerification: <span className="text-sky-300">true</span>{'\n'}
                          {'  }'});{'\n'}
                          {'  '}<span className="text-purple-400">return</span> Response.<span className="text-blue-400">json</span>({'{ success: true }'});{'\n'}
                          {'}'}
                        </pre>
                      </TabsContent>

                      <TabsContent value="conversations" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 3. Initiate autonomous customer resolution session</span>
                          {'\n'}
                          <span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;https://api.tdretail.com/v1/conversations&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_soundwave_01&apos;</span>,{'\n'}
                          {'    '}customerId: <span className="text-emerald-300">&apos;cust_sarah_01&apos;</span>,{'\n'}
                          {'    '}intent: <span className="text-emerald-300">&apos;fulfillment_license_inquiry&apos;</span>{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>
                    </CardContent>
                  </Card>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Customer Success & Testimonials Carousel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
                Customer Success & Impact
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Validated by high-velocity retail operations
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                See how multi-brand operators eliminate backlog, reduce first-response times, and protect merchant trust.
              </p>
            </div>
          </div>

          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <div className="flex justify-end gap-2 mb-4">
              <CarouselPrevious className="relative inset-auto translate-y-0" />
              <CarouselNext className="relative inset-auto translate-y-0" />
            </div>
            <CarouselContent className="-ml-4">
              {/* Testimonial 1 */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/80 bg-card p-6 flex flex-col justify-between rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;Before TD Retail, reconciling digital audio license queries took our support agents 8 minutes each. Now, Gemini checks the ledger and issues stem download links in seconds.&rdquo;
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                      SW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Marcus Vance</p>
                      <p className="text-[11px] text-muted-foreground">Head of Commerce, SoundWave Digital</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>

              {/* Testimonial 2 */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/80 bg-card p-6 flex flex-col justify-between rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;Cold chain delivery inquiries cannot wait for tomorrow morning. Having instant geofence ETA updates automated by grounded AI saved our customer retention rate.&rdquo;
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 text-sm">
                      FC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Elena Rostova</p>
                      <p className="text-[11px] text-muted-foreground">VP Operations, FreshCart Direct</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>

              {/* Testimonial 3 */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/80 bg-card p-6 flex flex-col justify-between rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;The SendGrid email reply sync is magical. Our shoppers reply from Apple Mail or Gmail without touching a web widget, and the session context never drops.&rdquo;
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">
                      AL
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Devon Chen</p>
                      <p className="text-[11px] text-muted-foreground">Lead Architect, AeroLogix Network</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>

        {/* 7. Case Study Impact Numbers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="space-y-2 md:pr-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={74} suffix="%" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">First-Contact Resolution</h4>
                <p className="text-xs text-muted-foreground">
                  Customer issues resolved by AI tools without needing human operator escalation.
                </p>
              </div>

              <div className="space-y-2 pt-6 md:pt-0 md:px-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={8} prefix="-" suffix="x" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">Average Handle Time</h4>
                <p className="text-xs text-muted-foreground">
                  Automated order ledger queries eliminate manual database lookup delays.
                </p>
              </div>

              <div className="space-y-2 pt-6 md:pt-0 md:pl-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={99} suffix=".9%" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">Tool Precision Reliability</h4>
                <p className="text-xs text-muted-foreground">
                  Rigorous JSON schema validation on every Google Gemini tool call execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Stripe-Style News & Platform Updates */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
                Latest Updates
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Product News & Architecture Releases
              </h2>
            </div>
            <NextLink href="/outbox">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                <span>View Changelog</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/80 bg-card hover:border-primary/50 transition-colors rounded-2xl p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Engine v2.4</span>
                  <span>October 2026</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Zero-Copy Digital License Distribution</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Support agents can now distribute cryptographically signed master stem links with expiry timestamps directly in conversation replies.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Read technical spec</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Card>

            <Card className="border-border/80 bg-card hover:border-primary/50 transition-colors rounded-2xl p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Webhooks</span>
                  <span>September 2026</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Inbound Parse Multi-Store Parsing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reply-to token hashing now resolves merchant boundaries automatically without storing raw customer emails on local disk.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>View integration guide</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Card>

            <Card className="border-border/80 bg-card hover:border-primary/50 transition-colors rounded-2xl p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Security</span>
                  <span>August 2026</span>
                </div>
                <h3 className="text-base font-bold text-foreground">SOC2 Compliant Cloud Run Sandbox</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fully stateless container execution ensuring compliance for enterprise high-value digital storefronts and retail hubs.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Learn about compliance</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Card>
          </div>
        </section>

        {/* 9. Enterprise FAQ Accordion (Modeled after Stripe.com FAQ) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Enterprise FAQ
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Frequently asked architectural questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Common questions about multi-tenant security, Gemini tool grounding, and webhook dispatch.
            </p>
          </div>

          <Accordion className="w-full bg-card/60 backdrop-blur border border-border/80 rounded-2xl shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                How does TD Retail prevent cross-tenant data leakage?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                Every customer interaction initiates with a verified tenant context. All tool declarations sent to Google Gemini strictly inject the session&apos;s <code>merchantId</code> into function execution parameters, guaranteeing that queries cannot inspect or mutate records belonging to any other merchant storefront.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                How is hallucination avoided during order inquiries?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                The AI model has no direct database access and is instructed with negative constraints. Whenever order status, fulfillment tracking, or license keys are referenced, Gemini is required to invoke deterministic server-side tools (<code>lookupOrderStatus</code>, <code>executeOrderAction</code>) and ground its final response exclusively on the validated JSON payload.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                Can human operators intervene during automated sessions?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                Yes. The Unified Operations Console provides a live overview of all active sessions. Support personnel can view real-time transcript streaming, pause autonomous responses with one click, and send operator replies directly into the chat thread or email channel.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                How does asynchronous email reply threading work?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                Outbound emails from TD Retail generate signed reply-to aliases with embedded session hashes. When a customer replies using their standard email client, SendGrid Inbound Parse posts the raw MIME payload to our webhook, which matches the token, appends the response to the conversation history, and invokes the autonomous resolution loop.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* 10. Production Reliability & SLA Assurance */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Card className="border-border/80 bg-card/90 shadow-md rounded-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Enterprise Architecture & Compliance Standards</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Architected for enterprise security, multi-tenant isolation, and high availability on Google Cloud infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">Multi-Tenant Isolation</span>
                    <p className="text-[11px] text-muted-foreground">
                      Strict boundary isolation ensures customer and store data never crosses merchant silos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">Deterministic Function Calling</span>
                    <p className="text-[11px] text-muted-foreground">
                      Strict schema validation on tools lookupOrderStatus and executeOrderAction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">Stateless Elastic Scaling</span>
                    <p className="text-[11px] text-muted-foreground">
                      Designed for serverless container auto-scaling with zero persistent local disk coupling.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 11. Stripe-Style Floating "Chat Now" Customer Support Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Dialog open={chatOpen} onOpenChange={setChatOpen}>
            <DialogTrigger
              render={
                <Button
                  size="lg"
                  className="h-12 px-5 rounded-full shadow-2xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border border-border flex items-center gap-2.5 font-semibold transition-all hover:scale-105"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Chat now</span>
                </Button>
              }
            />

            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border border-border shadow-2xl bg-card">
              <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-sm">
                    TD
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none">TD Retail Global Support</h3>
                    <p className="text-[11px] text-primary-foreground/80 mt-1">Autonomous Customer Desk • Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Log Body */}
              <div className="p-4 space-y-3 max-h-80 min-h-64 overflow-y-auto bg-muted/30 text-xs">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-xs'
                          : 'bg-card border border-border text-foreground rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendSupportMessage} className="p-3 border-t border-border flex items-center gap-2 bg-card">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask TD Retail support anything..."
                  className="flex-1 bg-muted/60 border border-border text-xs rounded-full px-4 py-2.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
                <Button type="submit" size="sm" className="rounded-full h-9 w-9 p-0 bg-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}



