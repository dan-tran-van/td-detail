'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Disc,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Store,
  RefreshCw,
  Terminal,
  Bot,
  Layers,
  Lock,
  Mail,
  Users,
  CheckCircle2,
  ChevronRight,
  Play,
  ArrowUpRight,
  Network,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TDLogo } from '@/components/TDLogo';
import { resolveStorefrontUrl } from '@/lib/storefrontConfig';

export default function BetaGuidePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<'sarah' | 'alex' | 'guest'>('sarah');
  const [personaLoading, setPersonaLoading] = useState(false);

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const switchPersona = async (persona: 'sarah' | 'alex' | 'guest') => {
    setPersonaLoading(true);
    setActivePersona(persona);
    try {
      const email =
        persona === 'sarah'
          ? 'sarah.connor@example.com'
          : persona === 'alex'
          ? 'alex.chen@example.com'
          : 'guest_evaluator@tdretail.guest';

      const customerId =
        persona === 'sarah'
          ? 'cust_sarah'
          : persona === 'alex'
          ? 'cust_alex'
          : `cust_guest_${Date.now().toString(36)}`;

      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, customerId, isGuest: persona === 'guest' }),
      });
    } catch (e) {
      console.warn('Failed to switch persona:', e);
    } finally {
      setPersonaLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-16 pb-28 pt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Header & Core Platform Differentiation */}
      <div className="space-y-6 text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-background shadow-xs">
          <TDLogo size="sm" />
          <span className="text-xs font-semibold text-foreground">
            TD Retail • Beta Architecture Guide
          </span>
          <Badge className="text-[9px] py-0 px-1.5 bg-primary text-primary-foreground font-bold">
            Interactive Roadmap
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          A Shared Customer Support Network for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600">
            Sovereign Merchants.
          </span>
        </h1>

        {/* Core Differentiation Thesis Box */}
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 text-left space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>The Shared Support Network Paradigm</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Unlike traditional customer-support platforms that help each merchant manage its own support inbox, we&apos;re building a <strong>shared customer-facing support network</strong>: customers access one unified platform across multiple merchants, while each merchant retains control over its own data, workflows, and AI intelligence.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Follow this 3-minute architectural walkthrough to test how central resolution federates two independent live storefronts (<strong>SoundWave Digital</strong> and <strong>Volt Nest</strong>) with cryptographic tenant isolation, zero-hallucination Gemini tool grounding, and bi-directional merchant fulfillment loops.
        </p>

        {/* 1-Click Evaluation Persona Switcher */}
        <div className="pt-2 p-4 rounded-2xl border border-border/80 bg-card shadow-sm text-left max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>Active Customer Persona (1-Click Switcher)</span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              {personaLoading ? 'Updating session...' : 'Bound via secure SSR cookies'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => switchPersona('sarah')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activePersona === 'sarah'
                  ? 'border-primary bg-primary/10 shadow-xs'
                  : 'border-border bg-background hover:bg-muted/60'
              }`}
            >
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Sarah Connor</span>
                {activePersona === 'sarah' && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Purchases across SoundWave & Volt</p>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('alex')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activePersona === 'alex'
                  ? 'border-primary bg-primary/10 shadow-xs'
                  : 'border-border bg-background hover:bg-muted/60'
              }`}
            >
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Alex Chen</span>
                {activePersona === 'alex' && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Hardware & Warranty Inquiries</p>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('guest')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activePersona === 'guest'
                  ? 'border-primary bg-primary/10 shadow-xs'
                  : 'border-border bg-background hover:bg-muted/60'
              }`}
            >
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Anonymous Guest</span>
                {activePersona === 'guest' && <Check className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Isolated session + 1-click claim</p>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Architectural Pillars (Clean, Professional Sections) */}
      <div className="space-y-12">
        {/* PILLAR 1: Sovereign Multi-Tenant Isolation */}
        <Card className="border-border/80 shadow-md bg-card overflow-hidden rounded-3xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600" />
          <CardHeader className="p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Architecture Pillar 1</span>
              </span>
              <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground border-border">
                Multi-Tenant Boundary Safety
              </Badge>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Sovereign Multi-Tenant Isolation & Store Boundaries
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              Two external storefronts—<strong>SoundWave Digital</strong> (lossless FLAC stems & music licenses) and <strong>Volt Nest</strong> (GaN chargers & consumer electronics)—are connected via REST to the central resolution engine. Data isolation is mathematically enforced at the server layer.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Site 1 Card */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Disc className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold text-xs text-foreground">SoundWave Digital</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono">Digital Audio</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Catalog of FLAC masters, stem licenses, and instant license key delivery. Orders synced via <code>POST /api/orders</code> under <code>merchant_music</code>.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a href={resolveStorefrontUrl('music')} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 bg-background">
                      <ExternalLink className="h-3 w-3" />
                      <span>Open Storefront</span>
                    </Button>
                  </a>
                  <NextLink href="/chat/new?merchantId=merchant_music" className="flex-1">
                    <Button size="sm" className="w-full text-xs gap-1.5 bg-primary text-primary-foreground">
                      <Play className="h-3 w-3" />
                      <span>Launch Chat</span>
                    </Button>
                  </NextLink>
                </div>
              </div>

              {/* Site 2 Card */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-500" />
                    <span className="font-bold text-xs text-foreground">Volt Nest</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono">Smart Hardware</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Catalog of GaN fast chargers, ANC earbuds, and 2-year warranty claims. Orders synced via <code>POST /api/orders</code> under <code>merchant_b</code>.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a href={resolveStorefrontUrl('technology')} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 bg-background">
                      <ExternalLink className="h-3 w-3" />
                      <span>Open Storefront</span>
                    </Button>
                  </a>
                  <NextLink href="/chat/new?merchantId=merchant_b" className="flex-1">
                    <Button size="sm" className="w-full text-xs gap-1.5 bg-primary text-primary-foreground">
                      <Play className="h-3 w-3" />
                      <span>Launch Chat</span>
                    </Button>
                  </NextLink>
                </div>
              </div>
            </div>

            {/* Verification Test */}
            <div className="p-4 rounded-2xl border border-border bg-muted/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Test Boundary Isolation in 30 Seconds:</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Open the <strong>SoundWave Digital</strong> chat and ask about a <strong>Volt Nest</strong> order (e.g., <code>#ORD-VOLT-9021</code>). The server-side tool execution strictly validates merchant context and rejects the query:
              </p>
              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-foreground">
                  &ldquo;What is the status of my Volt Nest order #ORD-VOLT-9021?&rdquo;
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyPrompt('prompt-isolation', 'What is the status of my Volt Nest order #ORD-VOLT-9021?')}
                  className="gap-1.5 text-xs shrink-0 cursor-pointer"
                >
                  {copiedId === 'prompt-isolation' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === 'prompt-isolation' ? 'Copied!' : 'Copy Prompt'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PILLAR 2: Zero-Hallucination Tool Grounding */}
        <Card className="border-border/80 shadow-md bg-card overflow-hidden rounded-3xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                <span>Architecture Pillar 2</span>
              </span>
              <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground border-border">
                Deterministic Gemini Function Calling
              </Badge>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Deterministic Tool Grounding & Dynamic Policy Engine
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              The underlying <strong>Google Gemini 3.5 Flash Lite</strong> agent cannot invent order IDs, tracking codes, or digital stems. Whenever an order inquiry is made, the agent executes verified tools (<code>lookupOrderStatus</code>) and dynamically quotes ground-truth support policies registered by the merchant.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Test Case A: Digital FLAC Stems */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Digital Stems & License Key Delivery</span>
                  <Badge variant="outline" className="text-[10px]">#ORD-MUSIC-1001</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sarah Connor purchased FLAC masters. The agent verifies purchase and returns live vault download link + cryptographic license key:
                </p>
                <div className="p-2.5 rounded-xl bg-background border border-border flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-foreground truncate">
                    Where is my order #ORD-MUSIC-1001 and my stems?
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyPrompt('prompt-flac', 'Where is my order #ORD-MUSIC-1001 and how do I download the FLAC stems?')}
                    className="h-7 px-2 text-xs shrink-0 cursor-pointer"
                  >
                    {copiedId === 'prompt-flac' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>

              {/* Test Case B: Physical Hardware Courier */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Courier Tracking & Gate Notes</span>
                  <Badge variant="outline" className="text-[10px]">#ORD-VOLT-9021</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Volt Nest physical delivery. Tool returns carrier (VoltExpress Logistics), tracking number, and courier driver gate notes:
                </p>
                <div className="p-2.5 rounded-xl bg-background border border-border flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-foreground truncate">
                    Where is order #ORD-VOLT-9021 and what is my tracking?
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyPrompt('prompt-volt', 'Where is order #ORD-VOLT-9021 and what is my courier tracking number?')}
                    className="h-7 px-2 text-xs shrink-0 cursor-pointer"
                  >
                    {copiedId === 'prompt-volt' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Dynamic Support Policy Grounding */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Hardcoding: Dynamic Ground-Truth Support Policies</span>
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When merchants register or update their support policies in the Merchant Portal (returns, refunds, warranties, fulfillment terms), the resolution engine reads them straight from the store record. Ask Volt Nest: <em>&ldquo;What is your warranty policy?&rdquo;</em> and it quotes the verified 2-year GaN coverage.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PILLAR 3: Bi-Directional Operations Loop */}
        <Card className="border-border/80 shadow-md bg-card overflow-hidden rounded-3xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <CardHeader className="p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" />
                <span>Architecture Pillar 3</span>
              </span>
              <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground border-border">
                Storefront ↔ Operations ↔ Chat Loop
              </Badge>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Bi-Directional Operations Loop: Live Mutation & Specialist Escalation
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              Updates in the <strong>Merchant Operations Portal</strong> immediately propagate to the Gemini resolution loop in real-time, while complex issues trigger automated specialist escalation.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mutation Loop */}
              <div className="p-4 rounded-2xl border border-border bg-muted/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Flow A: Live Order Mutation</span>
                </div>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Navigate to <NextLink href="/merchant/orders" className="text-primary hover:underline font-semibold">Merchant Orders</NextLink>.</li>
                  <li>Click <strong>&ldquo;Update Status&rdquo;</strong> on an order (e.g., mark as <code>out_for_delivery</code> and enter tracking <code>TRK-LIVE-EXPRESS</code>).</li>
                  <li>Return to customer chat and ask for the order status. The Gemini agent immediately cites the newly updated tracking code!</li>
                </ol>
                <NextLink href="/merchant/orders">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-1 bg-background">
                    <span>Open Merchant Orders Table</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </NextLink>
              </div>

              {/* Human Escalation Loop */}
              <div className="p-4 rounded-2xl border border-border bg-muted/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-foreground">Flow B: Specialist Escalation</span>
                </div>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
                  <li>In chat, state: <em>&ldquo;I need to escalate this to a supervisor for an exception.&rdquo;</em></li>
                  <li>The agent executes <code>requestHumanEscalation</code> and marks the ticket.</li>
                  <li>Open <NextLink href="/merchant/escalations" className="text-primary hover:underline font-semibold">Human Escalations</NextLink> to reply as a staff specialist. The reply appears instantly in the customer thread and outbox.</li>
                </ol>
                <NextLink href="/merchant/escalations">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-1 bg-background">
                    <span>Open Escalation Center</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </NextLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Technical Reference & Architecture Overview */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Platform Architecture Specification</h3>
            <p className="text-xs text-muted-foreground">Technical implementation summary across services</p>
          </div>
          <NextLink href="/docs">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>Full API Architecture Docs</span>
            </Button>
          </NextLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Gemini 3.5 Flash Lite</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Generous rate limits, low latency (&lt;240ms), strict tool calling schema.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Multi-Tenant REST</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Independent merchant storefronts synced via decoupled HTTP REST APIs.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>SSR Cookie Sessions</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Zero client auth hydration flicker; instantaneous 1-click evaluation switcher.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Cloud Run Production</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Stateless containerized auto-scaling deployment in asia-southeast1.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
