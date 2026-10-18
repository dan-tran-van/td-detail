import React from 'react';
import { Bot, Sparkles, ShieldCheck, Terminal, HelpCircle, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';
import { ApiPlayground } from '@/components/docs/ApiPlayground';
import { ParamTable } from '@/components/docs/ParamTable';

export default function ConversationsDocsPage() {
  const createThreadSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/conversations" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantId": "merchant_music",
    "orderId": "ORD-MUS-8821",
    "subject": "License key inquiry",
    "initialMessage": "Where can I find the activation key for my studio masters?",
    "customerEmail": "guest_sw_8821@soundwave.store",
    "customerName": "Digital Audio Creator"
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/conversations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchantId: 'merchant_music',
    orderId: 'ORD-MUS-8821',
    subject: 'License key inquiry',
    initialMessage: 'Where can I find the activation key for my studio masters?',
    customerEmail: 'guest_sw_8821@soundwave.store',
    customerName: 'Digital Audio Creator',
  }),
});
const data = await response.json();
console.log('Thread ID:', data.conversation.id);
console.log('Gemini AI Reply:', data.initialAiReply.content);`,
    },
  ];

  const postMessageSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/conversations/conv_music_01/messages" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Can you check the current status of my download link?",
    "customerEmail": "sarah.connor@example.com"
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/conversations/conv_music_01/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Can you check the current status of my download link?',
    customerEmail: 'sarah.connor@example.com',
  }),
});
const data = await response.json();`,
    },
  ];

  const createThreadParams = [
    {
      name: 'merchantId',
      type: 'string',
      required: true,
      description: 'Registered merchant ID. Enforces tenant support policies and limits order tool lookups.',
    },
    {
      name: 'subject',
      type: 'string',
      required: true,
      description: 'Ticket topic or subject line.',
    },
    {
      name: 'initialMessage',
      type: 'string',
      required: true,
      description: 'Customer inquiry. Immediately triggers the Gemini 3.5 Flash Lite agent.',
    },
    {
      name: 'orderId',
      type: 'string',
      required: false,
      description: 'Grounds the AI agent with verified database order details upon thread launch.',
    },
    {
      name: 'customerEmail',
      type: 'string',
      required: false,
      description: 'Customer or visitor contact email for bidirectional email notifications.',
    },
    {
      name: 'customerName',
      type: 'string',
      required: false,
      description: 'Display name for the customer.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-primary uppercase">
            AI Operations & Support Threading
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary shrink-0" />
          <span>Conversations & Resolution Engine API</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          The Conversations API orchestrates support interactions between customers and the TD Retail autonomous resolution engine. Every interaction executes server-side tool lookups and enforces ground-truth return and warranty policies with zero hallucination.
        </p>

        {/* Model Transparency Callout */}
        <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 flex items-start gap-3 text-xs leading-relaxed">
          <Sparkles className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">Underlying Model: Google Gemini 3.5 Flash Lite </span>
            <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px] text-primary border border-border">gemini-3.5-flash-lite</code>
            <p className="text-muted-foreground mt-1">
              Connected via the modern <code className="font-mono text-[11px]">@google/genai</code> SDK with native function calling. The engine invokes verified database tools to look up order states, courier notes, and digital vault items with sub-second latency.
            </p>
          </div>
        </div>
      </div>

      {/* Grounded Tool Calling Mechanism */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Server-Side Grounded Tool Calling</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The Gemini agent is equipped with server-side declaration tools powered by <code className="font-mono text-xs">@google/genai</code>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-400">lookupOrderStatus(orderId)</span>
              <Badge variant="outline" className="text-[9px]">Server Tool</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Queries live Firestore order state, courier notes, tracking numbers, and digital license keys. Never invents statuses.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">requestHumanEscalation(reason)</span>
              <Badge variant="outline" className="text-[9px]">Server Tool</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Updates thread status to <code className="font-mono text-[10px]">escalated</code>, notifies senior staff, and explains escalation criteria to customer.
            </p>
          </div>
        </div>
      </section>

      {/* Endpoint 1: POST /api/conversations */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/conversations</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Launch Thread & Initial AI Reply
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Creates a new support conversation thread and dispatches the initial customer inquiry to the Gemini agent.
        </p>

        <ParamTable title="Create Thread Parameters" params={createThreadParams} />

        <CodeBlockWithCopy snippets={createThreadSnippets} title="Create Conversation Thread" />
      </section>

      {/* Endpoint 2: POST /api/conversations/[id]/messages */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/conversations/[id]/messages</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Append Message & Agent Reply
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Appends a customer message to an existing conversation and triggers the Gemini agent to process the reply with preserved thought signatures.
        </p>

        <CodeBlockWithCopy snippets={postMessageSnippets} title="Send Message in Thread" />
      </section>

      {/* Endpoint 3: GET /api/conversations */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2 py-0.5">
            GET
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/conversations</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            List Support Threads
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Fetches active support conversation threads for the current customer session or filter by <code className="font-mono text-xs">merchantId</code>.
        </p>

        <ApiPlayground
          defaultMethod="GET"
          defaultEndpoint="/api/conversations"
          title="Live Test: GET /api/conversations"
          description="Fetch active support threads for the current customer persona."
        />
      </section>
    </div>
  );
}
