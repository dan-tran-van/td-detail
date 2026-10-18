import React from 'react';
import { ShoppingBag, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CodeBlockWithCopy } from '@/components/docs/CodeBlockWithCopy';
import { ApiPlayground } from '@/components/docs/ApiPlayground';
import { ParamTable } from '@/components/docs/ParamTable';

export default function OrdersDocsPage() {
  const syncOrderSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X POST "http://localhost:3000/api/orders" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "ORD-TECH-9012",
    "merchantId": "merchant_b",
    "customerEmail": "alex.chen@example.com",
    "customerName": "Alex Chen",
    "totalAmount": 129.99,
    "orderStatus": "processing",
    "items": [
      {
        "id": "item_1",
        "name": "VoltCore Pro 100W GaN Charger",
        "price": 89.99,
        "quantity": 1
      }
    ]
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderId: 'ORD-TECH-9012',
    merchantId: 'merchant_b',
    customerEmail: 'alex.chen@example.com',
    customerName: 'Alex Chen',
    totalAmount: 129.99,
    orderStatus: 'processing',
    items: [
      {
        id: 'item_1',
        name: 'VoltCore Pro 100W GaN Charger',
        price: 89.99,
        quantity: 1,
      },
    ],
  }),
});
const data = await response.json();`,
    },
  ];

  const patchOrderSnippets = [
    {
      language: 'curl' as const,
      label: 'cURL',
      code: `curl -X PATCH "http://localhost:3000/api/orders/ORD-TECH-9012" \\
  -H "Content-Type: application/json" \\
  -H "x-merchant-id: merchant_b" \\
  -d '{
    "merchantId": "merchant_b",
    "orderStatus": "out_for_delivery",
    "trackingNumber": "TRK-VOLT-88192",
    "carrier": "BlueDart Express",
    "courierNotes": "Package on delivery vehicle. Contactless drop requested."
  }'`,
    },
    {
      language: 'typescript' as const,
      label: 'TypeScript',
      code: `const response = await fetch('http://localhost:3000/api/orders/ORD-TECH-9012', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'x-merchant-id': 'merchant_b',
  },
  body: JSON.stringify({
    merchantId: 'merchant_b',
    orderStatus: 'out_for_delivery',
    trackingNumber: 'TRK-VOLT-88192',
    carrier: 'BlueDart Express',
    courierNotes: 'Package on delivery vehicle. Contactless drop requested.',
  }),
});
const data = await response.json();`,
    },
  ];

  const syncParams = [
    {
      name: 'orderId',
      type: 'string',
      required: true,
      description: 'Unique order ID originating in merchant storefront (e.g. ORD-MUS-8821, ORD-TECH-9012).',
    },
    {
      name: 'merchantId',
      type: 'string',
      required: true,
      description: 'Registered merchant ID. Requests with unregistered merchant IDs are rejected with 400 Bad Request.',
    },
    {
      name: 'customerEmail',
      type: 'string',
      required: true,
      description: 'Customer contact email. Automatically resolves or upserts the customer profile in TD Retail.',
    },
    {
      name: 'customerName',
      type: 'string',
      required: false,
      defaultValue: 'Valued Customer',
      description: 'Customer display name.',
    },
    {
      name: 'items',
      type: 'OrderItem[]',
      required: true,
      description: 'Array of line items, including titles, quantities, prices, and optional digital attributes.',
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: false,
      description: 'Total order value charged to customer.',
    },
    {
      name: 'orderStatus',
      type: 'string',
      required: false,
      defaultValue: 'processing',
      allowedValues: ['processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      description: 'Initial order lifecycle state.',
    },
  ];

  const patchParams = [
    {
      name: 'merchantId',
      type: 'string',
      required: true,
      description: 'Merchant identifier (in body or x-merchant-id header). Must match the order owner; mismatched callers receive 403 Forbidden.',
    },
    {
      name: 'orderStatus',
      type: 'string',
      required: false,
      allowedValues: ['processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      description: 'Updated lifecycle status.',
    },
    {
      name: 'trackingNumber',
      type: 'string',
      required: false,
      description: 'Fulfillment courier tracking number for physical orders.',
    },
    {
      name: 'carrier',
      type: 'string',
      required: false,
      description: 'Logistics provider (e.g. FedEx, BlueDart, Cold-Chain Express).',
    },
    {
      name: 'courierNotes',
      type: 'string',
      required: false,
      description: 'Live dispatch notes surfaced to the Gemini AI Agent during customer inquiries.',
    },
    {
      name: 'items',
      type: 'Partial<OrderItem>[]',
      required: false,
      description: 'Smart-merges digital item properties (licenseKey, downloadUrl) without overwriting pricing or descriptions.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border/70 pb-8">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-primary uppercase">
            Order Fulfillment & Synchronization
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary shrink-0" />
          <span>Orders API</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          The Orders API synchronizes purchase events from merchant storefronts (like SoundWave Digital and Volt Nest) into TD Retail. It enforces strict cross-merchant boundaries to prevent data leakage and provides real-time state for the Gemini AI agent.
        </p>
      </div>

      {/* Tenant Boundary Security Alert */}
      <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="font-bold text-foreground">Strict Cross-Merchant Boundary Enforcement</div>
          <p className="text-muted-foreground leading-relaxed">
            All mutating endpoints require an authorized <code className="font-mono text-xs">merchantId</code>. If an order belongs to <code className="font-mono text-xs">merchant_music</code>, any modification attempt by another storefront is immediately rejected with <code className="font-mono text-xs text-red-400">403 Forbidden</code>.
          </p>
        </div>
      </div>

      {/* Endpoint 1: POST /api/orders */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold px-2 py-0.5">
            POST
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/orders</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Order Synchronization
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Ingests a new order created on an external merchant storefront. Automatically associates or upserts the customer profile based on email.
        </p>

        <ParamTable title="Request Body Parameters" params={syncParams} />

        <CodeBlockWithCopy snippets={syncOrderSnippets} title="Sync Order to TD Retail" />
      </section>

      {/* Endpoint 2: PATCH /api/orders/[id] */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold px-2 py-0.5">
            PATCH
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/orders/[id]</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Fulfillment & Status Update
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Updates fulfillment status, courier dispatch tracking, or digital download assets for an existing order.
        </p>

        <ParamTable title="PATCH Update Parameters" params={patchParams} />

        <CodeBlockWithCopy snippets={patchOrderSnippets} title="Update Fulfillment Status" />
      </section>

      {/* Endpoint 3: GET /api/orders */}
      <section className="space-y-6 pt-6 border-t border-border/70">
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2 py-0.5">
            GET
          </Badge>
          <code className="text-sm sm:text-base font-mono font-bold text-foreground">/api/orders</code>
          <Badge variant="outline" className="text-[10px] text-muted-foreground ml-auto">
            Query Customer Orders
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Queries orders for the active session or filters by query parameters: <code className="font-mono text-xs">orderId</code>, <code className="font-mono text-xs">customerEmail</code>, or <code className="font-mono text-xs">merchantId</code>.
        </p>

        <ApiPlayground
          defaultMethod="GET"
          defaultEndpoint="/api/orders"
          title="Live Test: GET /api/orders"
          description="Query existing orders for the active customer persona."
        />
      </section>
    </div>
  );
}
