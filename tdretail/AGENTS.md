<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context & Agent Guide: TD Retail (Support AI Platform)

This guide documents the architecture, established patterns, UI/UX conventions, and recent implementations in this repository. Follow these guidelines closely in future development sessions.

---

## 1. Project Overview & Architecture
TD Retail is an AI-powered multi-merchant customer support platform built on Next.js 16 (Turbopack, App Router, React 19) featuring:
- **Hybrid Support Agent**: Google Gemini AI customer assistant capable of answering merchant-specific questions, checking orders, executing tools, and escalating tickets.
- **Multi-Merchant Architecture**: Configurable merchant profiles (e.g. `merchant_music` - SoundWave Digital, `merchant_grocery` - FreshCart Direct).
- **Inbound/Outbox Email Simulation**: Webhook-based email flow mimicking SendGrid with automated AI responses and inbound email parsing.
- **Mock Store & Session Persistence**: In-memory and local JSON fallback store (`lib/firebase/store.ts`), session management with shopper persona cookies (`td_customer_id`).

---

## 2. Design & Styling System (Mandatory Rules)

1. **System Default Fonts**:
   - The typography uses standard system default font stacks (`ui-sans-serif, system-ui, sans-serif`). Do **not** inject external font imports (e.g., Inter, Outfit, Roboto) or override with ad-hoc font families.

2. **Strict shadcn Theme Tokens**:
   - Do **NOT** use hardcoded color values (e.g., `#6366f1`, `bg-indigo-600`, `text-blue-500`, etc.).
   - Always use semantic shadcn CSS variables and Tailwind classes:
     - `bg-background`, `text-foreground`
     - `bg-card`, `text-card-foreground`, `border-border`
     - `bg-primary`, `text-primary-foreground`
     - `bg-secondary`, `text-secondary-foreground`
     - `bg-muted`, `text-muted-foreground`
     - `bg-accent`, `text-accent-foreground`
     - `bg-destructive`, `text-destructive`

