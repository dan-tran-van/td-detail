'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Disc,
  Zap,
  Server,
  Lock,
  Database,
  Mail,
  Cpu,
  ArrowRight,
  Code2,
  CheckCircle2,
  Activity,
  Boxes,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NodeId = 'music' | 'tech' | 'gateway' | 'ai' | 'database' | 'sendgrid';

interface NodeDetail {
  title: string;
  subtitle: string;
  type: string;
  payload: string;
  security: string;
}

const NODE_DETAILS: Record<NodeId, NodeDetail> = {
  music: {
    title: 'SoundWave Digital Storefront',
    subtitle: 'External Music Storefront (SoundWave)',
    type: 'External Merchant A',
    payload: `// Synchronized from SoundWave Digital
POST /api/orders
{
  "merchantId": "merchant_music",
  "orderId": "ORD-MUS-8821",
  "customerEmail": "sarah.connor@example.com",
  "items": [{ "name": "Starlight FLAC Master", "price": 49.99 }],
  "orderStatus": "delivered"
}`,
    security: 'Bound to merchant_music token scope. Cannot query Merchant B.',
  },
  tech: {
    title: 'Volt Nest Storefront',
    subtitle: 'External Consumer Tech Storefront (Volt Nest)',
    type: 'External Merchant B',
    payload: `// Synchronized from Volt Nest
POST /api/orders
{
  "merchantId": "merchant_b",
  "orderId": "ORD-VOLT-9021",
  "customerEmail": "alex.chen@example.com",
  "items": [{ "name": "VoltCore 100W GaN", "price": 89.99 }],
  "orderStatus": "out_for_delivery"
}`,
    security: 'Bound to merchant_b token scope. Strict boundary check on PATCH.',
  },
  gateway: {
    title: 'TD Retail Central REST Gateway',
    subtitle: 'Cloud Run Cluster (asia-southeast1)',
    type: 'Multi-Tenant Controller',
    payload: `// Gateway Enforcement
x-merchant-id: verified
Session: td_customer_session (HTTP-Only)
Rate-Limit: 10,000 req/min
CORS: Origin Whitelist (localhost + Cloud Run)`,
    security: 'Zero database SDK exposure to client. All queries strictly routed through server-side models.',
  },
  ai: {
    title: 'Grounded Resolution Engine',
    subtitle: 'Google Gemini 3.5 Flash Lite + Tools',
    type: 'Autonomous Core',
    payload: `// Declarative Tool Calling
tools: [
  lookupOrderStatus({ orderId, merchantId }),
  requestHumanEscalation({ reason, priority })
]
Grounding: 100% verified against database ledger`,
    security: 'Deterministic negative constraints: AI cannot fabricate order statuses or process refunds directly.',
  },
  database: {
    title: 'Firestore & Customer Vault',
    subtitle: 'Stateless Enterprise Cloud Store',
    type: 'Persistent State',
    payload: `// Partitioned Tenancy
/merchants/{merchantId}
/orders/{orderId} [scoped to merchantId]
/conversations/{convId} [scoped to merchantId]
/vault/licenses/{keyId}`,
    security: 'Row-level and collection-level isolation. Multi-tenant orders never cross query boundaries.',
  },
  sendgrid: {
    title: 'SendGrid Omnichannel Relay',
    subtitle: 'Inbound Parse & Tokenized Reply-To',
    type: 'Bidirectional Mail Bus',
    payload: `// Inbound Webhook Payload
POST /api/webhooks/sendgrid
To: reply+conv_music_01@inbound.tdretail.store
From: sarah.connor@example.com
Signature: HMAC-SHA256 (verified)`,
    security: 'Embedded session hash resolves thread context securely without storing plain customer email on local disk.',
  },
};

export function MultiTenantPipeline() {
  const [activeNode, setActiveNode] = useState<NodeId>('gateway');
  const selectedDetail = NODE_DETAILS[activeNode];

  return (
    <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl space-y-6 text-left">
      {/* Top Description & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Interactive Multi-Tenant Architecture Pipeline</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click any node below to inspect cryptographic isolation boundaries and real-time REST payloads.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-muted-foreground">Deterministic REST Relay Active</span>
        </div>
      </div>

      {/* Visual Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Map (Columns 1-7) */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-4 relative overflow-hidden">
            {/* Storefront Layer */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <span>1. Participating Storefronts (Decoupled Frontends)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveNode('music')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activeNode === 'music'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Disc className="h-4 w-4 text-indigo-500" />
                    <Badge variant="outline" className="text-[9px] font-mono">Digital Audio</Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">SoundWave Digital</p>
                  <p className="text-[10px] text-muted-foreground">Digital Rights & Stems</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNode('tech')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    activeNode === 'tech'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Zap className="h-4 w-4 text-cyan-500" />
                    <Badge variant="outline" className="text-[9px] font-mono">Smart Tech</Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">Volt Nest</p>
                  <p className="text-[10px] text-muted-foreground">Hardware & Fast Chargers</p>
                </button>
              </div>
            </div>

            {/* Central Animated Gateway Connector */}
            <div className="relative py-1">
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-primary to-cyan-500 relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-3 h-3 rounded-full bg-primary animate-ping" />
                <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-3 h-3 rounded-full bg-cyan-400 animate-ping delay-150" />
              </div>
            </div>

            {/* Gateway & AI Resolution Core */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <span>2. Central Gateway & AI Resolution Core</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveNode('gateway')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeNode === 'gateway'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Server className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/30">
                      Cloud Run
                    </Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">Central Gateway</p>
                  <p className="text-[10px] text-muted-foreground">Multi-Tenant Firewall</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNode('ai')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeNode === 'ai'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Cpu className="h-4 w-4 text-sky-500" />
                    <Badge variant="outline" className="text-[9px] font-mono">Tools</Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">AI Tool Engine</p>
                  <p className="text-[10px] text-muted-foreground">gemini-3.5-flash-lite</p>
                </button>
              </div>
            </div>

            {/* State & Omnichannel Relay Layer */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <span>3. Verified State & Omnichannel Relay</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveNode('database')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeNode === 'database'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Database className="h-4 w-4 text-emerald-500" />
                    <Badge variant="outline" className="text-[9px] font-mono">Ledger</Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">Firestore & Vault</p>
                  <p className="text-[10px] text-muted-foreground">Row-Level Tenant Isolation</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNode('sendgrid')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeNode === 'sendgrid'
                      ? 'bg-primary/10 border-primary shadow-sm scale-101'
                      : 'bg-background hover:bg-muted/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Mail className="h-4 w-4 text-purple-500" />
                    <Badge variant="outline" className="text-[9px] font-mono">Webhook</Badge>
                  </div>
                  <p className="font-bold text-xs text-foreground">SendGrid Relay</p>
                  <p className="text-[10px] text-muted-foreground">HMAC Signed Reply-To</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Inspector Flyout (Columns 8-12) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-100 border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-zinc-200">
                  Node Telemetry Inspector
                </span>
              </div>
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-mono">
                {selectedDetail.type}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{selectedDetail.title}</h4>
              <p className="text-[11px] text-zinc-400">{selectedDetail.subtitle}</p>
            </div>

            {/* Code Payload Window */}
            <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed overflow-x-auto max-h-56">
              {selectedDetail.payload}
            </pre>

            {/* Security Guarantee Box */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{selectedDetail.security}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
