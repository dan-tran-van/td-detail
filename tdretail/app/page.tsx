'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Disc,
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
  ArrowUpRight,
  Database,
  Building2,
  Network,
  Webhook,
  Boxes,
  HelpCircle,
  Star,
  Send,
  Users,
  Check,
  CreditCard,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from '@/lib/types';
import DotGrid from '@/components/DotGrid';
import ShinyText from '@/components/ShinyText';
import CountUp from '@/components/CountUp';
import TiltedCard from '@/components/TiltedCard';
import { LiveConsoleShowcase } from '@/components/LiveConsoleShowcase';
import { MultiTenantPipeline } from '@/components/MultiTenantPipeline';
import { OmnichannelRelayVisualizer } from '@/components/OmnichannelRelayVisualizer';
import { resolveStorefrontUrl } from '@/lib/storefrontConfig';

export default function LandingPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Floating Support Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmittingChat, setIsSubmittingChat] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Hello! Welcome to TD Retail Platform Support. Ask me anything about our multi-storefront architecture, SLAs, or enterprise subscription tiers.",
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

  const sendSupportPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || isSubmittingChat) return;
    const userText = textToSend.trim();
    setChatMessage('');
    setChatLog((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setIsSubmittingChat(true);

    try {
      if (!activeConversationId) {
        // Create new conversation under merchant_platform
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantId: 'merchant_platform',
            subject: 'Platform Support & Plans',
            initialMessage: userText,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const conv = data.conversation;
          if (conv?.id) {
            setActiveConversationId(conv.id);
          }
          const aiMsg = data.messages?.find((m: any) => m.sender === 'agent' || m.sender === 'assistant') || data.aiMessage;
          const replyText =
            aiMsg?.content ||
            aiMsg?.text ||
            "Thank you for contacting TD Retail Support! Our autonomous resolution engine is grounded on our active platform SLAs and subscription documentation.";

          setChatLog((prev) => [
            ...prev,
            { sender: 'agent', text: replyText, time: 'Just now' },
          ]);
        } else {
          throw new Error('Failed to create support thread');
        }
      } else {
        // Append message to existing conversation
        const res = await fetch(`/api/conversations/${activeConversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: userText,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const replyText =
            data.aiMessage?.content ||
            data.aiMessage?.text ||
            "Thank you for your response. Our team and resolution engine are monitoring this thread.";

          setChatLog((prev) => [
            ...prev,
            { sender: 'agent', text: replyText, time: 'Just now' },
          ]);
        } else {
          throw new Error('Failed to send message');
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: "We received your message! You can also view this thread and manage live responses directly in the Unified Operations Console.",
          time: 'Just now',
        },
      ]);
    } finally {
      setIsSubmittingChat(false);
    }
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendSupportPrompt(chatMessage);
  };

  return (
    <TooltipProvider delay={100}>
      <div className="flex-1 flex flex-col space-y-36 pb-36 relative">
        {/* 1. Flagship Stripe-Inspired Hero Section */}
        <section className="relative overflow-hidden pt-28 sm:pt-36 md:pt-44 pb-32 border-b border-border/70 bg-background">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
                maskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 40%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 25%, black 40%, transparent 100%)',
              }}
            />

            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] md:w-[1300px] h-[580px] bg-gradient-to-r from-blue-700/20 via-indigo-600/20 to-sky-600/20 blur-3xl rounded-full opacity-70" />
            <div className="absolute top-10 left-1/8 w-[450px] h-[350px] bg-blue-500/10 blur-3xl rounded-full" />
            <div className="absolute top-8 right-1/8 w-[460px] h-[360px] bg-sky-500/10 blur-3xl rounded-full" />

            {/* Preserved Interactive Hero Background Canvas */}
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

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
            {/* Clickable Stripe-Style Release Banner */}
            <div className="inline-flex justify-center">
              <NextLink
                href="/pricing"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-background/80 shadow-xs backdrop-blur hover:bg-muted/70 transition-all group cursor-pointer"
              >
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-bold text-primary bg-primary/10 border-0">
                  Free Beta
                </Badge>
                <span className="text-xs font-medium text-foreground">
                  Autonomous Multi-Merchant Resolution Engine Now Live
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </NextLink>
            </div>

            {/* Headline & Description */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.08] drop-shadow-xs">
                Autonomous customer operations for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600">
                  modern enterprise commerce.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
                Unified AI service infrastructure for multi-brand retail ecosystems. Seamlessly orchestrate real-time order lookups, automated fulfillment actions, and multi-tenant workflows with zero hallucinations.
              </p>
            </div>

            {/* Stripe-Grade Focused Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <NextLink href="/chat/new?merchantId=merchant_music">
                <Button size="lg" className="h-12 px-7 rounded-full gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-95 transition-all hover:scale-102 cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  <span>Launch Live Agent Demo</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </NextLink>

              <NextLink href="/pricing">
                <Button variant="outline" size="lg" className="h-12 px-6 rounded-full gap-2 border-border backdrop-blur bg-background/80 hover:bg-muted font-medium text-foreground cursor-pointer">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>View Plans & Pricing</span>
                </Button>
              </NextLink>

              <NextLink href="/docs" className="sm:ml-2">
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors py-2 cursor-pointer">
                  <span>API Reference</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </NextLink>
            </div>

            {/* Interactive Hero Showcase (Replaced Static Image with LiveConsoleShowcase) */}
            <div className="pt-6 max-w-5xl mx-auto">
              <LiveConsoleShowcase />
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
                <TooltipContent>Strict tool-based facts: the engine never invents order IDs or states.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <div className="space-y-1 cursor-help group text-center">
                      <div className="text-3xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                        <CountUp to={2} prefix="" suffix=" Stores" duration={1} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                        <span>Connected Storefronts</span>
                        <HelpCircle className="h-3 w-3 opacity-60" />
                      </p>
                    </div>
                  }
                />
                <TooltipContent>Independent external storefronts federated into a single tenant controller.</TooltipContent>
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

            {/* Active Enterprise Session Indicator & Sandbox Utility */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Enterprise Session:</span>
                <span className="font-semibold text-foreground">{customer?.name || 'Sarah Connor'}</span>
                <span className="font-mono text-[11px] text-muted-foreground">({customer?.email || 'sarah.connor@example.com'})</span>
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={handleResetData}
                disabled={isResetting}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${isResetting ? 'animate-spin' : ''}`} />
                <span>Reset Sandbox Seed</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Stripe-Style Logo Cloud: Trusted by Leading Modern Brands */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Powering customer operations across global multi-merchant networks
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-75 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Disc className="h-4 w-4 text-sky-500" />
                <span className="font-bold text-sm tracking-tight text-foreground">SoundWave</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-sm tracking-tight text-foreground">Volt Nest</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-bold text-sm tracking-tight text-foreground">TD Platform</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Boxes className="h-4 w-4 text-purple-500" />
                <span className="font-bold text-sm tracking-tight text-foreground">PulseAudio</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Network className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-sm tracking-tight text-foreground">HyperSync</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border/60 shadow-xs">
                <Server className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-sm tracking-tight text-foreground">Cloud Fleet</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Connected Merchant Ecosystem: Multi-Merchant Control Plane with 3D TiltedCards */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Merchant 1: SoundWave Digital Music */}
            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.02}
              glare={0.3}
              radius={24}
              showTooltip={false}
              className="h-full"
            >
              <Card className="h-full border-border/80 bg-card shadow-md hover:border-primary/60 transition-all flex flex-col justify-between overflow-hidden relative group rounded-3xl">
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
                          Lossless Audio & Digital Rights
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      Digital
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Autonomous support for digital storefronts. The resolution engine identifies customer purchases, validates license authenticity, delivers secure stem download links, and resolves key activation issues in real-time.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      POST /api/orders
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      License Verification
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      Zero-Copy Stems
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex gap-3">
                  <NextLink href="/chat/new?merchantId=merchant_music" className="flex-1">
                    <Button className="w-full rounded-full gap-2 bg-primary text-primary-foreground font-medium shadow-sm cursor-pointer">
                      <Play className="h-4 w-4" />
                      <span>Agent Chat</span>
                    </Button>
                  </NextLink>

                  <a
                    href={resolveStorefrontUrl('music')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-full gap-2 border-border font-medium bg-background hover:bg-muted cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                      <span>Storefront</span>
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </TiltedCard>

            {/* Merchant 2: Volt Nest (Smart Hardware) */}
            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.02}
              glare={0.3}
              radius={24}
              showTooltip={false}
              className="h-full"
            >
              <Card className="h-full border-border/80 bg-card shadow-md hover:border-primary/60 transition-all flex flex-col justify-between overflow-hidden relative group rounded-3xl">
                <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                <CardHeader className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Volt Nest
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">
                          Smart Tech & Fast Chargers
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      Hardware
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Next-generation electronics customer experience. Autonomous support delivers live warranty verification, expedited RMA returns tracking, and intelligent technical troubleshooting.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      2-Yr Warranty
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      RMA Tracking
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      POST /api/merchants
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex gap-3">
                  <NextLink href="/chat/new?merchantId=merchant_b" className="flex-1">
                    <Button className="w-full rounded-full gap-2 bg-primary text-primary-foreground font-medium shadow-sm cursor-pointer">
                      <Play className="h-4 w-4" />
                      <span>Agent Chat</span>
                    </Button>
                  </NextLink>

                  <a
                    href={resolveStorefrontUrl('technology')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-full gap-2 border-border font-medium bg-background hover:bg-muted cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                      <span>Storefront</span>
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </TiltedCard>

            {/* Merchant 3: TD Retail Platform Support */}
            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.02}
              glare={0.3}
              radius={24}
              showTooltip={false}
              className="h-full"
            >
              <Card className="h-full border-border/80 bg-card shadow-md hover:border-primary/60 transition-all flex flex-col justify-between overflow-hidden relative group rounded-3xl">
                <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
                <CardHeader className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          TD Platform Support
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">
                          Architecture, Plans & Enterprise SLAs
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      Platform
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Official support desk and technical consultation for TD Retail multi-tenant infrastructure, enterprise subscription tiers, dynamic merchant onboarding, and developer APIs.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      Subscription Tiers
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      SLA Guarantees
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-mono text-[11px]">
                      Multi-Tenant Bounds
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex gap-3">
                  <NextLink href="/chat/new?merchantId=merchant_platform" className="flex-1">
                    <Button className="w-full rounded-full gap-2 bg-primary text-primary-foreground font-medium shadow-sm cursor-pointer">
                      <Play className="h-4 w-4" />
                      <span>Platform Chat</span>
                    </Button>
                  </NextLink>

                  <NextLink href="/inbox" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full gap-2 border-border font-medium bg-background hover:bg-muted cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      <span>Unified Inbox</span>
                    </Button>
                  </NextLink>
                </CardContent>
              </Card>
            </TiltedCard>
          </div>
        </section>

        {/* 4. Interactive Multi-Tenant Architecture Pipeline (Replaced Static Flow Image) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              System Topography
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Tenant-Isolated Execution Boundaries & Relay Pipeline
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              External storefronts interface with TD Retail strictly through decoupled REST and webhook protocols. AI tool calls and customer conversations are cryptographically bound to caller merchant identities.
            </p>
          </div>

          <MultiTenantPipeline />
        </section>

        {/* 5. Stripe-Style Bento Grid: Modular Business Solutions (Replaced Static Graphic with OmnichannelRelayVisualizer) */}
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
                  Monetize & retain through autonomous customer operations
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Turn support tickets into retention opportunities. When shoppers report sizing, license, or compatibility questions, the support engine cross-references live catalog feeds to propose alternatives and issue instant solutions.
                </p>
              </div>

              {/* Visualized mock chat widget inside card */}
              <div className="mt-8 bg-background/90 border border-border/80 rounded-2xl p-5 space-y-3 shadow-lg max-w-md backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  <span>Autonomous Recommendation Stream</span>
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
                  Map customer identities across external storefronts, custom Next.js frontends, and mobile channels into one persistent history thread.
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
                  Deterministic tool gating ensures the AI engine never promises unauthorized discounts, mutates unverified orders, or breaches merchant SLA boundaries.
                </p>
              </div>
              <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Zero Database SDK Leakage</span>
              </div>
            </Card>

            {/* Bento Card 4: Global Webhook & Email Relay with Interactive Visualizer */}
            <Card className="md:col-span-2 border-border/80 bg-gradient-to-br from-card via-card to-sky-500/5 rounded-3xl p-8 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-6 space-y-3">
                  <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-500/30 border-none font-medium">
                    Distributed Event Bus
                  </Badge>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Enterprise Webhooks & SendGrid Inbound Relay
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    SendGrid inbound parse webhooks extract reply-to tokens and route email customer responses directly into active chat threads with zero context loss.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground">POST /api/webhooks/sendgrid</span>
                    <span className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground">HMAC-SHA256 Signatures</span>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <OmnichannelRelayVisualizer />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 6. Developer & Architecture Section: Stripe-Style Code Tabs */}
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
                      AI tool calls are scoped to the active tenant ID. An agent resolving SoundWave inquiries cannot access or query Volt Nest records.
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
                      Zero local disk or native runtime lock-in. Decoupled architectures deploy natively to Google Cloud Run containers in asia-southeast1.
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

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <NextLink href="/docs">
                    <Button size="sm" className="rounded-full gap-2 text-xs bg-primary text-primary-foreground px-4 shadow-sm font-semibold hover:opacity-90 transition-all hover:scale-102 cursor-pointer">
                      <Code2 className="h-3.5 w-3.5" />
                      <span>Explore Interactive API Reference</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </NextLink>

                  <NextLink href="/outbox">
                    <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs border-border px-4 bg-background cursor-pointer">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Inspect Audited Outbox</span>
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
                        <span className="ml-2 text-xs font-mono text-zinc-400">tdretail-rest-api.ts</span>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto">
                        <TabsList className="bg-zinc-950/80 p-1 rounded-xl border border-zinc-800 text-zinc-400">
                          <TabsTrigger
                            value="orders"
                            className="text-[11px] font-mono py-1 px-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white transition-colors"
                          >
                            POST /orders
                          </TabsTrigger>
                          <TabsTrigger
                            value="patch"
                            className="text-[11px] font-mono py-1 px-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white transition-colors"
                          >
                            PATCH /orders/:id
                          </TabsTrigger>
                          <TabsTrigger
                            value="merchants"
                            className="text-[11px] font-mono py-1 px-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white transition-colors"
                          >
                            POST /merchants
                          </TabsTrigger>
                          <TabsTrigger
                            value="conversations"
                            className="text-[11px] font-mono py-1 px-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white transition-colors"
                          >
                            POST /conversations
                          </TabsTrigger>
                          <TabsTrigger
                            value="webhooks"
                            className="text-[11px] font-mono py-1 px-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 data-active:bg-zinc-800 data-active:text-white transition-colors"
                          >
                            Inbound Webhook
                          </TabsTrigger>
                        </TabsList>
                      </div>
                    </div>

                    <CardContent className="p-6 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
                      {/* Tab 1: POST /orders */}
                      <TabsContent value="orders" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 1. Synchronize order from SoundWave or Volt Nest storefront</span>
                          {'\n'}
                          <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;/api/orders&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                          {'  '}headers: {'{ '}<span className="text-emerald-300">&apos;Content-Type&apos;</span>: <span className="text-emerald-300">&apos;application/json&apos;</span>{' },\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}orderId: <span className="text-emerald-300">&apos;ORD-VOLT-9021&apos;</span>,{'\n'}
                          {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_b&apos;</span>,{'\n'}
                          {'    '}customerEmail: <span className="text-emerald-300">&apos;alex.chen@example.com&apos;</span>,{'\n'}
                          {'    '}items: [{'{ name: '}<span className="text-emerald-300">&apos;VoltCore Pro 100W GaN&apos;</span>{', price: 89.99, quantity: 1 }'}],{'\n'}
                          {'    '}orderStatus: <span className="text-emerald-300">&apos;processing&apos;</span>{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>

                      {/* Tab 2: PATCH /orders/:id */}
                      <TabsContent value="patch" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 2. Update fulfillment status & courier tracking notes</span>
                          {'\n'}
                          <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;/api/orders/ORD-VOLT-9021&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;PATCH&apos;</span>,{'\n'}
                          {'  '}headers: {'{\n'}
                          {'    '}<span className="text-emerald-300">&apos;Content-Type&apos;</span>: <span className="text-emerald-300">&apos;application/json&apos;</span>,{'\n'}
                          {'    '}<span className="text-emerald-300">&apos;x-merchant-id&apos;</span>: <span className="text-emerald-300">&apos;merchant_b&apos;</span> <span className="text-zinc-500">// Tenant boundary check</span>{'\n'}
                          {'  }'},{'\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}orderStatus: <span className="text-emerald-300">&apos;out_for_delivery&apos;</span>,{'\n'}
                          {'    '}trackingNumber: <span className="text-emerald-300">&apos;TRK-VOLT-88192&apos;</span>,{'\n'}
                          {'    '}courierNotes: <span className="text-emerald-300">&apos;Driver assigned to express morning route.&apos;</span>{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>

                      {/* Tab 3: POST /merchants */}
                      <TabsContent value="merchants" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 3. Onboard merchant with ground-truth support policy</span>
                          {'\n'}
                          <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;/api/merchants&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                          {'  '}headers: {'{ '}<span className="text-emerald-300">&apos;Content-Type&apos;</span>: <span className="text-emerald-300">&apos;application/json&apos;</span>{' },\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}id: <span className="text-emerald-300">&apos;merchant_b&apos;</span>,{'\n'}
                          {'    '}name: <span className="text-emerald-300">&apos;Volt Nest&apos;</span>,{'\n'}
                          {'    '}category: <span className="text-emerald-300">&apos;tech_accessories&apos;</span>,{'\n'}
                          {'    '}supportPolicy: {'{ \n'}
                          {'      '}returns: <span className="text-emerald-300">&apos;10-day replacement on hardware defects.&apos;</span>,{'\n'}
                          {'      '}refunds: <span className="text-emerald-300">&apos;Covered under 1-Year Manufacturer Warranty.&apos;</span>,{'\n'}
                          {'      '}escalationThreshold: <span className="text-emerald-300">&apos;Tickets over $50 escalate to Senior Tech Support.&apos;</span>{'\n'}
                          {'    }'}{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>

                      {/* Tab 4: POST /conversations */}
                      <TabsContent value="conversations" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 4. Create support thread & trigger autonomous resolution engine</span>
                          {'\n'}
                          <span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-emerald-300">&apos;/api/conversations&apos;</span>, {'{\n'}
                          {'  '}method: <span className="text-emerald-300">&apos;POST&apos;</span>,{'\n'}
                          {'  '}body: <span className="text-blue-400">JSON.stringify</span>({'{ \n'}
                          {'    '}merchantId: <span className="text-emerald-300">&apos;merchant_music&apos;</span>,{'\n'}
                          {'    '}orderId: <span className="text-emerald-300">&apos;ORD-MUS-8821&apos;</span> <span className="text-zinc-500">// Grounds engine on verified order</span>,{'\n'}
                          {'    '}subject: <span className="text-emerald-300">&apos;Download link inquiry&apos;</span>,{'\n'}
                          {'    '}initialMessage: <span className="text-emerald-300">&apos;Where can I access my lossless master stems?&apos;</span>{'\n'}
                          {'  }'}),{'\n'}
                          {'}'});
                        </pre>
                      </TabsContent>

                      {/* Tab 5: Inbound Webhook */}
                      <TabsContent value="webhooks" className="mt-0">
                        <pre className="space-y-1">
                          <span className="text-zinc-500">// 5. SendGrid Inbound Parse Webhook (POST /api/webhooks/sendgrid)</span>
                          {'\n'}
                          <span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span>(request: Request) {'{\n'}
                          {'  '}<span className="text-purple-400">const</span> {'{ from, to, subject, text }'} = <span className="text-purple-400">await</span> request.<span className="text-blue-400">json</span>();{'\n'}
                          {'  '}<span className="text-zinc-500">// Extracts thread ID from tokenized recipient address</span>{'\n'}
                          {'  '}<span className="text-purple-400">const</span> result = <span className="text-purple-400">await</span> EmailService.<span className="text-blue-400">handleInboundEmail</span>({'{ from, to, subject, text }'});{'\n'}
                          {'  '}<span className="text-purple-400">return</span> Response.<span className="text-blue-400">json</span>({'{ success: true, aiReply: result.aiReply }'});{'\n'}
                          {'}'}
                        </pre>
                      </TabsContent>
                    </CardContent>

                    <CardFooter className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-xs font-sans">
                      <span className="text-zinc-400">Complete documentation with live interactive testing</span>
                      <NextLink href="/docs" className="text-primary hover:underline font-semibold flex items-center gap-1">
                        <span>Open API Docs Sandbox</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </NextLink>
                    </CardFooter>
                  </Card>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Customer Success & Testimonials Carousel */}
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
              {/* Testimonial 1: SoundWave Digital */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/80 bg-card p-6 flex flex-col justify-between rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;Before TD Retail, reconciling digital audio license queries took our support agents 8 minutes each. Now, the resolution engine checks the verified ledger and issues stem download links in seconds.&rdquo;
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

              {/* Testimonial 2: Volt Nest (Hardware) */}
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/80 bg-card p-6 flex flex-col justify-between rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      &ldquo;Hardware RMA inquiries and warranty coverage lookups happen instantaneously. Customer satisfaction scores jumped 34% within the first month of deployment.&rdquo;
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-sm">
                      VN
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Kaitlyn Zhao</p>
                      <p className="text-[11px] text-muted-foreground">Head of Customer Experience, Volt Nest</p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>

              {/* Testimonial 3: AeroLogix Network */}
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

        {/* 8. Case Study Impact Numbers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="space-y-2 md:pr-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={74} suffix="%" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">First-Contact Resolution</h4>
                <p className="text-xs text-muted-foreground">
                  Customer issues resolved autonomously without needing human operator escalation.
                </p>
              </div>

              <div className="space-y-2 pt-6 md:pt-0 md:px-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={8} prefix="-" suffix="x" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">Average Handle Time</h4>
                <p className="text-xs text-muted-foreground">
                  Automated order queries eliminate manual database lookup delays.
                </p>
              </div>

              <div className="space-y-2 pt-6 md:pt-0 md:pl-8">
                <div className="text-4xl sm:text-5xl font-black text-foreground">
                  <CountUp to={99} suffix=".9%" duration={1.5} />
                </div>
                <h4 className="text-base font-bold text-foreground">Tool Precision Reliability</h4>
                <p className="text-xs text-muted-foreground">
                  Rigorous JSON schema validation on every tool call execution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Stripe-Style News & Platform Updates */}
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
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                <span>View Audited Outbox</span>
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
                  Support specialists and automated workflows can now distribute cryptographically signed master stem links with expiry timestamps directly in conversation replies.
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

        {/* 10. Enterprise FAQ Accordion */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Enterprise FAQ
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Frequently asked architectural questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Common questions about multi-tenant security, tool grounding, and webhook dispatch.
            </p>
          </div>

          <Accordion className="w-full bg-card/60 backdrop-blur border border-border/80 rounded-2xl shadow-sm">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                How does TD Retail prevent cross-tenant data leakage?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                Every customer interaction initiates with a verified tenant context. All tool declarations sent to the autonomous resolution engine strictly inject the session&apos;s <code>merchantId</code> into function execution parameters, guaranteeing that queries cannot inspect or mutate records belonging to any other merchant storefront.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-semibold px-6 py-5">
                How is hallucination avoided during order inquiries?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                The resolution engine has no direct database access and is instructed with negative constraints. Whenever order status, fulfillment tracking, or license keys are referenced, the engine is required to invoke deterministic server-side tools (<code>lookupOrderStatus</code>, <code>requestHumanEscalation</code>) and ground its final response exclusively on the validated JSON payload.
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

        {/* 11. Production Reliability & Compliance Standards */}
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
                      Strict schema validation on tools lookupOrderStatus and requestHumanEscalation.
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

        {/* 12. Stripe-Grade Bottom Conversion Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card/90 to-background p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Ready to Deploy
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
              Automate customer operations for your storefront today.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Connect external storefronts via standardized REST APIs with zero persistent vendor lock-in. Active developer tier is 100% free with zero credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <NextLink href="/merchant/register">
                <Button size="lg" className="h-12 px-7 rounded-full gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-95 transition-all hover:scale-102 cursor-pointer">
                  <Store className="h-4 w-4" />
                  <span>Register Your Storefront Free</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </NextLink>
              <NextLink href="/pricing">
                <Button variant="outline" size="lg" className="h-12 px-6 rounded-full gap-2 border-border font-medium bg-background hover:bg-muted cursor-pointer">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>Compare All Plans</span>
                </Button>
              </NextLink>
              <NextLink href="/chat/new?merchantId=merchant_music">
                <Button variant="ghost" size="lg" className="h-12 px-6 rounded-full gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Try Demo Chat</span>
                </Button>
              </NextLink>
            </div>
          </div>
        </section>

        {/* 13. Stripe-Style Floating "Chat Now" Support Widget (Suggested prompt chips removed) */}
        <div className="fixed bottom-6 right-6 z-50">
          <Dialog open={chatOpen} onOpenChange={setChatOpen}>
            <DialogTrigger
              render={
                <Button
                  size="lg"
                  className="h-12 px-5 rounded-full shadow-2xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 border border-border flex items-center gap-2.5 font-semibold transition-all hover:scale-105 cursor-pointer"
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
                    <h3 className="font-bold text-sm leading-none">TD Retail Platform Support</h3>
                    <p className="text-[11px] text-primary-foreground/80 mt-1">Autonomous Customer Desk • Online</p>
                  </div>
                </div>

                {activeConversationId ? (
                  <NextLink
                    href={`/chat/${activeConversationId}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-foreground hover:underline bg-primary-foreground/10 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <span>Open in Inbox</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </NextLink>
                ) : (
                  <NextLink
                    href="/inbox"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-foreground hover:underline bg-primary-foreground/10 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <span>All Chats</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </NextLink>
                )}
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

                {isSubmittingChat && (
                  <div className="flex flex-col items-start">
                    <div className="p-3 rounded-2xl bg-card border border-border text-muted-foreground rounded-tl-xs shadow-xs flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Support Specialist is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Field (Suggested prompt chips removed) */}
              <form onSubmit={handleSendSupportMessage} className="p-3 border-t border-border flex items-center gap-2 bg-card">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask platform support anything..."
                  disabled={isSubmittingChat}
                  className="flex-1 bg-muted/60 border border-border text-xs rounded-full px-4 py-2.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingChat || !chatMessage.trim()}
                  className="rounded-full h-9 w-9 p-0 bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer"
                >
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
