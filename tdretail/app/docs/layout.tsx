import React from 'react';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TDLogo } from '@/components/TDLogo';
import {
  Sparkles,
  ArrowLeft,
  Server,
  MessageSquare,
  Building2,
  Code2,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Documentation & Developer Reference | TD Retail',
  description:
    'Comprehensive REST API specifications, Google Gemini AI agent tool calling schemas, SendGrid webhooks, and storefront SDK guides for TD Retail.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Dedicated Stripe-Style Developer Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Section Badge */}
          <div className="flex items-center gap-3">
            <NextLink href="/" className="flex items-center group cursor-pointer">
              <TDLogo size="sm" showWordmark />
            </NextLink>
            <span className="text-muted-foreground/40 font-light text-lg">/</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Developers</span>
              <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0.5">
                v1.0 (REST)
              </Badge>
            </div>
          </div>

          {/* Right Navigation & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NextLink href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to</span> Platform
              </Button>
            </NextLink>

            <NextLink href="/inbox">
              <Button variant="outline" size="sm" className="hidden md:flex gap-1.5 text-xs border-border bg-card">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span>Unified Inbox</span>
              </Button>
            </NextLink>

            <NextLink href="/merchant">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 text-xs border-border bg-card">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Merchant Portal</span>
              </Button>
            </NextLink>

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-muted/60 border border-border">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-muted-foreground">asia-southeast1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Sticky Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <DocsSidebar />
          </div>

          {/* Main Content Area */}
          <main className="lg:col-span-9 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