3. **Layout & Navigation Constraints**:
   - **Standalone Fullscreen Pages**: `/chat`, `/inbox`, and `/outbox` have **NO Navbar and NO Footer**.
     - Controlled centrally in [components/ShellLayout.tsx](file:///home/dan/Documents/projects/nextjs-projects/tdretail/components/ShellLayout.tsx) via `isFullAppPage = pathname?.startsWith('/chat') || pathname?.startsWith('/inbox') || pathname?.startsWith('/outbox')`.
     - These pages use `h-screen w-screen overflow-hidden` for true desktop/app feel.
   - **Modern Sidebar State**:
     - The modern chat sidebar in [components/ModernAppShell.tsx](file:///home/dan/Documents/projects/nextjs-projects/tdretail/components/ModernAppShell.tsx) maintains its collapsed/expanded state across route changes using `localStorage` and the `td_sidebar_collapsed` cookie. Do not alter or break this persistent state.

---

## 3. Key Pages & Features

### A. Gemini-style Chat & Inbox (`/inbox`, `/chat/[conversationId]`)
- **Shell**: Wrapped in [components/ModernAppShell.tsx](file:///home/dan/Documents/projects/nextjs-projects/tdretail/components/ModernAppShell.tsx) with a collapsible left sidebar containing:
  - New Ticket / Inquiry creation button.
  - Active conversation listing with unread / escalation badges.
  - Shopper Persona switcher at the bottom footer.
- **Message Rendering & Markdown**:
  - Assistant and specialist messages are parsed with `<ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>` in [app/chat/[conversationId]/page.tsx](file:///home/dan/Documents/projects/nextjs-projects/tdretail/app/chat/%5BconversationId%5D/page.tsx).
  - `remark-breaks` is mandatory to ensure single newlines render as line breaks (`<br />`) rather than collapsing into single paragraphs.
  - Code blocks, tables, bold/italic, lists (`- ` or `* `), blockquotes, and links are styled strictly using semantic shadcn classes with Tailwind typography prose extensions.
  - Interactive Gemini Tool Calls inspector button to show execution details.

### B. Gemini Agent Service Architecture (`lib/services/geminiService.ts`)
- **Active Model**: Uses `gemini-3.5-flash-lite` with `@google/genai` SDK.
  - *Important*: `gemini-2.5-flash` and `gemini-3.8-flash` free-tier quotas are easily exhausted (429 quota error). Keep `gemini-3.5-flash-lite` as the primary engine for high availability and reliable function calling.
- **Function Calling & Tool Execution**:
  - Two declared tools: `lookupOrderStatus({ orderId })` and `requestHumanEscalation({ reason })`.
  - When returning function call responses to Gemini, **always preserve the original `id`** (`fc.id`) on the `functionResponse` part, and pass the exact previous `candidate.content` containing the `thoughtSignature`.
- **History Turn Invariant**:
  - In `/api/conversations/[id]/messages/route.ts`, the customer message is added to `TDStore` before calling `GeminiAgentService.processMessage()`.
  - To prevent consecutive `user` turns (`user -> user`) which Gemini API rejects with a 400 error, `processMessage()` filters out the duplicate incoming message from the history slice before appending the active turn.
- **Grounded Fallback Engine**:
  - If the Gemini API key is missing or encounters rate limits, `executeGroundedFallbackEngine()` handles requests locally with verified database checks.
  - Features smart intent classification (detects refund/cancellation, escalation, order status queries, and general inquiries) so it does not repetitively output order details for non-order questions.
  - Fallback string templates must use standard Markdown bullets (`- `) with double newlines rather than unicode bullet characters (`• `).

### C. Gmail-style Standalone Outbox (`/outbox`)
- Standalone webmail interface located at [app/outbox/page.tsx](file:///home/dan/Documents/projects/nextjs-projects/tdretail/app/outbox/page.tsx).
- Features Gmail-like layout: top search bar, mail folder sidebar (Sent, All Mail, Starred), email inspection panel, SendGrid reply webhook simulator, and quick switcher to return to Chat Inbox (`/inbox`).
- Standalone persona switcher button in the top right.
- `EmailService` (`lib/services/emailService.ts`):
  - Checks if `SENDGRID_API_KEY` is configured and not the default placeholder (`your_sendgrid_api_key`).
  - If unconfigured, instantly routes emails to the local outbox without network timeouts.

### D. Persona Switcher Mechanism
- **Active Personas**: Defined in `lib/data/seedData.ts` (`cust_sarah_connor`, `cust_alex_chen`).
- **Session API**:
  - `GET /api/session` returns current customer and all available demo personas.
  - `POST /api/session` updates the `td_customer_id` cookie.
- **UI Trigger**:
  - Accessible **Dialog Modals** in both `ModernAppShell.tsx` and `app/outbox/page.tsx`.
  - Switching immediately writes `document.cookie`, calls `/api/session`, and performs a clean reload to sync all tickets and orders.

### E. External Merchant Integration (`music-merchant`) & CORS
- **Independent Merchant A Storefront**: Built as a standalone Next.js app in `/music-merchant` running on port 3001. Demo storefront routes originally in `tdretail` (`/storefront/music`, etc.) have been removed.
- **Cross-Origin Resource Sharing (CORS)**:
  - Enabled across all `/api/:path*` routes in `tdretail/next.config.ts`.
  - Explicit `OPTIONS` preflight handlers and `Access-Control-Allow-Origin: *` headers are present in `app/api/conversations/route.ts`, `app/api/conversations/[id]/route.ts`, and `app/api/conversations/[id]/messages/route.ts`.
- **Cross-App Navigation**:
  - `tdretail` Navbar includes a direct link to the external music storefront (`http://localhost:3001`).
  - Storefront links directly to active chat threads (`/chat/[conversationId]`) in `tdretail`.
- **REST Endpoints for External Merchants**:
  - `POST /api/orders`: Ingests and stores orders placed externally in Firestore/db.json with CORS headers enabled.
  - `POST /api/conversations`: Ingests customer support inquiries started externally from the storefront support drawer with CORS headers enabled.
  - `POST /api/conversations/[id]/messages`: Ingests customer follow-up chat messages and returns Gemini AI responses.

---

## 4. Common Workflows & Commands
- **Dev Servers**:
  - `tdretail`: `pnpm dev` (port 3000)
  - `music-merchant`: `pnpm dev -p 3001` (port 3001)
- **Validation**: `pnpm run build` in each project directory (Ensures zero TypeScript errors, correct Next.js 16 partial prerendering, and clean compilation).
- **Resetting Demo Data**: Available via the persona modal ("Reset All Mock Data") or `POST /api/seed`.


