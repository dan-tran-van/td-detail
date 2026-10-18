import React from 'react';
import { Code2, Layers, CheckCircle2, Terminal, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';

export default function SdkDocsPage() {
  const configSnippet = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `// lib/config.ts - Package-ready configuration resolver
export interface TDRetailConfig {
  apiUrl: string;
  merchantId: string;
}

export const DEFAULT_TD_RETAIL_CONFIG: TDRetailConfig = {
  apiUrl: 'https://tdretail-215785827581.asia-southeast1.run.app',
  merchantId: 'merchant_music',
};

export function resolveTDRetailUrl(): string {
  // Layer 1: Window runtime injection (Docker / Kubernetes env)
  if (typeof window !== 'undefined' && window.__TD_CONFIG?.tdRetailApiUrl) {
    return window.__TD_CONFIG.tdRetailApiUrl.replace(/\\/+$/, '');
  }
  // Layer 2: Next.js public environment variable
  const envUrl = process.env.NEXT_PUBLIC_TD_RETAIL_API_URL || process.env.TD_RETAIL_API_URL;
  if (envUrl) {
    return envUrl.replace(/\\/+$/, '');
  }
  // Layer 3: Local development fallback
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  // Layer 4: Default production Cloud Run endpoint
  return DEFAULT_TD_RETAIL_CONFIG.apiUrl;
}`,
    },
  ];

  const apiSyncSnippet = [
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `// lib/api-sync.ts - Storefront REST synchronization helper
import { resolveTDRetailUrl, resolveMerchantId } from './config';

export async function syncOrderToTDRetail(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const apiBase = \`\${resolveTDRetailUrl()}/api\`;
    const res = await fetch(\`\${apiBase}/orders\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...order,
        merchantId: resolveMerchantId(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || \`HTTP \${res.status}\` };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

export async function updateOrderOnTDRetail(
  orderId: string,
  updates: Partial<Order>
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const apiBase = \`\${resolveTDRetailUrl()}/api\`;
    const res = await fetch(\`\${apiBase}/orders/\${encodeURIComponent(orderId)}\`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-merchant-id': resolveMerchantId(),
      },
      body: JSON.stringify({
        ...updates,
        merchantId: resolveMerchantId(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || \`HTTP \${res.status}\` };
    }
    return { success: true, order: data.order };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}`,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-primary uppercase">
            Storefront Integration
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Code2 className="h-8 w-8 text-primary shrink-0" />
          <span>Client SDK & Integration Guide</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          Learn how external merchant storefronts (such as SoundWave Digital and Volt Nest) seamlessly integrate order synchronization and conversational AI support with the TD Retail platform.
        </p>
      </div>

      {/* 4-Layer Configuration Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <span>4-Layer URL Resolution Protocol</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Storefronts use a package-ready resolution strategy (<code className="font-mono text-xs">lib/config.ts</code>) that automatically resolves the correct endpoint without hardcoded hostnames:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono">1</span>
              <span>Window Runtime Injection</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Injected in document <code className="font-mono text-[10px]">&lt;head&gt;</code> by Docker/Cloud Run runner scripts (<code className="font-mono text-[10px]">window.__TD_CONFIG</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono">2</span>
              <span>Environment Variables</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Reads <code className="font-mono text-[10px]">NEXT_PUBLIC_TD_RETAIL_API_URL</code> at build or runtime.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono">3</span>
              <span>Local Dev Detection</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Detects localhost or dev mode and routes traffic directly to <code className="font-mono text-[10px]">http://localhost:3000</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-mono">4</span>
              <span>Cloud Run Production Default</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Falls back safely to the high-availability Cloud Run regional deployment.
            </p>
          </div>
        </div>

        <CodeBlockWithCopy snippets={configSnippet} title="Storefront Config Resolver (lib/config.ts)" />
      </section>

      {/* Synchronization Helpers */}
      <section className="space-y-4 pt-6 border-t border-border/70">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Order Synchronization Helpers</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Storefronts call these helpers during checkout and delivery events to keep TD Retail synchronised with zero downtime:
        </p>

        <CodeBlockWithCopy snippets={apiSyncSnippet} title="Storefront API Sync Helpers (lib/api-sync.ts)" />
      </section>
    </div>
  );
}
