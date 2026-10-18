'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Sparkles,
  Disc,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Bot,
  Play,
  Clock,
  Check,
  Radio,
  FileCode2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type StoreKey = 'soundwave' | 'voltnest' | 'platform';

interface StoreData {
  name: string;
  category: string;
  port: string;
  orderId: string;
  orderItem: string;
  status: string;
  toolCalled: string;
  toolResult: Record<string, any>;
  customerQuery: string;
  aiResponse: string;
}

const STORE_CONFIGS: Record<StoreKey, StoreData> = {
  soundwave: {
    name: 'SoundWave Digital',
    category: 'Lossless Audio & Digital Rights',
    port: '3001',
    orderId: 'ORD-MUS-8821',
    orderItem: 'Starlight Master Stems (24-bit 96kHz FLAC)',
    status: 'delivered',
    toolCalled: 'lookupOrderStatus(orderId: "ORD-MUS-8821", merchantId: "merchant_music")',
    toolResult: {
      orderId: 'ORD-MUS-8821',
      status: 'delivered',
      downloadUrl: 'https://vault.soundwave.store/stems/dl_mus_8821_sig',
      licenseKey: 'SW-PRO-8821-X9K2',
      courierNotes: 'Vault master keys confirmed active on blockchain ledger.',
    },
    customerQuery: 'Where can I access my lossless master stems and studio license?',
    aiResponse:
      'Verified in order #ORD-MUS-8821. Your lossless 24-bit studio stems are unlocked in your digital vault. Your verified license key is SW-PRO-8821-X9K2, and your temporary high-bandwidth download link has been generated with 48h validity.',
  },
  voltnest: {
    name: 'Volt Nest',
    category: 'Smart Hardware & GaN Chargers',
    port: '3002',
    orderId: 'ORD-VOLT-9021',
    orderItem: 'VoltCore Pro 100W GaN Charger',
    status: 'out_for_delivery',
    toolCalled: 'lookupOrderStatus(orderId: "ORD-VOLT-9021", merchantId: "merchant_b")',
    toolResult: {
      orderId: 'ORD-VOLT-9021',
      status: 'out_for_delivery',
      trackingNumber: 'TRK-VOLT-88192',
      carrier: 'Express Logistics Ground',
      courierNotes: 'Driver assigned to express morning route; delivery window 14:00 - 16:30.',
    },
    customerQuery: 'Is my VoltCore charger out for delivery today?',
    aiResponse:
      'Yes, order #ORD-VOLT-9021 is currently Out for Delivery via Express Logistics Ground (Tracking #TRK-VOLT-88192). The courier notes indicate the driver is on the morning express run with an estimated delivery window between 14:00 and 16:30.',
  },
  platform: {
    name: 'TD Platform Support',
    category: 'Enterprise Cloud & Multi-Tenant Relay',
    port: '3000',
    orderId: 'SUBSCR-ENT-001',
    orderItem: 'Stateless Enterprise Cloud Node (asia-southeast1)',
    status: 'active',
    toolCalled: 'verifyTenantIsolation(merchantId: "merchant_platform")',
    toolResult: {
      cluster: 'asia-southeast1',
      activeTenants: ['merchant_music', 'merchant_b'],
      firewall: 'HMAC_SHA256_VERIFIED',
      uptimeSla: '99.99%',
    },
    customerQuery: 'How does TD Retail ensure our customer data is isolated between stores?',
    aiResponse:
      'TD Retail isolates all tenant operations via cryptographic merchant token boundaries. Every incoming REST request and tool execution strictly checks the caller merchant context, ensuring store records, order ledgers, and conversation states are mathematically segregated with zero cross-tenant bleeding.',
  },
};

const LIVE_EVENTS = [
  { time: '12:04:18', text: 'Order #ORD-VOLT-9021 synced from Volt Nest Storefront', status: 'sync' },
  { time: '12:04:19', text: 'Tool lookupOrderStatus invoked: 184ms deterministic roundtrip', status: 'tool' },
  { time: '12:04:20', text: 'Digital license key SW-PRO-8821 verified in customer vault', status: 'security' },
  { time: '12:04:22', text: 'SendGrid inbound webhook payload HMAC signature verified', status: 'webhook' },
  { time: '12:04:25', text: 'Autonomous resolution dispatched to guest session (0 hallucinations)', status: 'ai' },
];

