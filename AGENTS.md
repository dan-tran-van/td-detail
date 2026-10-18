# Monorepo Agent Guide: TD Retail Platform & Merchant Storefronts

This guide documents the monorepo architecture, development protocols, cross-app REST synchronization, dynamic merchant registration, and styling rules across **`tdretail`**, **`music-merchant`**, and **`technology-merchant`**. Follow these rules in all development sessions.

---

## 1. Monorepo Topology & Services

| Package | Port | Role | Tech Stack |
| :--- | :--- | :--- | :--- |
| **`tdretail`** | `3000` | Central Multi-Merchant Resolution Platform & Gemini Agent | Next.js 16 (App Router), `@google/genai`, Firebase Admin, SendGrid |
| **`music-merchant`** | `3001` | External Merchant Storefront (SoundWave Digital - Merchant A) | Next.js 16 (App Router), shadcn/ui, React Bits, GSAP |
| **`technology-merchant`** | `3002` | External Merchant Storefront (Volt Nest - Merchant B) | Next.js 16 (App Router), shadcn/ui, Tailwind v4, Zod, Vitest |

### Cloud Run Deployments (Production)
Configured via Cloud Run environment variables / deploy flags in `asia-southeast1`:
- **`tdretail`**: `https://tdretail-215785827581.asia-southeast1.run.app`
- **`music-merchant`**: `https://music-merchant-215785827581.asia-southeast1.run.app`
- **`technology-merchant`**: `https://technology-merchant-215785827581.asia-southeast1.run.app`

---

## 2. Cross-Application Integration Protocols

### A. Environment Variable & URL Resolution (Package-Ready Architecture)
Configuration is centralized in `<storefront>/lib/config.ts`, structured to be extracted into a standalone package (e.g. `@tdretail/sdk`):
- Exposes `DEFAULT_TD_RETAIL_CONFIG`, `configureTDRetail()`, `resolveTDRetailUrl()`, and `resolveMerchantId()`.
- Supports 4 layers of resolution:
  1. Window runtime config (`window.__TD_CONFIG`) injected in `<head>` by `app/layout.tsx`.
  2. Environment variables (`NEXT_PUBLIC_TD_RETAIL_API_URL` or `TD_RETAIL_API_URL`).
  3. Local development fallback: automatically routes to `http://localhost:3000` when running on `localhost` or in `development` mode.
  4. Package default production endpoint (`DEFAULT_TD_RETAIL_CONFIG.apiUrl`).
- Storefront sync helpers (`lib/api-sync.ts`) and `/api/config` routes delegate directly to `lib/config.ts`.
- Storefront Dockerfiles accept `ARG NEXT_PUBLIC_TD_RETAIL_API_URL=...` and pass build & runtime environment variables to both builder and runner stages.

### B. REST Communication API Endpoints
All integration between storefronts and `tdretail` is purely HTTP REST with CORS enabled:
1. **Merchant Registration (`POST /api/merchants`)**:
   - Dynamically onboards participating merchants without requiring hardcoded platform seed data.
   - Enforces ground-truth support policies (return windows, warranties, escalation thresholds) for the Gemini AI agent.
2. **Order Synchronization (`POST /api/orders`)**:
   - Stores new orders under visitor's email and ID.
   - **Enforces registered `merchantId`**: Rejects requests from unregistered merchants with `400 Bad Request`.
   - Derives category-appropriate defaults dynamically from `merchant.category`.
3. **Support Conversation Initialization (`POST /api/conversations`)**:
   - Creates a conversation thread scoped to `merchantId` and visitor credentials.
   - **Enforces registered `merchantId`**: Rejects requests from unregistered merchants with `400 Bad Request`.
   - Triggers the Gemini Agent for the initial message and replies immediately.
4. **Subsequent Messages (`POST /api/conversations/[id]/messages`)**:
   - Appends user message and dispatches grounded Gemini response.
   - Validates ownership against `conversation.customerId` and `conversation.customerEmail` to ensure visitor messages are never rejected with 403 Access Denied.
5. **Outbox Notification (`POST /api/outbox`)**:
   - Outbound support emails are routed directly to the visitor's email (`guest_xxxx@soundwave.store`), not the fallback persona session.

---

## 3. Gemini AI Agent Architecture (`tdretail`)

- **Model**: `gemini-3.5-flash-lite` (via `@google/genai`).
- **Function Calling**:
  - `lookupOrderStatus`: Fetches real verified order data (status, items, license keys, download URLs, courier notes).
  - `requestHumanEscalation`: Triggers ticket escalation and notifies human support specialist.
- **Thought Signature & Formatting**:
  - Candidate parts and thought signatures are preserved across turns.
  - Multi-part text extraction reads from both `response.text` and `firstCandidate.content.parts`.
- **Formatting Rule**: Responses use clean Markdown bullet points (`*` or `- `) with double newlines between paragraphs.

---

## 4. UI & Component Rules (Strict)

1. **shadcn Tokens Only**:
   - Never use hardcoded hex colors or arbitrary color utilities. Use semantic theme variables:
     `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `bg-muted`.
2. **React Bits Integrity**:
   - Never modify or rewrite internal React Bits files in `music-merchant/components/` (`Antigravity.tsx`, `SplitText.tsx`, `ShinyText.tsx`, `TiltedCard.tsx`, `Beams.tsx`, `Waves.tsx`).
3. **Next.js 16 `cacheComponents` Rule**:
   - Do **NOT** export `const dynamic = 'force-dynamic'` in layouts when `cacheComponents: true` is configured in `next.config.ts`.
4. **Suspense Boundaries**:
   - Components using `useSearchParams()` or dynamic router hooks must be wrapped in `<Suspense fallback={...}>`.

---

## 5. Development & Build Commands

```bash
# Run local dev servers
cd tdretail && pnpm dev                 # port 3000
cd music-merchant && pnpm dev -p 3001   # port 3001
cd technology-merchant && pnpm dev -p 3002 # port 3002

# Typecheck & build validation
cd tdretail && pnpm exec tsc --noEmit && pnpm run build
cd music-merchant && pnpm exec tsc --noEmit && pnpm run build
cd technology-merchant && pnpm exec tsc --noEmit && pnpm test && pnpm run build
```
