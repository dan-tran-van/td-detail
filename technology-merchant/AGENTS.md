<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context & Agent Guide: Volt Nest (`technology-merchant`)

This guide documents the architecture, data flows, UI conventions, testing guidelines, and cross-application REST synchronization for the **Volt Nest (Merchant B)** standalone Next.js storefront. Follow these guidelines closely in future development sessions.

---

## 1. Project Overview & Multi-App Topology

Volt Nest (`technology-merchant`) is a standalone modern tech accessories storefront built with Next.js 16 (Turbopack, App Router, React 19) designed to run alongside the centralized **TD Retail** platform (`tdretail`):

- **Port 3000 (`tdretail`)**: Central multi-merchant customer resolution platform, Gemini AI grounded assistant, unified inbox (`/inbox`, `/chat/[conversationId]`), and simulated SendGrid email outbox (`/outbox`).
- **Port 3001 (`music-merchant`)**: Dedicated external digital music storefront (**SoundWave Digital - Merchant A**).
- **Port 3002 (`technology-merchant`)**: Dedicated external consumer electronics storefront (**Volt Nest - Merchant B**) offering GaN fast chargers, ANC earbuds, magnetic power banks, and portable monitors with 2-year warranty protection.

### Production Deployments
- Cloud Run: `https://technology-merchant-215785827581.asia-southeast1.run.app`
- Communicates via REST with TD Retail: `https://tdretail-215785827581.asia-southeast1.run.app`

---

## 2. Key Architecture & Data Flows

### A. Configuration & URL Resolution (`lib/config.ts`)
- Package-ready architecture exposing `DEFAULT_TD_RETAIL_CONFIG`, `configureTDRetail()`, `resolveTDRetailUrl()`, and `resolveMerchantId()`.
- Supports 4 resolution layers:
  1. Window runtime config (`window.__TD_CONFIG`) injected by `app/layout.tsx`.
  2. Environment variables (`NEXT_PUBLIC_TD_RETAIL_API_URL` or `TD_RETAIL_API_URL`).
  3. Local development fallback: automatically routes to `http://localhost:3000` when on `localhost` or in `development` mode.
  4. Package default production endpoint (`DEFAULT_TD_RETAIL_CONFIG.apiUrl`).

### B. Dynamic Merchant Registration (`POST /api/merchants`)
- On startup / order sync, Volt Nest registers its brand and ground-truth support policy with TD Retail:
  - **Returns**: 10-day replacement for defective hardware.
  - **Refunds**: Full refund for verified dead-on-arrival or unrepairable defects within 14 days.
  - **Delivery**: Expedited 2-day tracked courier dispatch.
  - **Escalation Threshold**: Missing shipments over $100 or safety issues route to Senior Technical Support.

### C. Order Synchronization & Checkout Validation
- **Server Validation with Zod**: Cart prices are never trusted from client payloads. Orders are re-calculated against `lib/products.ts` catalog.
- **Background Sync**: Every checked-out order syncs via `POST ${resolveTDRetailUrl()}/api/orders` to the central `tdretail` platform in the background.

### D. Embedded Support Chat Drawer (`components/SupportChatWidget.tsx`)
- Embedded support drawer powered by TD Retail's Gemini AI Agent.
- Pre-grounded with order status and hardware warranty lookups.
- AI responses parsed with `<ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>`.

---

## 3. UI, Design System & Tailwind v4 Conventions

1. **shadcn Semantic Tokens Only**:
   - `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `bg-muted`.
   - Never use arbitrary hardcoded hex color codes in components.
2. **Branding & Accent Styling**:
   - Electric Blue & Neon Lime accents with dark charcoal themes.
3. **Suspense Boundaries**:
   - All components using router search parameters are wrapped in `<Suspense fallback={...}>`.

---

## 4. Quality & Build Commands

```bash
# Development
pnpm dev -p 3002

# TypeScript check
pnpm exec tsc --noEmit

# Unit & Integration Tests (Vitest)
pnpm test

# Production Build
pnpm run build
```
