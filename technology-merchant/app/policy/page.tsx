'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  Zap,
  CheckCircle2,
  Clock,
  Mail,
  ArrowLeft,
  Headphones,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function PolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2">
        <NextLink href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Button>
        </NextLink>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/50 text-primary">
            Volt Nest • Merchant B
          </Badge>
          <Badge variant="secondary">Customer Protection</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Warranty, Replacement & Support Policy
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Clear, transparent support terms for all Volt Nest tech accessories and smart gadgets.
        </p>
      </div>

      <Separator />

      {/* Grid of Key Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 10-Day Replacement */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="space-y-2 p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <RefreshCw className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">10-Day Replacement Policy</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Defective or dead-on-arrival accessories are replaced without hassle.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-xs text-muted-foreground space-y-2.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Eligible for hardware failure, charging defects, or physical transit damage within 10 days of delivery.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Doorstep courier pickup scheduled within 24–48 hours upon approval.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Brand-new replacement dispatched immediately upon inspection.</span>
            </div>
          </CardContent>
        </Card>

        {/* 1-Year Warranty */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="space-y-2 p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">1-Year Hardware Warranty</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Comprehensive electronic and component coverage against manufacturing flaws.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-xs text-muted-foreground space-y-2.5">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Covers GaN charging circuitry, battery cells, monitor displays, and Thunderbolt controllers.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Warranty auto-activated upon order confirmation; no paper registration required.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Covers repair or complete replacement if repair is unfeasible.</span>
            </div>
          </CardContent>
        </Card>

        {/* Refunds */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="space-y-2 p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <RotateCcw className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">Refund Timelines</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Fast automated credit processing following returned package verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-xs text-muted-foreground space-y-2.5">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Inspection completed within 1–2 business days of warehouse receipt.</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Refund processed within 3–5 business days to original payment method.</span>
            </div>
          </CardContent>
        </Card>

        {/* AI & Human Support */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="space-y-2 p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Headphones className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">TD Retail AI Resolution Engine</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Instant 24/7 conversational assistance directly embedded in your order dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-xs text-muted-foreground space-y-2.5">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Instant order status queries, courier tracking, and warranty checks.</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Automated escalation to human specialists when policy exceptions arise.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Box */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Have questions about an existing purchase?</h3>
          <p className="text-xs text-muted-foreground">View your order details or launch the support chat directly.</p>
        </div>
        <div className="flex items-center gap-2">
          <NextLink href="/orders">
            <Button size="sm" className="gap-1.5 text-xs">
              <Zap className="h-3.5 w-3.5" />
              <span>View My Orders</span>
            </Button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
