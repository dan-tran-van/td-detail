import React from 'react';
import { Store, ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';
import { ApiPlayground } from '@/components/docs/ApiPlayground';
import { ParamTable } from '@/components/docs/ParamTable';

export default function MerchantsDocsPage() {
  const registerSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/merchants" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "merchant_audio_pro",
    "name": "AudioPro Sound Lab",
    "category": "digital_audio",
    "supportEmail": "support@audiopro.example",
    "supportPolicy": {
      "returns": "Digital items cannot be returned once master stems are downloaded.",
      "refunds": "Refunds approved within 14 days if activation key is invalid.",
      "deliveryOrDownload": "Instant lossless WAV delivery via customer portal.",
      "escalationThreshold": "Inquiries over $50 escalate to Senior Audio Engineer."
    }
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/merchants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 'merchant_audio_pro',
    name: 'AudioPro Sound Lab',
    category: 'digital_audio',
    supportEmail: 'support@audiopro.example',
    supportPolicy: {
      returns: 'Digital items cannot be returned once master stems are downloaded.',
      refunds: 'Refunds approved within 14 days if activation key is invalid.',
      deliveryOrDownload: 'Instant lossless WAV delivery via customer portal.',
      escalationThreshold: 'Inquiries over $50 escalate to Senior Audio Engineer.',
    },
  }),
});
const data = await response.json();`,
    },
  ];

  const registerParams = [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique slug or identifier for the merchant (e.g. merchant_music, merchant_b). Automatically lowercased.',
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Human-readable brand title (e.g. "SoundWave Digital", "Volt Nest").',
    },
    {
      name: 'category',
      type: 'string',
      required: false,
      defaultValue: 'general',
      description: 'Industry category for dynamic order schema derivation (e.g. digital_music, tech_accessories, groceries).',
    },
    {
      name: 'supportEmail',
      type: 'string',
      required: false,
      description: 'Default merchant contact email address for human support escalations.',
    },
    {
      name: 'supportPolicy.returns',
      type: 'string',
      required: false,
      description: 'Ground-truth return policy injected into Gemini AI Agent system context.',
    },
    {
      name: 'supportPolicy.refunds',
      type: 'string',
      required: false,
      description: 'Ground-truth refund policy injected into Gemini AI Agent system context.',
    },
    {
      name: 'supportPolicy.deliveryOrDownload',
      type: 'string',
      required: false,
      description: 'Delivery fulfillment guarantee or digital download protocol.',
    },
    {
      name: 'supportPolicy.escalationThreshold',
      type: 'string',
      required: false,
      description: 'Specific dollar or criteria threshold for escalating to human operators.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-primary uppercase">
            Storefront Configuration
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Store className="h-8 w-8 text-primary shrink-0" />
          <span>Merchants API</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          The Merchants API manages participating storefronts on TD Retail. Registering a merchant onboards their catalog, enforces cross-storefront order validation, and defines the ground-truth customer support policies used by the Google Gemini AI Agent.
        </p>
      </div>

      {/* Endpoint 1: POST /api/merchants */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/merchants</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Dynamic Onboarding
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Registers a new merchant or updates an existing storefront configuration. The support policy parameters directly shape Gemini AI reasoning when answering customer questions.
        </p>

        <ParamTable title="Request Body Parameters" params={registerParams} />

        <CodeBlockWithCopy snippets={registerSnippets} title="Register / Onboard Merchant" />

        <ApiPlayground
          defaultMethod="POST"
          defaultEndpoint="/api/merchants"
          defaultBody={JSON.stringify(
            {
              id: 'merchant_demo',
              name: 'Demo Merchant Store',
              category: 'tech_accessories',
              supportEmail: 'support@demo.example',
              supportPolicy: {
                returns: 'Hardware returns accepted within 14 days in original condition.',
                refunds: 'Refunds credited within 3-5 business days upon item return.',
                deliveryOrDownload: 'Tracked ground dispatch within 24 hours.',
                escalationThreshold: 'Warranty issues over $100 route to senior manager.',
              },
            },
            null,
            2
          )}
          title="Live Test: POST /api/merchants"
          description="Test onboarding a test merchant into Firestore memory."
        />
      </section>

      {/* Endpoint 2: GET /api/merchants */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2 py-0.5">
            GET
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/merchants</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Directory Lookup
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Retrieves a list of all active registered merchants with their branding details, categories, and AI policy rules.
        </p>

        <ApiPlayground
          defaultMethod="GET"
          defaultEndpoint="/api/merchants"
          title="Live Test: GET /api/merchants"
          description="Fetch all active merchants registered on this platform."
        />
      </section>
    </div>
  );
}
