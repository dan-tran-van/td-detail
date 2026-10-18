'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ModernAppShell } from '@/components/ModernAppShell';
import { Sparkles, MessageSquare, Mail, Terminal, Disc, ShoppingBag, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { resolveStorefrontUrl } from '@/lib/storefrontConfig';

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatAppPage =
    pathname?.startsWith('/chat') ||
    pathname?.startsWith('/inbox');

  if (isChatAppPage) {
    return (
      <ModernAppShell>
        {children}
      </ModernAppShell>
    );
  }

  // The Outbox has its own full-screen standalone mail client layout (own topbar, navigation, persona switcher)
  if (pathname?.startsWith('/outbox')) {
    return (
      <main className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </main>
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
                    Email Delivery (SendGrid)
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
                    href={resolveStorefrontUrl('music')}
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
                  <a
                    href={resolveStorefrontUrl('technology')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="h-3 w-3 text-primary" />
                    Volt Nest Storefront
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
              </ul>
            </div>

            {/* Navigation Column 3: Developer Platform & API */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Developers
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <NextLink href="/docs" className="hover:text-foreground transition-colors flex items-center gap-1.5 font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    API Reference
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/docs/merchants" className="hover:text-foreground transition-colors">
                    Merchants & Policies
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/docs/orders" className="hover:text-foreground transition-colors">
                    Orders & Fulfillment
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/docs/conversations" className="hover:text-foreground transition-colors">
                    Gemini AI Agent
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/docs/webhooks" className="hover:text-foreground transition-colors">
                    Webhooks & SendGrid
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/docs/sdk" className="hover:text-foreground transition-colors">
                    Storefront SDK
                  </NextLink>
                </li>
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
              <NextLink href="/docs" className="hover:text-foreground transition-colors text-primary font-medium">
                API Documentation
              </NextLink>
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
