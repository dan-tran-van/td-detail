'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  HelpCircle,
  Bot,
  Mail,
  Server,
  Layers,
  Calculator,
  ExternalLink,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ShinyText from '@/components/ShinyText';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [inquiries, setInquiries] = useState(3000);
  const [handleTime, setHandleTime] = useState(8);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Dynamic calculations
  const resolvedAutonomously = Math.round(inquiries * 0.74);
  const minutesSaved = resolvedAutonomously * handleTime;
  const hoursSaved = Math.round(minutesSaved / 60);
  const estimatedCostSaved = Math.round(hoursSaved * 28); // $28/hr avg support specialist cost

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col space-y-28 pb-32 pt-28 sm:pt-36 bg-background text-foreground">
      {/* 1. Hero Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-card shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <ShinyText
            text="Transparent Architecture • Free Open Beta"
            className="text-xs font-semibold"
            speed={3}
          />
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            Predictable pricing for every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600">
              stage of commerce.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
            Start completely free with zero credit card required. Join the shared customer support network, connect your external storefronts with total data sovereignty, and evaluate autonomous resolutions on live orders.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs">
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-full border border-border">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>Annual Billing</span>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono text-emerald-500 font-bold">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three Tier Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Developer Beta (CURRENT ACTIVE TIER) */}
          <Card className="border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/5 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-primary-foreground font-mono text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
              Active Beta Tier
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-xs uppercase font-bold text-primary mb-2">
                  Developer & Open Beta
                </Badge>
                <h3 className="text-2xl font-black text-foreground">Free Evaluation</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Everything you need to integrate, test, and evaluate autonomous operations on live storefronts.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-foreground">$0</span>
                <span className="text-sm text-muted-foreground font-medium">/ month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/60 text-xs">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">Included Capabilities:</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Free merchant onboarding (<code className="font-mono text-[10px]">/merchant/register</code>)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Up to 1,000 automated tool resolutions / mo</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Full REST API (<code className="font-mono text-[10px]">/api/orders</code>, <code className="font-mono text-[10px]">/api/merchants</code>)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>SendGrid outbox audit & webhook simulation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Human escalation console & customer handoff</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Zero credit card required</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <NextLink href="/merchant/register">
                <Button className="w-full h-12 rounded-full font-semibold gap-2 bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-all hover:scale-102 cursor-pointer">
                  <span>Start Free Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </NextLink>
            </div>
          </Card>

          {/* Card 2: Growth (PLANNED COMMERCIAL TIER) */}
          <Card className="border border-border/80 bg-card rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="text-xs uppercase font-bold text-muted-foreground mb-2">
                  Roadmap Q1 2027
                </Badge>
                <h3 className="text-2xl font-black text-foreground">Growth Brand</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For expanding merchants requiring high-volume resolution, custom email domains, and SLA tiering.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-foreground">
                  {billingCycle === 'annual' ? '$79' : '$99'}
                </span>
                <span className="text-sm text-muted-foreground font-medium">/ month (Planned)</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/60 text-xs">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">Planned Features:</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Up to 25,000 automated resolutions / mo</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Custom SendGrid inbound domain routing</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Multi-agent routing with custom policy engines</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>99.9% uptime SLA guarantee</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Priority queue execution in Cloud Run</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-border bg-background hover:bg-muted cursor-pointer">
                      <span>Join Planned Waitlist</span>
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-md p-6 rounded-3xl border border-border bg-card">
                  <DialogHeader className="space-y-2 text-left">
                    <DialogTitle className="text-xl font-bold">Growth Tier Priority Waitlist</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Be the first notified when custom domain inbound routing and expanded volume tiers go live in Q1 2027.
                    </DialogDescription>
                  </DialogHeader>

                  {waitlistSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Check className="h-4 w-4" /> You are on the waitlist!
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        We will notify you at {waitlistEmail} when the Growth tier opens. In the meantime, your free evaluation tier remains unrestricted.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Your Work Email</label>
                        <input
                          type="email"
                          required
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          placeholder="merchant@yourbrand.com"
                          className="w-full h-10 px-3.5 rounded-xl border border-border bg-muted/40 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground font-semibold cursor-pointer">
                        Confirm Waitlist Spot
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          {/* Card 3: Enterprise Cluster (PLANNED ENTERPRISE TIER) */}
          <Card className="border border-border/80 bg-card rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="text-xs uppercase font-bold text-muted-foreground mb-2">
                  Enterprise Cloud
                </Badge>
                <h3 className="text-2xl font-black text-foreground">Dedicated Cluster</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Isolated Cloud Run fleets with customized prompt grounding and dedicated platform engineering.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-foreground">Custom</span>
                <span className="text-sm text-muted-foreground font-medium">/ SLA tailored</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/60 text-xs">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">Enterprise Specifications:</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Unlimited automated resolutions & store tenants</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Dedicated Cloud Run container cluster</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Custom Gemini tool declarations & prompt rules</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>SOC2 Type II compliance audit reports</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>24/7 dedicated platform engineer & 99.99% SLA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <NextLink href="/chat/new?merchantId=merchant_platform">
                <Button variant="outline" className="w-full h-12 rounded-full font-semibold border-border bg-background hover:bg-muted cursor-pointer gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Contact Platform Team</span>
                </Button>
              </NextLink>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Interactive ROI & Operational Value Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-lg space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
              Operational Impact Calculator
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Calculate your team&apos;s automated time savings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Adjust your monthly support volume and manual resolution time to estimate the hours reclaimed with TD Retail autonomous tool triage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Sliders (Columns 1-7) */}
            <div className="md:col-span-7 space-y-6">
              {/* Slider 1: Inquiries */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Monthly Customer Inquiries</span>
                  <span className="font-mono text-primary text-sm font-bold">{inquiries.toLocaleString()} tickets</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={inquiries}
                  onChange={(e) => setInquiries(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>500</span>
                  <span>10,000</span>
                  <span>25,000+</span>
                </div>
              </div>

              {/* Slider 2: Handle Time */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Average Manual Handle Time</span>
                  <span className="font-mono text-primary text-sm font-bold">{handleTime} minutes</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="1"
                  value={handleTime}
                  onChange={(e) => setHandleTime(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>3 mins (simple lookup)</span>
                  <span>10 mins</span>
                  <span>20 mins (complex dispute)</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Card (Columns 8-12) */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-zinc-950 text-zinc-100 border border-zinc-800 space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Estimated Monthly Value</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ${estimatedCostSaved.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Reclaimed labor value
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Hours Saved / Month:</span>
                  <span className="font-bold text-white font-mono">{hoursSaved.toLocaleString()} hrs</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span>Autonomous Triage Rate:</span>
                  <span className="font-bold text-white font-mono">74%</span>
                </div>

                <div className="flex items-center justify-between text-zinc-300">
                  <span>First-Response Time:</span>
                  <span className="font-bold text-emerald-400 font-mono">&lt;240ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Comparison Matrix */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
            Capabilities Matrix
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Compare platform features across tiers
          </h2>
        </div>

        <div className="rounded-2xl border border-border/80 overflow-hidden bg-card/60 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Feature & Infrastructure</th>
                <th className="py-3 px-4 font-bold text-primary">Developer Beta ($0)</th>
                <th className="py-3 px-4 font-bold text-foreground">Growth ($99 - Planned)</th>
                <th className="py-3 px-4 font-bold text-foreground">Enterprise Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">Merchant Storefronts</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Unlimited</td>
                <td className="py-3 px-4 text-muted-foreground">Unlimited</td>
                <td className="py-3 px-4 text-muted-foreground">Unlimited Dedicated</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">Tool Grounded Resolutions</td>
                <td className="py-3 px-4 text-foreground font-semibold">1,000 / mo</td>
                <td className="py-3 px-4 text-muted-foreground">25,000 / mo</td>
                <td className="py-3 px-4 text-muted-foreground">Unlimited</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">Multi-Tenant Isolation</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Strict Boundary</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Strict Boundary</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Dedicated Container</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">SendGrid Email Webhook Relay</td>
                <td className="py-3 px-4 text-foreground font-semibold">Full Audit & Sim</td>
                <td className="py-3 px-4 text-muted-foreground">Custom Domains</td>
                <td className="py-3 px-4 text-muted-foreground">Dedicated IP Whitelist</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">Human Specialist Escalation</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Included</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Multi-User Seats</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">SSO & RBAC</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">Deployment Cluster</td>
                <td className="py-3 px-4 text-foreground font-mono">asia-southeast1</td>
                <td className="py-3 px-4 text-muted-foreground font-mono">Global Cloud Run</td>
                <td className="py-3 px-4 text-muted-foreground font-mono">Multi-Region Isolated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Enterprise FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary">
            Billing FAQ
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Frequently asked questions about plans & beta access
          </h2>
        </div>

        <Accordion className="w-full bg-card/60 backdrop-blur border border-border/80 rounded-2xl shadow-sm">
          <AccordionItem value="item-network">
            <AccordionTrigger className="text-base font-semibold px-6 py-5">
              How does TD Retail compare to traditional platforms like Zendesk or Gorgias?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              Unlike traditional customer-support platforms that help each merchant manage its own support inbox, we&apos;re building a <strong>shared customer-facing support network</strong>: customers access one unified platform across multiple merchants, while each merchant retains control over its own data, workflows, and AI intelligence. Participating stores gain access to a unified customer nexus without giving up proprietary data boundaries or paying exorbitant per-seat helpdesk fees.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-semibold px-6 py-5">
              Is TD Retail really free to use today?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              Yes, 100%. During our open evaluation period, participating merchants can register their storefronts via <code>/merchant/register</code> with zero credit card or subscription payment required. All REST APIs, order synchronization, and AI resolution tools are fully functional.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-semibold px-6 py-5">
              Will I be charged when commercial tiers launch?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              No. Stores registered during the beta period will be grandfathered into generous ongoing free developer allocations. Commercial tiers with higher resolution volumes will only apply if you explicitly upgrade.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base font-semibold px-6 py-5">
              Do I need a credit card to onboard an external store?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              Zero payment information is requested during onboarding. Simply provide your store name, category, support policies, and staff credentials to begin syncing orders.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base font-semibold px-6 py-5">
              How is tenant data segregated between competing brands?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
              Every request carries verified merchant headers. Data from SoundWave Digital can never be inspected or queried by Volt Nest sessions. Tools execute with strict tenant scoping in the central gateway.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
