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
3. **Order Status & Fulfillment Updates (`PATCH /api/orders/[id]` & `PATCH /api/orders`)**:
   - Updates order status (`processing`, `out_for_delivery`, `delivered`, `cancelled`, `refunded`), tracking numbers, courier notes, and digital items (`licenseKey`, `downloadUrl`).
   - **Enforces cross-merchant boundary**: Rejects requests attempting to modify orders belonging to another merchant with `403 Forbidden`.
   - Smart-merges digital item license keys and download URLs without overwriting pricing or titles.
4. **Support Conversation Initialization (`POST /api/conversations`)**:
   - Creates a conversation thread scoped to `merchantId` and visitor credentials.
   - **Enforces registered `merchantId`**: Rejects requests from unregistered merchants with `400 Bad Request`.
   - Triggers the Gemini Agent for the initial message and replies immediately.
5. **Subsequent Messages (`POST /api/conversations/[id]/messages`)**:
   - Appends user message and dispatches grounded Gemini response.
   - Validates ownership against `conversation.customerId` and `conversation.customerEmail` to ensure visitor messages are never rejected with 403 Access Denied.
6. **Outbox Notification (`POST /api/outbox`)**:
   - Outbound support emails are routed directly to the visitor's email (`guest_xxxx@soundwave.store`), not the fallback persona session.
   - When SendGrid is configured (`SENDGRID_API_KEY`), emails are delivered via custom domain (`SENDGRID_FROM_EMAIL=support@yourdomain.com`) with reply-to routing (`reply+{conversationId}@inbound.yourdomain.com`).
7. **SendGrid Inbound Parse Webhook (`POST /api/webhooks/sendgrid`)**:
   - Ingests inbound email replies received by SendGrid Inbound Parse (`inbound.yourdomain.com`).
   - Appends the message to the active conversation, triggers the Gemini Agent, and sends the AI response back to the customer via email.
8. **Merchant Settings & Profile (`GET / PATCH /api/merchant/settings`)**:
   - Allows authenticated merchant owners to update store profile, branding colors, support email, storefront URL, and ground-truth Gemini support policies (returns, refunds/warranty, fulfillment, escalation threshold, operating mode, and suggested demo prompts).
   - **Enforces Demo Protection**: Requests to mutate seeded demo merchants (`merchant_music`, `merchant_a`, `merchant_b`, `merchant_tech`, `merchant_grocery`) are rejected with `403 Forbidden` (`isDemoProtected: true`).

---

## 3. Dedicated Merchant Portal & Authentication (`tdretail`)

### A. HTTP-Only Cookie Session Architecture
- Session management is handled via `tdretail/lib/merchantSession.ts` using the secure HTTP-only cookie `td_merchant_session`.
- Stores user credentials, merchant association, and role (`owner` | `staff`).
- **Why Cookie Sessions (vs Client Firebase Auth)**:
  1. **Instant 1-Click Evaluation**: Evaluators and judges switch between SoundWave Digital and Volt Nest with zero popups or typing.
  2. **Server-Side Render (SSR) Native**: Next.js App Router reads `cookies()` synchronously on the initial HTTP request, eliminating client auth hydration flicker.
  3. **Zero Client SDK Footprint**: Avoids pulling the heavy `@firebase/auth` client bundle into the browser.
  4. **Zero Cloud Run Domain Whitelist Headaches**: Works out-of-the-box on `localhost`, Cloud Run revision URLs (`asia-southeast1.run.app`), or custom domains without Firebase Console whitelist updates.

### B. Portal Routes & Capabilities (`/merchant/*`)
- **`/merchant/login`**: Dual-mode authentication (1-click evaluation switcher for SoundWave Digital & Volt Nest, plus standard email/password form).
- **`/merchant`**: Operational overview dashboard featuring real-time KPI metric cards (Pending Escalations, Orders to Fulfill, Dispatched AI Emails), active Gemini policy summaries, and quick links.
- **`/merchant/escalations`**: Human escalation management center. Displays tickets flagged by Gemini, displays full reasoning/tool call logs, allows human specialists to reply directly (`sender: 'human_agent'`), dispatches customer notification emails, and marks tickets as resolved.
- **`/merchant/orders`**: Order fulfillment and tracking table. Allows manual status transitions (`processing` $\rightarrow$ `out_for_delivery` $\rightarrow$ `delivered`), assignment of courier names and tracking numbers, courier fulfillment notes, and digital license key provisioning (reusing `PATCH /api/orders/[id]`).
- **`/merchant/outbox`**: Audit view of Gemini AI outbound customer emails with SendGrid simulation and preview dialogs.
- **`/merchant/settings`**: Store profile and ground-truth Gemini support policies management. Protected demo storefronts are presented in read-only mode with locked inputs and an amber banner guiding visitors to register a custom merchant to test edits.
- **`/merchant/register`**: 3-step dynamic onboarding wizard to register new participating merchants and staff credentials.

