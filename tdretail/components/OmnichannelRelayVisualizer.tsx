'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Play,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RELAY_STEPS = [
  {
    step: 1,
    title: 'Customer Email Reply',
    icon: Mail,
    detail: 'Customer replies from Apple Mail or Gmail to reply+conv_music_01@inbound.tdretail.store',
    badge: 'MIME Ingest',
  },
  {
    step: 2,
    title: 'SendGrid Inbound Parse',
    icon: Send,
    detail: 'Webhook triggers POST /api/webhooks/sendgrid with HMAC-SHA256 signature verification',
    badge: 'Webhook Event',
  },
  {
    step: 3,
    title: 'Token & Session Hashing',
    icon: ShieldCheck,
    detail: 'Extracts session hash, binds to conversation conv_music_01, and isolates caller merchantId',
    badge: 'Security Verified',
  },
  {
    step: 4,
    title: 'AI Tool Grounding',
    icon: Cpu,
    detail: 'Invokes lookupOrderStatus on verified ledger without hallucinating download or order status',
    badge: 'Grounded 184ms',
  },
  {
    step: 5,
    title: 'Dispatched Outbox Response',
    icon: Inbox,
    detail: 'Customer receives email reply with permanent vault link and thread continuation token',
    badge: 'Audited Outbox',
  },
];

export function OmnichannelRelayVisualizer() {
  const [activeStep, setActiveStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateRelay = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          return 5;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-background/95 border border-border shadow-lg space-y-4 text-left">
      {/* Header & Trigger */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Omnichannel Asynchronous Relay Bus
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleSimulateRelay}
          disabled={isSimulating}
          className="h-7 px-2.5 text-[11px] rounded-full gap-1.5 border-border bg-card hover:bg-muted cursor-pointer"
        >
          <Play className={`h-3 w-3 text-primary ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Relaying...' : 'Simulate Email Reply'}</span>
        </Button>
      </div>

      {/* Stepper Grid */}
      <div className="space-y-2">
        {RELAY_STEPS.map((s) => {
          const isCurrent = s.step === activeStep;
          const isCompleted = s.step < activeStep;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                isCurrent
                  ? 'bg-primary/10 border-primary/50 shadow-xs'
                  : isCompleted
                  ? 'bg-muted/40 border-border/70 text-foreground'
                  : 'bg-muted/20 border-border/40 opacity-60'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.step}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-[11px] ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                    {s.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono py-0 px-1">
                    {s.badge}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {s.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Live Status Note */}
      <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span>Zero email storage on local disk</span>
        </span>
        <span className="font-mono text-primary font-semibold">HMAC-SHA256</span>
      </div>
    </div>
  );
}
