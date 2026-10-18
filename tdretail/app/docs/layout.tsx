import React from 'react';
import type { Metadata } from 'next';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { Badge } from '@/components/ui/badge';
import { Terminal, Globe2, ShieldCheck, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Documentation & Developer Reference | TD Retail',
  description:
    'Comprehensive REST API specifications, Gemini AI Agent tool calling schemas, SendGrid webhooks, and storefront SDK guides for the TD Retail platform.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-28">
      {/* Top Banner / Environment Status Strip */}
      <div className="border-b border-border/70 bg-card/40 backdrop-blur-md sticky top-[60px] sm:top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-foreground">API Reference</span>
            <span>/</span>
            <span className="font-mono text-[11px] text-primary">v1.0 (Enterprise)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Server className="h-3 w-3 text-emerald-500" />
              <span>Base URL:</span>
              <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono text-foreground border border-border/50">
                /api
              </code>
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Cloud Run Active:</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono text-emerald-400 border-emerald-500/30">
                asia-southeast1
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Sticky Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-36">
            <DocsSidebar />
          </div>

          {/* Main Content Area */}
          <main className="lg:col-span-9 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
