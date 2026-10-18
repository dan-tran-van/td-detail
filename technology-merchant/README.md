# Volt Nest Storefront (Merchant B)

Polished, high-performance e-commerce demo storefront for **Volt Nest** (modern tech accessories and smart gadgets). Built with Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui tokens, React Bits, and integrated directly with the **TD Retail** multi-merchant AI customer-support resolution platform.

---

## 1. Tech Stack & Prerequisites

- **Node.js**: v24 LTS (`.nvmrc` pinned)
- **Package Manager**: `pnpm` (10.x / 11.x)
- **Framework**: Next.js 16 (App Router, Turbopack, Partial Prefetching)
- **Styling**: Tailwind CSS v4, shadcn semantic tokens (`bg-background`, `text-foreground`, `vn-glow-blue`), Antigravity particle physics
- **Validation & Testing**: Zod, Vitest
- **AI Support Platform**: Seamless REST synchronization with TD Retail (`@google/genai` Gemini 3.5 Flash Lite engine)

---

## 2. Quickstart & Development

```bash
# 1. Use Node 24
nvm use 24

# 2. Install dependencies
pnpm install

# 3. Seed product catalogue
pnpm seed

# 4. Run development server (port 3002)
pnpm dev -p 3002
```

Visit: **`http://localhost:3002`**

---

## 3. Scripts

- `pnpm dev -p 3002`: Start Next.js development server on port 3002
- `pnpm typecheck`: Run TypeScript compilation check (`tsc --noEmit`)
- `pnpm lint`: Run ESLint check
- `pnpm test`: Run Vitest unit & integration test suites
- `pnpm build`: Generate optimized production build
- `pnpm seed`: Verify seeded catalogue (5 tech accessories)

---

## 4. Key Architectural Features

1. **Merchant Identity (`merchant_b`) & Dynamic Registration**:
   - Centralized in `lib/config.ts` supporting 4 resolution layers (window config, environment variables, local fallback, default production endpoint).
   - Dynamically registers store support policy (10-day replacement, 1-year warranty) with TD Retail via `POST /api/merchants`.
2. **Product Catalogue & Detail Pages**:
   - 5 seeded products with tech specs, warranty details, stock badges, and deep-linkable product detail pages (`/products/[id]`).
3. **Cart & Secure Checkout with Collision-Free Visitor Isolation**:
   - Real-time cart calculation with server-side price protection (Zod validation, client price tampering protection).
   - Collision-free visitor IDs (`cust_visitor_xxxx`) and demo orders (`ORD-TECH-XXXX`).
   - Dedicated confirmation page at `/orders/[orderId]/confirmation`.
   - Every checked-out order syncs via `POST ${resolveTDRetailUrl()}/api/orders` to the central `tdretail` platform in the background.
4. **Warranty & Policy Page**:
   - Dedicated policy page at `/policy` detailing 10-day replacement and 1-year hardware warranty.
5. **Embedded TD Retail Support Widget & Deep Linking**:
   - Pre-loaded with order context and live streaming connection to the Gemini AI resolution agent.
   - Deep links directly into TD Retail active chat (`/chat/${conversationId}`), allowing customers to view responses or claim conversations to their personal accounts.
6. **Dev Outbox**:
   - Built-in simulation viewer at `/outbox` for inspecting dispatched customer confirmation emails.
