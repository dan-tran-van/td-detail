<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context & Agent Guide: SoundWave Digital (`music-merchant`)

This guide documents the architecture, data flows, UI conventions, React Bits integration, and cross-application REST synchronization for the **SoundWave Digital (Merchant A)** standalone Next.js storefront. Follow these guidelines closely in future development sessions.

---

## 1. Project Overview & Multi-App Topology

SoundWave Digital (`music-merchant`) is a standalone digital music distributor built with Next.js 16 (Turbopack, App Router, React 19) designed to run alongside the centralized **TD Retail** platform (`tdretail`):

- **Port 3000 (`tdretail`)**: Central multi-merchant customer resolution platform, Gemini AI grounded assistant, unified inbox (`/inbox`, `/chat/[conversationId]`), and simulated SendGrid email outbox (`/outbox`).
- **Port 3001 (`music-merchant`)**: Dedicated external digital music storefront offering bit-perfect 24-bit FLAC downloads, multi-track master creator stems, and digital ownership licenses priced in INR (₹).

### Monorepo & Cloud Run Ready
- **Stateless Cloud Run Architecture**: `music-merchant` never connects directly to Firebase/Firestore and never relies on local server filesystem persistence.
- **REST Communication**: All cross-service integration occurs exclusively over HTTP REST APIs (`POST ${NEXT_PUBLIC_TD_RETAIL_API_URL}/api/orders` and `POST ${NEXT_PUBLIC_TD_RETAIL_API_URL}/api/conversations`).

---

## 2. Key Architecture & Data Flows

### A. Order Placement & Central Sync Flow
1. **Catalog & Cart**:
   - 5 seeded audio releases defined in `lib/products.ts` with metadata (duration, format, license type, multi-track stems).
   - In-memory & `localStorage` persisted cart via `context/CartContext.tsx` (`soundwave_music_cart_v1`).
2. **Instant & Cart Checkout**:
   - `/checkout?productId=...` (Instant 1-Click Buy Now) or `/checkout` (Multi-item cart checkout).
   - `POST /api/checkout` generates an order ID (`ORD-MUS-XXXX`), creates license activation keys and secure download URLs for each track.
   - Automatically synchronizes the new order to `tdretail` via `POST ${NEXT_PUBLIC_TD_RETAIL_API_URL}/api/orders`.
   - Persists order in customer vault (`context/OrderContext.tsx` / `soundwave_music_orders_v1`) and redirects to `/orders/[orderId]`.

### B. Customer Support & AI Grounding Flow
1. **Embedded Support Drawer (`components/SupportChatWidget.tsx`)**:
   - Built on shadcn `Sheet` drawer accessible from the storefront header or any order details card.
   - Contextually passes the active `orderId` to TD Retail's conversation API.
2. **REST Support Session Initialization**:
   - `POST ${NEXT_PUBLIC_TD_RETAIL_API_URL}/api/conversations` creates a conversation thread in `tdretail`.
   - The central Gemini AI grounding engine immediately verifies the order details, confirms active status, and outputs license keys or answers policy questions.
3. **Deep Linking to Active Chat**:
   - Links in the support drawer and storefront footer deep link directly to the active chat thread: `${NEXT_PUBLIC_TD_RETAIL_API_URL}/chat/${conversation.id}` (fallback to `/chat/conv_music_01` or `/inbox`), ensuring customers and support agents land directly on the active thread rather than a generic inbox overview.

---

## 3. UI, Design System & React Bits Conventions

1. **Strict shadcn Component Usage**:
   - Always prioritize official shadcn components (`Card`, `Table`, `Badge`, `Button`, `Sheet`, `Input`, `Dialog`, `Separator`, `Tooltip`) and their sub-component APIs (`CardHeader`, `CardTitle`, `CardContent`, `CardFooter`) rather than custom raw `div` structures.
2. **Theme & CSS Variables (`app/globals.css`)**:
   - Standard shadcn styling preset with dark mode support.
   - Always use semantic color tokens: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`.
   - Avoid hardcoded ad-hoc hex colors across application components.
3. **React Bits Integration**:
   - Installed React Bits components reside in `components/`:
     - `Antigravity.tsx`: Interactive canvas particle physics animation for the Hero section.
     - `SplitText.tsx`: Animated staggered typography using GSAP for headline reveals.
     - `ShinyText.tsx`: Ambient shimmering text effect for status and highlight badges.
     - `TiltedCard.tsx`: 3D tilt hover interaction for showcase cards.

---

## 4. Next.js 16 & Turbopack Rules

1. **Client Hook Prerendering (`CLIENT_HOOK_DYNAMIC`)**:
   - In Next.js 16 with Partial Prerendering (PPR), components calling `useSearchParams()` or dynamic router hooks must be wrapped in `<Suspense fallback={...}>` (e.g. in `app/orders/[orderId]/page.tsx` and `app/checkout/page.tsx`) to avoid prerender build errors.
2. **Development Servers**:
   - `tdretail`: `pnpm dev` (port 3000)
   - `music-merchant`: `pnpm dev -p 3001` (port 3001)
3. **Production Validation**:
   - Always run `pnpm run build` in `music-merchant` before committing changes to ensure clean TypeScript compilation and error-free static route export.

