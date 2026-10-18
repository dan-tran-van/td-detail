# TD Retail — Shared Customer Support Platform & Gemini Agent

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.5%20Flash%20Lite-4285F4)](https://deepmind.google/technologies/gemini/)
[![SendGrid](https://img.shields.io/badge/SendGrid-Inbound%20Parse-00B2E3)](https://sendgrid.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Admin%20Firestore-FFCA28)](https://firebase.google.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Tailwind-000000)](https://ui.shadcn.com/)

An enterprise-grade, customer-centric multi-merchant customer support resolution platform built for the **TD Retail Hackathon**. 

This platform allows shoppers who buy from separate participating merchant storefronts (such as **SoundWave Digital** for digital lossless audio, **Volt Nest** for tech accessories, and **FreshCart Direct** for organic groceries) to manage all their support conversations in a single unified inbox, resolved by a **Google Gemini AI Agent** with server-grounded order tools and bidirectional **SendGrid email reply routing**.

---

## 🌟 Key Differentiators & Features

### 1. Consolidated Customer Inbox (`/inbox`)
* **Multi-Merchant Centralization:** No more logging into separate support portals for each store. Customers view all tickets in one dashboard.
* **Domain Filtering & Search:** Instant filtering between merchants (SoundWave Digital, Volt Nest, FreshCart Direct) and ticket lifecycle states (Active, Escalated, Resolved).
* **Grounded Ticket Launcher:** Pick an order from recent merchant purchases to ground the conversation context from the very first message.

### 2. Dedicated Grounded Conversation Thread (`/chat/[conversationId]`)
* **Zero AI Hallucination with 100% Dynamic Domain Grounding:** The Gemini Agent uses server-side function calling (`lookupOrderStatus`) to query live database records before providing answers. Responses dynamically format items, licenses, download links, courier tracking, and return/warranty policies directly from database state—with zero hardcoded merchant categories!
* **Server-Enforced Tenant Security:** The server validates session credentials, customer email, and merchant boundaries. Orders belonging to *Merchant A* can never be accessed or modified by *Merchant B*.
* **Interactive Tool Inspector:** Click **"Inspect Server Tool Calls"** on any AI message to view the exact function arguments, timestamp, and returned database payload.
* **Human Escalation Workflow:** Customers can click **"Request Human Assistance"**, automatically alerting the merchant support team and updating the thread status to `escalated`.
* **Live Message Stream:** 4-second auto-polling ensures customer email replies and agent actions appear live on the screen without page reloads.

### 3. Customer Authentication, Guest Isolation & Seamless Conversation Handoff
* **SSR Cookie Sessions (`td_customer_session`):** Base64 JSON containing `{ customerId, email, name, isGuest }` read synchronously by Next.js App Router server components.
* **Dynamic Guest Isolation:** Anonymous visitors get unique collision-free guest IDs (`cust_guest_xxxx`) and emails (`guest_xxxx@tdretail.guest`), preventing session leakage in shared environments.
* **1-Click Conversation Handoff:** Guests can click **"Save Chat & Log In"** or log in via `/login`. `TDStore.claimConversation()` atomically rebinds the conversation, customer email, and name to the customer's permanent account, appending an audit record.
* **Full Window Navigation:** The handoff triggers `window.location.href = /chat/${handoffConversationId}`, ensuring the active panel sidebar and layout SSR-hydrate immediately with the new profile and highlighted thread.

### 4. Dedicated Merchant Portal (`/merchant/*`)
* **Operational Overview (`/merchant`):** Real-time KPI metric cards (Pending Escalations, Orders to Fulfill, Dispatched AI Emails), active Gemini policy summaries, and quick links.
* **Human Escalation Management (`/merchant/escalations`):** Specialized console for reviewing tickets escalated by Gemini, viewing multi-part reasoning logs, replying as `human_agent`, sending email notifications, and resolving tickets.
* **Manual Order Fulfillment (`/merchant/orders`):** Order search, status transitions (`processing` $\rightarrow$ `out_for_delivery` $\rightarrow$ `delivered`), tracking numbers, courier notes, and digital license key provisioning.
* **Gemini Outbox Audit (`/merchant/outbox`):** Audit outgoing AI customer emails with SendGrid simulation and preview dialogs.
* **Store Profile & AI Support Policies (`/merchant/settings`):** Customize brand identity, support emails, storefront URLs, and ground-truth Gemini support policies (returns, refunds, delivery, escalation threshold, operating mode). Protected demo stores are read-only with clear visual indicators.
* **Merchant Registration Wizard (`/merchant/register`):** 3-step dynamic onboarding wizard for registering new participating storefronts.

### 5. Bidirectional Email Reply Routing (`/outbox` & SendGrid Webhook)
* **Direct Reply from Email Client:** Outgoing notifications include a dynamic header:
  ```http
  Reply-To: TD Retail Support <reply+{conversationId}@inbound.tdretail.example.com>
  Subject: [{MerchantName}] {Subject} [Ref: {conversationId}]
  ```
* **SendGrid Inbound Parse Webhook (`POST /api/webhooks/sendgrid`):** Ingests incoming customer email replies, parses the thread token, verifies sender email ownership, appends the message into the active conversation, triggers the Gemini Agent, and sends an email reply back to the customer!
* **Local Development Outbox Viewer (`/outbox`):** When running without SendGrid credentials, outgoing emails are captured in the outbox. An interactive **"Simulate Customer Reply"** button lets judges trigger the full round-trip webhook pipeline with one click.

### 6. External Participating Storefront Integration
* **SoundWave Digital Storefront (Port 3001):** Lossless digital audio catalog, instant FLAC license activation, and embedded support drawer.
* **Volt Nest Storefront (Port 3002):** Modern consumer tech accessories, 2-year warranty lookup, Zod-validated secure checkout, and integrated AI support drawer.

---

## 🏗️ System Architecture

```
                       ┌───────────────────────────────┐
                       │   Participating Storefronts   │
                       │  (SoundWave Music, FreshCart) │
                       └───────────────┬───────────────┘
                                       │ Launches Support
                                       ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                     TD Retail Customer Platform (/inbox)                    │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │                                                                             │
 │   ┌───────────────────────┐                    ┌────────────────────────┐   │
 │   │  Consolidated Inbox   │                    │ Conversation Thread    │   │
 │   │  • Multi-Merchant UI  │ ─────────────────▶ │ • Grounded AI Bubble   │   │
 │   │  • Order Attachments  │                    │ • Tool Call Inspector  │   │
 │   └───────────────────────┘                    └───────────┬────────────┘   │
 │                                                            │                │
 └────────────────────────────────────────────────────────────┼────────────────┘
                                                              │
                       ┌──────────────────────────────────────┴───────────────┐
                       ▼                                                      ▼
        ┌─────────────────────────────┐                        ┌──────────────────────────────┐
        │  Gemini 3.5 Flash Lite      │                        │   SendGrid Inbound/Outbound  │
        ├─────────────────────────────┤                        ├──────────────────────────────┤
        │ • System Prompt Injection   │                        │ • Outbound Support Emails    │
        │ • Tool: lookupOrderStatus   │                        │ • Inbound Parse Webhook      │
        │ • Tool: requestHumanEscalate│                        │ • Reply-To Thread Routing    │
        └──────────────┬──────────────┘                        └──────────────┬───────────────┘
                       │                                                      │
                       └──────────────────────┬───────────────────────────────┘
                                              ▼
                        ┌──────────────────────────────────────────┐
                        │        Firebase Admin / Firestore        │
                        ├──────────────────────────────────────────┤
                        │ • merchants      • orders                │
                        │ • customers      • conversations         │
                        │ • sessions       • messages & outbox     │
                        └──────────────────────────────────────────┘
```

---

## 🗄️ Firestore Collections Schema

| Collection | Key Fields | Description |
| :--- | :--- | :--- |
| `merchants` | `id`, `name`, `category`, `brandColor`, `supportPolicy`, `supportEmail` | Dynamic configuration for participating merchants |
| `customers` | `id`, `name`, `email`, `phone`, `defaultAddress` | Customer profile and identity |
| `sessions` | `sessionId`, `token`, `customerId`, `expiresAt` | Authenticated session records |
| `orders` | `orderId`, `merchantId`, `customerId`, `items`, `orderStatus`, `estimatedDelivery` | Shared orders database across merchant storefronts |
| `conversations` | `id`, `customerId`, `merchantId`, `orderId`, `status`, `lastMessageSnippet` | Support threads across merchants |
| `messages` | `id`, `conversationId`, `sender`, `content`, `metadata.toolCalls`, `timestamp` | Message history with AI tool grounding metadata |
| `outbox_emails` | `id`, `conversationId`, `to`, `replyTo`, `subject`, `bodyHtml`, `sentAt` | Inspection store for outgoing customer notifications |

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | Automatically activates Grounded Fallback Engine |
| `SENDGRID_API_KEY` | SendGrid Mail API Key | Automatically logs to Local Outbox (`/outbox`) |
| `FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID | Automatically persists to local store (`.data/db.json`) |

> **Zero-Barrier Setup:** TD Retail runs immediately without cloud credentials. The built-in storage adapter and deterministic grounded AI engine allow testing every feature out-of-the-box.

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Hackathon Judging & Evaluation Walkthrough

Follow these steps to experience all capabilities:

### Step 1: Open the Consolidated Inbox (`/inbox`)
1. Visit [http://localhost:3000/inbox](http://localhost:3000/inbox).
2. Use the persona switcher in the sidebar/bottom footer to select **Sarah Connor** or browse as a custom customer.
3. Note that the inbox and sidebar dynamically scope to show only stores where the customer has active conversations.
4. Try clicking **"+ New Chat"** to open the real-time Store Discovery & Search dialog.

### Step 2: Test Grounded Order Lookup in Chat
1. While on Sarah Connor's account, open her SoundWave Digital thread (`Question regarding master stems download for Neon Echoes #ORD-MUS-8821`), or start a new chat via [http://localhost:3000/chat/new?merchantId=merchant_music](http://localhost:3000/chat/new?merchantId=merchant_music).
2. Ask: *"What is my license key and download link for order #ORD-MUS-8821?"*
3. Observe the AI response quoting the real license key (`SW-8821-NEON-FLAC-L01`) and direct vault zip download link.
4. Click **"Inspect Server Tool Calls"** under the AI response to view the validated `lookupOrderStatus` execution.

### Step 3: Test Cross-Merchant Isolation Security
1. In the **SoundWave Digital** chat, ask: *"Can you check order #ORD-GROC-5512?"* (a FreshCart grocery order).
2. The server blocks the request with a **Security Alert**: *"Order ORD-GROC-5512 is registered with FreshCart Direct, not SoundWave Digital."*
3. This proves that merchant boundary isolation is strictly enforced server-side.

### Step 4: Test SendGrid Inbound Parse Email Routing (`/outbox`)
1. **Live Email Verification (CLI)**:
   ```bash
   node scripts/test-sendgrid.mjs your-email@gmail.com
   ```
   Verifies that the SendGrid API key and authenticated domain (`support@yourdomain.com`) successfully dispatch emails with HTTP 202.
2. **Outbox Web Simulator**: Visit [http://localhost:3000/outbox](http://localhost:3000/outbox).
3. Select any outgoing email notification.
4. Click **"Simulate Customer Reply"**, enter a reply message (e.g., *"Thanks, the FLAC stems extracted perfectly!"*), and click **"Send Inbound Webhook"**.
5. Click **"Go to thread"** to see that the email was ingested into the conversation thread without logging in, and the Gemini agent has already responded!

### Step 5: Test Human Escalation & Specialist Resolution
1. In any active chat, click **"Request Human"** or type: *"I would like to speak to a human supervisor."*
2. The ticket status updates to `escalated`, an alert is dispatched to the merchant's support email, and an audit message is recorded.
3. Open the **Hackathon Demo Console** at the bottom of the chat, type a reply as the Human Specialist, and click **"Reply & Resolve"**.

---

## 🧑‍💻 Developer Guide: Architecture & Extending TD Retail

### A. Customer Authentication, Guest Isolation & Seamless Conversation Handoff
TD Retail maintains strict separation between consumer shoppers and merchant staff:
- **Shopper Authentication & Cookie Sessions (`td_customer_session`)**:
  - Encoded as base64 JSON payload of `CustomerAuthPayload` (`customerId`, `email`, `name`, `isGuest`).
  - Read synchronously by Next.js App Router server components (`cookies()`) and API handlers (`getCurrentCustomer()`), eliminating hydration flicker.
  - Anonymous visitors receive collision-free guest IDs (`cust_guest_xxxx`) and emails (`guest_xxxx@tdretail.guest`).
- **1-Click Evaluation Personas & Custom Email Login**:
  - Supports 1-click persona switching (Sarah Connor, Alex Chen) and custom customer email sign-in/auto-registration (`/login`, `POST /api/session/login`).
  - Supports deep linking: `/login?returnUrl=...&claimConv=...`.
- **Seamless Conversation Handoff**:
  - When an anonymous visitor logs in or clicks **"Save Chat & Log In"**, `TDStore.claimConversation()` atomically transfers conversation ownership to their permanent account.
  - `CustomerAuthDialog` reloads via `window.location.href = /chat/${handoffConversationId}` to ensure the root layout (`ModernAppShell`) SSR-hydrates with the new session cookie, immediately rendering the authenticated customer profile in the active sidebar, listing their inbox conversations, and highlighting the claimed thread.

### B. Gemini AI Agent Protocol & 100% Dynamic Domain Grounding
The agent implementation lives in `lib/services/geminiService.ts`:
- **Model**: `gemini-3.5-flash-lite` (via `@google/genai`).
- **Tool Response Role Invariant**: Tool call results in `followupContents` MUST use `role: 'tool'` (or `'function'`) with `[{ functionResponse: { name, response, id } }]`. Never send `role: 'user'` for function response parts.
- **Strict Turn Alternation**: History must alternate strictly between `user` and `model` (`user -> model -> user -> model`). Consecutive same-role turns are merged with `\n\n`, and system audit messages (`sender: 'system'`) are filtered out.
- **Specialist Human Attribution**: Specialist replies (`sender: 'human_agent'`) from `/merchant/escalations` map to `role: 'model'` with explicit prefix `[Human Support Specialist (${msg.senderName})]: ...`. The Gemini system prompt instructs the agent to treat human specialist interventions as authoritative ground truth.
- **Zero Hardcoded Categories**: All live responses and fallback engines use dynamic data-driven formatters (`formatDynamicOrderResponse`, `formatDynamicPolicyResponse`) deriving policies and fulfillment details directly from `merchant.supportPolicy` and order items.
- **Grounded Fallback Engine**: If `GEMINI_API_KEY` is not provided or hits rate limits (HTTP 429), `executeGroundedFallbackEngine()` kicks in automatically to verify orders against the database and respond deterministically using standard markdown bullet points.

### C. Dedicated Merchant Portal (`/merchant/*`) & Security Invariants
- **HTTP-Only Cookie Session (`td_merchant_session`)**:
  - Managed via `lib/merchantSession.ts`. Passwords are salt-hashed using Node's native `crypto.pbkdf2Sync`.
  - Scoped strictly to merchant staff under `/merchant/*`.
- **Demo Store Protection**:
  - Seeded demo merchants (`merchant_music`, `merchant_a`, `merchant_b`, `merchant_tech`, `merchant_grocery`) are protected in `PATCH /api/merchant/settings` with `403 Forbidden` (`isDemoProtected: true`).
  - Testing settings mutations MUST be performed against a custom registered merchant (via `/merchant/register` or `POST /api/merchants`).
- **Multi-Tenant Order Segregation**:
  - Orders are strictly bound to their registering `merchantId`. Chat sessions for Merchant A can NEVER query or modify orders belonging to Merchant B.

### D. Storage Persistence & Multi-Process Cache Invalidation
- Managed by `lib/firebase/store.ts`:
  - Uses Cloud Firestore when `FIREBASE_PROJECT_ID` is present; otherwise falls back to local JSON at `.data/db.json`.
  - **Multi-Process Cache Invalidation**: In-memory cache verifies `fs.statSync(DATA_FILE).mtimeMs` before fulfilling requests to guarantee mutations made by one Next.js worker process are immediately reflected in all worker processes.

### E. Developer Tooling Environment Gating & UI Invariants
1. **Developer Tooling Gating**: Developer drawers (such as the Inbound Email & Specialist Tools drawer in `/chat/[conversationId]`) only render on `localhost`, `127.0.0.1`, `NODE_ENV === 'development'`, or when `?dev=1` is explicitly present in the query parameters.
2. **React Key Uniqueness**: All merchant listings and navigation tabs must be deduplicated by `merchant.id` to prevent duplicate key console errors.
3. **shadcn Semantic Tokens Only**: Never use hardcoded hex colors or arbitrary utility colors; use semantic CSS variables (`bg-background`, `text-foreground`, `border-border`, etc.).

---

## 🚢 Production Deployment

### Option A: Google Cloud Run (Recommended for Gemini workloads)
Deploy from source directly with configured environment variables:
```bash
gcloud run deploy tdretail \
  --source . \
  --region asia-southeast1 \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY",FIREBASE_PROJECT_ID="YOUR_PROJECT_ID",SENDGRID_API_KEY="YOUR_SENDGRID_KEY",SENDGRID_FROM_EMAIL="support@yourdomain.com",INBOUND_EMAIL_DOMAIN="inbound.yourdomain.com"
```

### Option B: Firebase App Hosting
1. Connect repository in Firebase Console under **App Hosting**.
2. Configure environment secrets via Secret Manager (`GEMINI_API_KEY`, `SENDGRID_API_KEY`).
3. Deploy automatically via GitHub push trigger.

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/session` | Get active customer persona & available demo personas |
| `POST` | `/api/session` | Switch customer persona session (legacy) |
| `POST` | `/api/session/login` | Authenticate customer with email / demo persona |
| `POST` | `/api/session/logout` | Clear customer session |
| `POST` | `/api/session/claim-conversation` | Atomically claim guest conversation to customer account |
| `GET` | `/api/merchants` | List participating merchants and branding |
| `POST` | `/api/merchants` | Dynamically register new merchant with support policies |
| `GET` | `/api/merchants/[id]` | Get merchant support policy and config |
| `GET` | `/api/orders` | Query customer orders scoped by merchant |
| `POST` | `/api/orders` | Ingest external order from participating storefront |
| `GET` | `/api/orders/[id]` | Fetch single order by internal ID or public orderId |
| `PATCH` | `/api/orders/[id]` | Update order status, tracking, courier notes & digital keys |
| `GET` | `/api/conversations` | Get consolidated customer inbox threads |
| `POST` | `/api/conversations` | Open new support inquiry with merchant & order grounding |
| `GET` | `/api/conversations/[id]` | Get conversation details, linked order, and messages |
| `POST` | `/api/conversations/[id]/messages` | Post message, execute Gemini tool calls, send email |
| `POST` | `/api/conversations/[id]/escalate` | Escalate thread to human specialist |
| `POST` | `/api/conversations/[id]/agent-reply` | Reply and resolve as human support specialist |
| `POST` | `/api/webhooks/sendgrid` | SendGrid Inbound Parse Webhook endpoint |
| `POST` | `/api/webhooks/sendgrid/simulate` | Helper to simulate incoming customer email reply |
| `POST` | `/api/seed` | Reset and reseed Firestore with initial demo data |
| `GET` | `/api/merchant/session` | Get active merchant staff session |
| `POST` | `/api/merchant/session` | Log in as merchant staff or 1-click demo switcher |
| `DELETE` | `/api/merchant/session` | Log out merchant staff session |
| `POST` | `/api/merchant/register` | Register new participating merchant & staff account |
| `GET` | `/api/merchant/settings` | Get store details and ground-truth AI support policies |
| `PATCH` | `/api/merchant/settings` | Update store details & AI policies (protected for demo stores) |
| `GET` | `/api/merchant/escalations` | List Gemini-escalated tickets for active merchant |
| `POST` | `/api/merchant/escalations/[id]/reply` | Reply as human specialist, dispatch email & resolve ticket |
| `GET` | `/api/merchant/orders` | List customer orders scoped to active merchant |
| `GET` | `/api/merchant/outbox` | Audit sent emails by Gemini for active merchant |

---

## 📄 License
MIT License. Built for the TD Retail Multi-Merchant AI Customer Support Hackathon.