### C. Storefront URL Resolution Protocol
- Configuration is centralized in `tdretail/lib/storefrontConfig.ts` with `resolveMerchantStorefrontUrl(merchant)`:
  - SoundWave Digital (`merchant_music` / `merchant_a`): `http://localhost:3001` locally, `https://music-merchant-215785827581.asia-southeast1.run.app` in production.
  - Volt Nest (`merchant_b` / `merchant_tech`): `http://localhost:3002` locally, `https://technology-merchant-215785827581.asia-southeast1.run.app` in production.
- Storefront buttons in Navbar, Layout, and Overview open live external storefronts in a new tab.

---

## 4. Gemini AI Agent Architecture (`tdretail`)

- **Model**: `gemini-3.5-flash-lite` (via `@google/genai`).
- **Function Calling**:
  - `lookupOrderStatus`: Fetches real verified order data (status, items, license keys, download URLs, courier notes).
  - `requestHumanEscalation`: Triggers ticket escalation and notifies human support specialist.
- **Thought Signature & Formatting**:
  - Candidate parts and thought signatures are preserved across turns.
  - Multi-part text extraction reads from both `response.text` and `firstCandidate.content.parts`.
- **History Turn Invariant**:
  - The history array passed to Gemini must alternate strictly between `user` and `model`. Consecutive `user` turns (`user -> user`) will be rejected by the Gemini API with HTTP 400. Always prune duplicate incoming turns before passing history to `ai.models.generateContent`.
- **Formatting Rule**: Responses use clean Markdown bullet points (`*` or `- `) with double newlines between paragraphs.
- **Grounded Fallback Engine**: When `GEMINI_API_KEY` is not present or returns HTTP 429 quota exhaustion, `executeGroundedFallbackEngine()` kicks in deterministically to query the database and answer order questions without hallucinations.

---

## 5. Security & Isolation Invariants (Strict)

1. **Multi-Tenant Order Segregation**:
   - Orders are strictly bound to their registering `merchantId`.
   - Customer chat sessions for Merchant A can NEVER access or query orders belonging to Merchant B. The agent tool `lookupOrderStatus` enforces this server-side.
2. **Merchant Portal Session Boundaries**:
   - Merchant staff sessions (`td_merchant_session`) are strictly scoped. All `/api/merchant/*` routes require `getMerchantSession()`.
   - A staff member logged into Merchant A cannot fulfill, modify, or view orders belonging to Merchant B.
3. **Demo Store Mutation Protection**:
   - Seeded demo merchants (`merchant_music`, `merchant_a`, `merchant_b`, `merchant_tech`, `merchant_grocery`) are protected in `PATCH /api/merchant/settings` with `403 Forbidden` (`isDemoProtected: true`).
   - Testing settings mutations MUST be performed against a custom registered merchant (via `/merchant/register` or `POST /api/merchants`).
4. **Data Concurrency & Cache Invalidation**:
   - When running against local file storage (`.data/db.json`), `TDStore` uses `fs.statSync(DATA_FILE).mtimeMs` to detect modifications made by parallel Next.js server worker processes. Do not remove or bypass this cache invalidation check.

---

## 6. UI & Component Rules (Strict)

1. **shadcn Tokens Only**:
   - Never use hardcoded hex colors or arbitrary color utilities. Use semantic theme variables:
     `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `bg-muted`.
2. **System Default Typography**:
   - Use standard system default fonts (`ui-sans-serif, system-ui, sans-serif`). Do not add Google Font links or webfont imports.
3. **React Bits Integrity**:
   - Never modify or rewrite internal React Bits files in `music-merchant/components/` (`Antigravity.tsx`, `SplitText.tsx`, `ShinyText.tsx`, `TiltedCard.tsx`, `Beams.tsx`, `Waves.tsx`).
4. **Next.js 16 `cacheComponents` Rule**:
   - Do **NOT** export `const dynamic = 'force-dynamic'` in layouts when `cacheComponents: true` is configured in `next.config.ts`.
5. **Suspense Boundaries**:
   - Components using `useSearchParams()` or dynamic router hooks must be wrapped in `<Suspense fallback={...}>`.

---

## 7. Development, Build & Verification Commands

```bash
# Run local dev servers
cd tdretail && pnpm dev                 # port 3000
cd music-merchant && pnpm dev -p 3001   # port 3001
cd technology-merchant && pnpm dev -p 3002 # port 3002

# Typecheck & build validation
cd tdretail && pnpm exec tsc --noEmit && pnpm run build
cd music-merchant && pnpm exec tsc --noEmit && pnpm run build
cd technology-merchant && pnpm exec tsc --noEmit && pnpm test && pnpm run build

# SendGrid verification test
cd tdretail && node scripts/test-sendgrid.mjs your-email@example.com
```