export function LiveConsoleShowcase() {
  const [selectedStore, setSelectedStore] = useState<StoreKey>('soundwave');
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const currentStore = STORE_CONFIGS[selectedStore];

  // Rotate events periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="relative rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-3 sm:p-5 shadow-2xl shadow-indigo-500/10 overflow-hidden text-left">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-border/70 bg-muted/30 rounded-2xl mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
          </div>
          <span className="font-mono text-xs font-semibold text-foreground">
            tdretail.platform/live-operations
          </span>
          <Badge variant="outline" className="text-[10px] py-0 px-2 font-mono text-emerald-500 border-emerald-500/30 hidden sm:inline-flex">
            Live Stream
          </Badge>
        </div>

        {/* Store Switcher Tabs */}
        <div className="flex items-center gap-1 bg-background/90 p-1 rounded-xl border border-border/80">
          <button
            type="button"
            onClick={() => setSelectedStore('soundwave')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStore === 'soundwave'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Disc className="h-3 w-3" />
            <span>SoundWave</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStore('voltnest')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStore === 'voltnest'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="h-3 w-3" />
            <span>Volt Nest</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStore('platform')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStore === 'platform'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Platform</span>
          </button>
        </div>
      </div>

      {/* Main Console Body: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Live Grounded Conversation & Tool Execution Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3.5 shadow-xs">
            {/* Thread Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">{currentStore.name}</span>
                <span className="text-[11px] text-muted-foreground">({currentStore.category})</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono">
                Port {currentStore.port}
              </Badge>
            </div>

            {/* Customer Message */}
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0">
                SC
              </div>
              <div className="p-3 rounded-2xl bg-muted/60 text-xs text-foreground leading-relaxed max-w-[90%]">
                <p className="font-semibold text-[11px] text-muted-foreground mb-1">Customer Inquiry</p>
                {currentStore.customerQuery}
              </div>
            </div>

            {/* Verified Tool Call Execution Badge */}
            <div className="my-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  <span>Tool Execution: {currentStore.toolCalled}</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/30">
                  Grounded 184ms
                </Badge>
              </div>

              {showJsonInspector ? (
                <pre className="p-2 rounded bg-zinc-950 text-zinc-300 font-mono text-[10px] overflow-x-auto leading-tight">
                  {JSON.stringify(currentStore.toolResult, null, 2)}
                </pre>
              ) : (
                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Verified state: {currentStore.orderItem}</span>
                  <button
                    type="button"
                    onClick={() => setShowJsonInspector(true)}
                    className="text-primary hover:underline font-mono text-[10px] cursor-pointer"
                  >
                    View JSON Payload &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Grounded Response */}
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground leading-relaxed max-w-[90%] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[11px] text-primary">
                  <span>Autonomous Resolution Specialist</span>
                  <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Zero Hallucinations
                  </span>
                </div>
                <p className="text-muted-foreground">{currentStore.aiResponse}</p>
              </div>
            </div>

            {/* Interactive Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="h-7 px-3 text-xs rounded-full border-border bg-card hover:bg-muted cursor-pointer gap-1.5"
                >
                  <RefreshCw className={`h-3 w-3 text-primary ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Validating Tool...' : 'Re-verify Order'}</span>
                </Button>

                {showJsonInspector && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowJsonInspector(false)}
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Close JSON
                  </Button>
                )}
              </div>

              <NextLink
                href={`/chat/new?merchantId=${selectedStore === 'voltnest' ? 'merchant_b' : selectedStore === 'platform' ? 'merchant_platform' : 'merchant_music'}`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Launch live thread</span>
                <ArrowRight className="h-3 w-3" />
              </NextLink>
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Stream Ticker & Telemetry Stats */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Live Event Stream Card */}
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3 shadow-xs flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>Live Event Stream</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">SSE &bull; active</span>
            </div>

            <div className="space-y-2">
              {LIVE_EVENTS.map((ev, i) => {
                const isActive = i === activeEventIndex;
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-primary/10 border-primary/40 shadow-xs'
                        : 'bg-muted/30 border-border/60 opacity-70'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground mt-0.5 shrink-0">
                      {ev.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] leading-tight ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {ev.text}
                      </p>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Telemetry Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border text-center space-y-0.5">
              <div className="text-base sm:text-lg font-black text-foreground">&lt;240ms</div>
              <p className="text-[10px] text-muted-foreground font-medium">Deterministic Latency</p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border text-center space-y-0.5">
              <div className="text-base sm:text-lg font-black text-emerald-500">99.4%</div>
              <p className="text-[10px] text-muted-foreground font-medium">Tool Precision</p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border text-center space-y-0.5">
              <div className="text-base sm:text-lg font-black text-primary">0</div>
              <p className="text-[10px] text-muted-foreground font-medium">Hallucinations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
