'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ModernAppShell } from '@/components/ModernAppShell';
import { Sparkles, MessageSquare, Mail, Terminal, Disc, ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide global navbar and footer on chat pages, inbox, and outbox
  const isFullAppPage =
    pathname?.startsWith('/chat') ||
    pathname?.startsWith('/inbox') ||
    pathname?.startsWith('/outbox');

  if (isFullAppPage) {
    return (
      <ModernAppShell>
        {children}
      </ModernAppShell>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-0">{children}</main>

      {/* Stripe-Grade Enterprise Footer */}
      <footer className="border-t border-border/70 bg-card/60 backdrop-blur-md relative overflow-hidden">
        {/* Subtle glow nebula in footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shadow-xs">
                  TD
                </div>
                <span className="font-bold text-base tracking-tight text-foreground">
                  TD Retail Platform
                </span>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  v2.5 Gemini Flash
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Next-generation conversational AI infrastructure for multi-merchant digital and physical commerce. Grounded tool execution, tenant boundary isolation, and seamless SendGrid email replies.
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Systems Operational
                </span>
                <span>•</span>
                <span>Cloud Run Ready</span>
              </div>
            </div>

            {/* Navigation Column 1: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <NextLink href="/chat/conv_music_01" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Interactive Chat
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/inbox" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    Consolidated Inbox
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/outbox" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    Email Outbox
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/outbox" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <Terminal className="h-3 w-3" />
                    Webhook Simulator
                  </NextLink>
                </li>
              </ul>
            </div>

            {/* Navigation Column 2: Connected Merchants */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Merchants
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_MUSIC_MERCHANT_URL || 'http://localhost:3001'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Disc className="h-3 w-3 text-primary" />
                    SoundWave Digital
                    <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                  </a>
                </li>
                <li>
                  <NextLink href="/chat/conv_music_01" className="hover:text-foreground transition-colors">
                    Lossless Audio & Stems
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/chat/conv_grocery_01" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                    <ShoppingBag className="h-3 w-3 text-primary" />
                    FreshCart Direct
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/chat/conv_grocery_01" className="hover:text-foreground transition-colors">
                    Organic Cold-Chain
                  </NextLink>
                </li>
              </ul>
            </div>

            {/* Navigation Column 3: Architecture & Security */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Security & Tech
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  Tenant Data Isolation
                </li>
                <li>Google Gemini 2.5 Flash</li>
                <li>SendGrid Inbound Parse</li>
                <li>Next.js 16 App Router</li>
                <li>Tailwind CSS & shadcn/ui</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} TD Retail Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">API Reference</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Suspense fallback={<main className="h-screen w-screen bg-background flex flex-col">{children}</main>}>
        <ShellContent>{children}</ShellContent>
      </Suspense>
    </TooltipProvider>
  );
}
