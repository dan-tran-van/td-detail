import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { Header } from '@/components/Header';
import { FloatingAISupport } from '@/components/FloatingAISupport';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Volt Nest • Modern Tech Accessories & Smart Gadgets (Merchant B)',
  description:
    'Premium tech accessories and smart gadgets storefront powered by TD Retail multi-merchant AI customer resolution platform. GaN chargers, earbuds, portable monitors, wearables and hubs.',
};

import { resolveTDRetailUrl, resolveMerchantId } from '@/lib/config';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtimeApiUrl = resolveTDRetailUrl();
  const runtimeMerchantId = resolveMerchantId();

  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TD_CONFIG = { tdRetailApiUrl: ${JSON.stringify(runtimeApiUrl)}, merchantId: ${JSON.stringify(runtimeMerchantId)} };`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <TooltipProvider>
          <VisitorProvider>
            <CartProvider>
              <OrderProvider>
                <Suspense fallback={<div className="h-16 w-full border-b border-border bg-background" />}>
                  <Header />
                </Suspense>
                <main className="flex-1 flex flex-col">{children}</main>
                <FloatingAISupport />
                <footer className="border-t border-border bg-card/60 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
                  <div className="max-w-7xl mx-auto space-y-8">
                    {/* Top Multi-column grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
                      <div className="space-y-3">
                        <div className="font-bold text-foreground tracking-wider uppercase text-[11px]">Hardware</div>
                        <ul className="space-y-2 text-muted-foreground">
                          <li><NextLink href="/#catalogue" className="hover:text-foreground transition-colors">Smart Wearables</NextLink></li>
                          <li><NextLink href="/#catalogue" className="hover:text-foreground transition-colors">Acoustic Audio</NextLink></li>
                          <li><NextLink href="/#catalogue" className="hover:text-foreground transition-colors">100W GaN Chargers</NextLink></li>
                          <li><NextLink href="/#catalogue" className="hover:text-foreground transition-colors">Thunderbolt Hubs</NextLink></li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="font-bold text-foreground tracking-wider uppercase text-[11px]">Support & Resolution</div>
                        <ul className="space-y-2 text-muted-foreground">
                          <li><NextLink href="/orders" className="hover:text-foreground transition-colors">Track Orders</NextLink></li>
                          <li><NextLink href="/policy" className="hover:text-foreground transition-colors">10-Day Replacement</NextLink></li>
                          <li><NextLink href="/policy" className="hover:text-foreground transition-colors">1-Year Warranty</NextLink></li>
                          <li><NextLink href="/outbox" className="hover:text-foreground transition-colors">Support Email Logs</NextLink></li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="font-bold text-foreground tracking-wider uppercase text-[11px]">Platform Architecture</div>
                        <ul className="space-y-2 text-muted-foreground">
                          <li><span className="text-muted-foreground">TD Retail Multi-Merchant</span></li>
                          <li><span className="text-muted-foreground">Gemini 3.5 Grounded AI</span></li>
                          <li><span className="text-muted-foreground">Synchronized Outbox</span></li>
                          <li><span className="text-muted-foreground">Cross-App REST Protocol</span></li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="font-bold text-foreground tracking-wider uppercase text-[11px]">Merchant B Identity</div>
                        <p className="text-muted-foreground leading-relaxed">
                          Volt Nest is registered with TD Retail platform. Guaranteed hardware replacement & live AI agent troubleshooting.
                        </p>
                        <a
                          href={`${runtimeApiUrl.replace(/\/+$/, '')}/inbox`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary font-semibold hover:underline"
                        >
                          Central Resolution Inbox →
                        </a>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Volt Nest</span>
                        <span>•</span>
                        <span>Merchant B Showcase</span>
                        <span>•</span>
                        <span>Designed with React Bits</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <NextLink href="/policy" className="hover:text-foreground transition-colors">
                          Terms & Warranty Policy
                        </NextLink>
                        <span>•</span>
                        <span>© 2026 Volt Nest</span>
                      </div>
                    </div>
                  </div>
                </footer>
              </OrderProvider>
            </CartProvider>
          </VisitorProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
