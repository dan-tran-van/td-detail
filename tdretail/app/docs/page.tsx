import React from 'react';
import NextLink from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Terminal,
  Lock,
  Layers,
  Sparkles,
  Server,
  Store,
  ShoppingBag,
  Bot,
  Webhook,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';
import { ApiPlayground } from '@/components/docs/ApiPlayground';
import { ParamTable } from '@/components/docs/ParamTable';

export default function DocsOverviewPage() {
  const quickstartSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X GET "http://localhost:3000/api/merchants" \\
  -H "Accept: application/json"`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/merchants', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
});
const data = await response.json();
console.log('Registered merchants:', data.merchants);`,
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `import requests

res = requests.get('http://localhost:3000/api/merchants')
print(res.json())`,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Title & Introduction */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TD Retail REST API & Developer Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Platform Overview & Architecture
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          Welcome to the TD Retail Platform Developer Documentation. Unlike traditional support platforms that manage isolated inboxes for individual merchants, TD Retail operates as a <strong>shared customer-facing support network</strong>: customers access one unified platform across multiple merchants, while each merchant retains sovereign control over its proprietary data, fulfillment workflows, and AI intelligence via decoupled REST APIs.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-bold">Tenant Boundary Safety</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Strict multi-merchant isolation. Order updates and AI agent lookups verify caller merchant bounds to prevent data leakage.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-bold">Grounded Gemini 3.5 AI</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Native function calling with tools (<code className="font-mono text-[10px]">lookupOrderStatus</code>, <code className="font-mono text-[10px]">requestHumanEscalation</code>) guarantees zero hallucinations.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="p-4 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Webhook className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-bold">Omnichannel Email Relay</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              SendGrid Inbound Parse processes customer email responses, extracts thread tokens, and dispatches AI answers transparently.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Environments & Base URLs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <span>Environments & Base URLs</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The API is fully decoupled and accessible over standard HTTP/1.1 and HTTP/2 with CORS enabled on all endpoints.
        </p>

        <div className="rounded-xl border border-border/80 overflow-hidden bg-card/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-2.5 px-4">Environment</th>
                <th className="py-2.5 px-4 font-mono">Base URL</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-sky-400 border-sky-500/30">
                    Local Dev
                  </Badge>
                </td>
                <td className="py-3 px-4 font-mono text-primary font-semibold">http://localhost:3000/api</td>
                <td className="py-3 px-4 text-muted-foreground">Default development port with hot-reloading.</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-emerald-400 border-emerald-500/30">
                    Production
                  </Badge>
                </td>
                <td className="py-3 px-4 font-mono text-emerald-400 font-semibold break-all">
                  https://tdretail-215785827581.asia-southeast1.run.app/api
                </td>
                <td className="py-3 px-4 text-muted-foreground">Google Cloud Run managed serverless container.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Quickstart Snippet */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span>Quickstart</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Retrieve registered storefronts and their AI support policies in a single API call:
        </p>

        <CodeBlockWithCopy snippets={quickstartSnippets} title="List Registered Merchants" />
      </section>

      {/* Live Sandbox Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Interactive Connectivity Test</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Click <strong>Send Request</strong> below to query the running TD Retail server in real time:
        </p>

        <ApiPlayground
          defaultMethod="GET"
          defaultEndpoint="/api/merchants"
          title="Verify API Connectivity"
          description="Fetch active merchant configurations (SoundWave Digital, Volt Nest, FreshCart Direct)."
        />
      </section>

      {/* Endpoints Directory */}
      <section className="space-y-4 pt-4 border-t border-border/70">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Core API Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NextLink
            href="/docs/merchants"
            className="p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Store className="h-4 w-4 text-primary" />
                <span>Merchants API</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dynamic onboarding, return window configurations, warranty terms, and ground-truth support policies.
            </p>
          </NextLink>

          <NextLink
            href="/docs/orders"
            className="p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>Orders & Fulfillment API</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Order synchronization, lifecycle updates, digital item smart-merging, and cross-merchant boundary checks.
            </p>
          </NextLink>

          <NextLink
            href="/docs/conversations"
            className="p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Bot className="h-4 w-4 text-primary" />
                <span>Conversations & Resolution Engine API</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI support thread creation, server-grounded tool execution, human escalation triggers, and chat histories.
            </p>
          </NextLink>

          <NextLink
            href="/docs/webhooks"
            className="p-4 rounded-2xl border border-border/80 bg-card/60 hover:border-primary/40 hover:bg-muted/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Webhook className="h-4 w-4 text-primary" />
                <span>Webhooks & Email Relay</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              SendGrid Inbound Parse payload specs, simulation endpoints for local development, and outbox logs.
            </p>
          </NextLink>
        </div>
      </section>
    </div>
  );
}
