import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import React, { Suspense } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { VisitorProvider } from '@/context/VisitorContext';
import { Header } from '@/components/Header';
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SoundWave Digital • Lossless Audio & Master Stems (Merchant A)',
  description:
    'Independent digital music storefront powered by TD Retail multi-merchant customer resolution platform. Bit-perfect 24-bit FLAC audio, master stems, and instant digital licenses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <TooltipProvider>
          <VisitorProvider>
            <CartProvider>
              <OrderProvider>
                <Suspense fallback={<div className="h-16 w-full border-b border-border bg-background" />}>
                  <Header />
                </Suspense>
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <footer className="border-t border-border bg-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">SoundWave Digital Storefront</span>
                    <span>•</span>
                    <span>Merchant A Storefront Demo</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Connected to TD Retail Platform API</span>
                    <span>•</span>
                    <a
                      href={`${process.env.NEXT_PUBLIC_TD_RETAIL_API_URL || 'http://localhost:3000'}/chat/conv_music_01`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition-colors"
                    >
                      Active Support Chat →
                    </a>
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
