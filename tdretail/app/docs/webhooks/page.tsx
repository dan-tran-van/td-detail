import React from 'react';
import { Webhook, Mail, Terminal, Send, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';
import { ApiPlayground } from '@/components/docs/ApiPlayground';
import { ParamTable } from '@/components/docs/ParamTable';

export default function WebhooksDocsPage() {
  const sendgridWebhookSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/webhooks/sendgrid" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "Sarah Connor <sarah.connor@example.com>",
    "to": "TD Retail Support <reply+conv_music_01@inbound.tdretail.example.com>",
    "subject": "Re: [SoundWave Digital] Order Status [Ref: conv_music_01]",
    "text": "Thank you! Could you please double check if the stems were included?"
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/webhooks/sendgrid', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Sarah Connor <sarah.connor@example.com>',
    to: 'TD Retail Support <reply+conv_music_01@inbound.tdretail.example.com>',
    subject: 'Re: [SoundWave Digital] Order Status [Ref: conv_music_01]',
    text: 'Thank you! Could you please double check if the stems were included?',
  }),
});
const data = await response.json();`,
    },
  ];

  const simulateSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/webhooks/sendgrid/simulate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "conv_music_01",
    "replyText": "I received my vinyl stems, thank you for the prompt assistance!"
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/webhooks/sendgrid/simulate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    conversationId: 'conv_music_01',
    replyText: 'I received my vinyl stems, thank you for the prompt assistance!',
  }),
});
const data = await response.json();`,
    },
  ];

  const webhookParams = [
    {
      name: 'from',
      type: 'string',
      required: true,
      description: 'Sender email header (e.g. "Customer Name <customer@example.com>"). Verified against conversation thread customer email.',
    },
    {
      name: 'to',
      type: 'string',
      required: true,
      description: 'Recipient address containing thread token (e.g. reply+{conversationId}@inbound.yourdomain.com).',
    },
    {
      name: 'subject',
      type: 'string',
      required: true,
      description: 'Email subject containing conversation reference token.',
    },
    {
      name: 'text',
      type: 'string',
      required: true,
      description: 'Plain-text body of the customer reply.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-primary uppercase">
            Email Routing & Asynchronous Webhooks
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Webhook className="h-8 w-8 text-primary shrink-0" />
          <span>Webhooks & Email Relay API</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          TD Retail supports omnichannel support workflows via SendGrid Inbound Parse. Customers can simply hit &ldquo;Reply&rdquo; in their favorite email client, and the response is tokenized, authenticated, appended to the support ticket, and resolved by the Gemini AI Agent.
        </p>
      </div>

      {/* Endpoint 1: POST /api/webhooks/sendgrid */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/webhooks/sendgrid</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            SendGrid Inbound Parse
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Production webhook endpoint configured in SendGrid settings under Inbound Parse. Accepts standard multipart/form-data payloads posted by SendGrid MX servers as well as JSON payloads for automated pipelines.
        </p>

        <ParamTable title="Inbound Email Parameters" params={webhookParams} />

        <CodeBlockWithCopy snippets={sendgridWebhookSnippets} title="Inbound Email Webhook Payload" />
      </section>

      {/* Endpoint 2: POST /api/webhooks/sendgrid/simulate */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/webhooks/sendgrid/simulate</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Development Sandbox
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Allows engineers and hackathon judges to trigger the entire inbound parse and AI response loop locally without needing a verified SendGrid DNS domain or MX records.
        </p>

        <CodeBlockWithCopy snippets={simulateSnippets} title="Simulate Customer Email Reply" />

        <ApiPlayground
          defaultMethod="POST"
          defaultEndpoint="/api/webhooks/sendgrid/simulate"
          defaultBody={JSON.stringify(
            {
              conversationId: 'conv_music_01',
              replyText: 'Can you check if my order #ORD-MUS-8821 includes the FLAC stems?',
            },
            null,
            2
          )}
          title="Live Test: Simulate Customer Email Reply"
          description="Send an inbound simulated email reply to conv_music_01 and inspect the immediate Gemini Agent answer."
        />
      </section>

      {/* Endpoint 3: GET /api/outbox */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2 py-0.5">
            GET
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/outbox</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Outbound Email Log
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Retrieves logged outbound support notification emails with dynamic <code className="font-mono text-xs">reply+...</code> headers for inspection.
        </p>

        <ApiPlayground
          defaultMethod="GET"
          defaultEndpoint="/api/outbox?all=true"
          title="Live Test: GET /api/outbox"
          description="Inspect outgoing customer notifications logged by TD Retail."
        />
      </section>
    </div>
  );
}
