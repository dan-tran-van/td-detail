# TD Retail — Monorepo Architecture

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.5%20Flash%20Lite-4285F4)](https://deepmind.google/technologies/gemini/)
[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Run-4285F4)](https://cloud.google.com/run)
[![SendGrid](https://img.shields.io/badge/SendGrid-Inbound%20Parse-00B2E3)](https://sendgrid.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Admin%20Firestore-FFCA28)](https://firebase.google.com/)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange)](https://pnpm.io/)

An enterprise-grade, multi-merchant customer support resolution platform built for the **TD Retail Hackathon**.

The monorepo contains three coordinated applications:
1. **`tdretail`** (`port 3000`): The centralized multi-merchant customer resolution platform, consolidated inbox, Gemini AI agent with server-grounded tool calling, dynamic merchant registration API (`/api/merchants`), and SendGrid email routing.
2. **`music-merchant`** (`port 3001`): A standalone participating digital music storefront (**SoundWave Digital - Merchant A**) demonstrating lossless audio catalog, zero-friction cross-merchant order synchronization, visitor isolation, and embedded AI support drawers.
3. **`technology-merchant`** (`port 3002`): A standalone modern tech accessories storefront (**Volt Nest - Merchant B**) demonstrating GaN chargers, ANC earbuds, 4K portable monitors, warranty protection, Zod-validated secure checkout, and integrated AI customer support.

---

## 🏗️ Repository Structure

```
.
├── tdretail/            # Central resolution portal, APIs, and Gemini AI Agent
│   ├── app/             # Next.js App Router (/inbox, /chat, /outbox, /api/merchants)
│   ├── lib/             # Services (Gemini, Order, Email), Firebase store, types
│   └── components/      # ModernAppShell, ChatThread, PersonaSelector
│
├── music-merchant/      # Independent Digital Audio Storefront (SoundWave Digital - Merchant A)
│   ├── app/             # Storefront catalog, cart, checkout, orders
│   ├── components/      # Storefront UI, SupportChatWidget drawer
│   ├── context/         # VisitorContext, OrderContext, CartContext
│   └── lib/             # config.ts, api-sync.ts, products catalog
│
├── technology-merchant/ # Independent Tech Accessories Storefront (Volt Nest - Merchant B)
│   ├── app/             # Storefront catalog, cart, checkout, policy
│   ├── components/      # Storefront UI, SupportChatWidget drawer
│   ├── context/         # VisitorContext, OrderContext, CartContext
│   └── lib/             # config.ts, api-sync.ts, products catalog
│
├── AGENTS.md            # Monorepo architecture & AI coding agent guidelines
└── README.md            # Monorepo setup, deployment, and live URLs
```

---

## 🚀 Live Deployments (Google Cloud Run)

Services are containerized and deployed to **Google Cloud Run** in `asia-southeast1`:

| Service | Role | Live URL |
| :--- | :--- | :--- |
| **`tdretail`** | Central Platform & Gemini AI Agent | `https://tdretail-215785827581.asia-southeast1.run.app` |
| **`music-merchant`** | SoundWave Digital Storefront (Merchant A) | `https://music-merchant-215785827581.asia-southeast1.run.app` |
| **`technology-merchant`** | Volt Nest Storefront (Merchant B) | `https://technology-merchant-215785827581.asia-southeast1.run.app` |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js `v20+` or `v22+`
- `pnpm` (`v9+` or `v11+`)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Install Dependencies
```bash
# In tdretail
cd tdretail && pnpm install

# In music-merchant
cd ../music-merchant && pnpm install

# In technology-merchant
cd ../technology-merchant && pnpm install
```

### 2. Configure Environment Variables

**`tdretail/.env.local`**:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional: SendGrid & Firebase Admin
SENDGRID_API_KEY=
FIREBASE_PROJECT_ID=your_firebase_project_id
```

**`music-merchant/.env.local`**:
```ini
PORT=3001
NEXT_PUBLIC_TD_RETAIL_API_URL=http://localhost:3000
NEXT_PUBLIC_MERCHANT_ID=merchant_music
```

**`technology-merchant/.env.local`**:
```ini
PORT=3002
NEXT_PUBLIC_TD_RETAIL_API_URL=http://localhost:3000
NEXT_PUBLIC_MERCHANT_ID=merchant_b
```

### 3. Run Dev Servers Concurrently

Open three terminal windows:

```bash
# Terminal 1: TD Retail Central Platform (port 3000)
cd tdretail && pnpm dev

# Terminal 2: Music Merchant Storefront (port 3001)
cd music-merchant && pnpm dev -p 3001

# Terminal 3: Tech Accessories Storefront (port 3002)
cd technology-merchant && pnpm dev -p 3002
```

Visit:
- TD Retail Central Platform: **`http://localhost:3000`**
- SoundWave Digital (Merchant A): **`http://localhost:3001`**
- Volt Nest (Merchant B): **`http://localhost:3002`**

---

## 🌟 Key Architecture & Multi-Merchant Capabilities

### 1. Zero-Touch Visitor Isolation & Order Sync
- Shoppers on `music-merchant` are assigned unique, collision-free visitor IDs (`cust_visitor_xxxx`, `ORD-MUS-XXXX-8821`).
- Newly checked-out orders and demo orders automatically sync to `tdretail` via `POST /api/orders` in the background.
- When shoppers click **"Get Support Now"**, the support thread is instantly initialized on `tdretail` without requiring manual database resets or logins.

### 2. Server-Grounded Gemini AI Agent
- Powered by Google Gemini (`gemini-3.5-flash-lite`).
- Zero hallucination: The agent calls the server-side tool `lookupOrderStatus` to fetch live database records before answering order tracking, download key, or delivery questions.
- Multi-merchant boundary enforcement: The server strictly rejects order queries across different merchant boundaries.
- Live human escalation: Triggered automatically when issues exceed automated thresholds or when requested by the customer.

### 3. Dynamic Cloud Run Configuration
- `music-merchant` and `technology-merchant` dynamically discover `tdretail` at runtime via `RootLayout` script injection and `lib/config.ts`, automatically switching between local `http://localhost:3000` and the live Cloud Run backend without hardcoded bundle URLs.

### 4. SendGrid Production Email & Inbound Parse
- Dispatches transactional AI resolution emails using custom authenticated domain (`support@yourdomain.com`).
- Direct reply routing (`reply+{conversationId}@inbound.yourdomain.com`) enables shoppers to reply directly from their personal email client.
- Inbound Parse webhook (`POST /api/webhooks/sendgrid`) ingests replies, appends them to the conversation thread, and triggers automated Gemini responses.

### 5. Multi-Merchant Order Lifecycle & Real-Time Fulfillment Updates
- Merchants update order status (`processing`, `out_for_delivery`, `delivered`, `cancelled`, `refunded`), tracking numbers, courier notes, and digital license keys via `PATCH /api/orders/[id]`.
- Strict multi-merchant boundary protection: merchants can only modify orders assigned to their verified `merchantId`.
- Gemini AI reflects status transitions and digital license keys in real time when customers inquire.

### 6. Dedicated Merchant Portal (`/merchant/*`)
- **Operational Dashboard (`/merchant`)**: Real-time KPI metric cards (Pending Escalations, Orders to Fulfill, Dispatched AI Emails), active Gemini policy summaries, and quick links.
- **Human Escalation Center (`/merchant/escalations`)**: Review tickets escalated by Gemini AI, inspect multi-part reasoning/tool calls, reply directly as `human_agent`, dispatch email notifications, and resolve tickets.
- **Manual Order Fulfillment (`/merchant/orders`)**: Search and filter merchant orders, trigger status transitions, assign courier tracking numbers, and provision digital download keys.
- **Gemini Outbox Inspection (`/merchant/outbox`)**: Audit outbound customer emails with SendGrid simulation and preview dialogs.
- **Store Details & Ground-Truth AI Policies (`/merchant/settings`)**: Customize brand identity, colors, support email, storefront URL, and ground-truth Gemini support policies (returns, refunds, delivery, escalation threshold, operating mode, and suggested demo prompts).
- **Merchant Registration (`/merchant/register`)**: 3-step dynamic onboarding wizard for registering new participating storefronts.

### 7. Dual-Mode Authentication & Demo Merchant Protection
- **HTTP-Only Cookie Session (`td_merchant_session`)**: Enables instant SSR rendering with zero client-side auth hydration flicker or bundle bloat.
- **1-Click Quick Demo Evaluation**: Direct 1-click evaluation switcher between SoundWave Digital (`merchant_music`) and Volt Nest (`merchant_b`).
- **Protected Seed Merchants**: Default seeded merchants (`SoundWave Digital`, `Volt Nest`, `FreshCart Direct`) are protected with `403 Forbidden` (`isDemoProtected: true`) to preserve a consistent evaluation experience. Custom registered merchants remain 100% editable.

---

## 🧑‍💻 Developer Guide: Continuing Development

This section provides essential context for future developers and maintainers extending the TD Retail platform.

### A. Authentication & Session Architecture
The platform intentionally separates customer and merchant sessions:
1. **Shopper Persona Sessions (`td_customer_id` cookie)**:
   - Identifies the current consumer viewing `/inbox` or chatting via `/chat/[id]`.
   - Seeded demo personas: `cust_sarah_connor` and `cust_alex_chen`.
   - Managed via `/api/session` and the floating persona modal dialog.
2. **Merchant Portal Sessions (`td_merchant_session` HTTP-only cookie)**:
   - Scoped strictly to merchant staff under `/merchant/*`.
   - Implemented in `tdretail/lib/merchantSession.ts`.
   - Passwords are salt-hashed using Node's native `crypto.pbkdf2Sync`.
   - Includes user ID, merchant ID, role (`owner` | `staff`), and expiration.
3. **Why Cookie Sessions Instead of Client Firebase Auth?**
   - **Zero Client Bundle Bloat**: Avoids pulling the heavy `@firebase/auth` client bundle into the browser.
   - **SSR Native**: Next.js App Router reads `cookies()` synchronously during the initial server render, eliminating layout shifts and auth loading flashes.
   - **Zero Cloud Run Domain Whitelist Issues**: Works immediately on `localhost`, Cloud Run revision URLs (`asia-southeast1.run.app`), and custom staging environments without Firebase Console whitelist updates.
   - **Instant 1-Click Evaluation**: Judges and testers can switch between SoundWave Digital and Volt Nest with one click.

### B. Demo Merchant Protection & Testing Settings
To ensure live demos and automated tests remain predictable, seeded demo merchants are read-only:
- **Protected Merchant IDs**: `merchant_music`, `merchant_a`, `merchant_b`, `merchant_tech`, `merchant_grocery` (defined in `tdretail/lib/storefrontConfig.ts`).
- **Protection Behavior**: `PATCH /api/merchant/settings` returns `403 Forbidden` with `{ error: "Demo merchant profiles are protected from editing in this shared evaluation environment.", isDemoProtected: true }`.
- **How to Test Settings Mutations**:
  1. Open `/merchant/register` or send a `POST /api/merchants` payload.
  2. Complete registration to create a custom merchant (e.g. `merchant_my_shop`).
  3. Log in with the registered credentials.
  4. Navigate to `/merchant/settings` — all fields (brand colors, name, return policies, warranty rules, operating hours) are fully editable (`200 OK`).

### C. Adding a New Participating Storefront
To connect a 4th storefront to the platform:
1. **Register the Merchant**: Call `POST /api/merchants` with store branding, categories, and support policies.
2. **Configure Storefront SDK**: In the new storefront app, configure `lib/config.ts` targeting `NEXT_PUBLIC_TD_RETAIL_API_URL` and `NEXT_PUBLIC_MERCHANT_ID`.
3. **Order Sync**: On checkout completion, send `POST /api/orders` to synchronize the order into TD Retail.
4. **Support Drawer**: Embed the customer support drawer sending `POST /api/conversations` and `POST /api/conversations/[id]/messages`.
5. **URL Resolution**: Add the merchant ID mapping to `tdretail/lib/storefrontConfig.ts` in `resolveMerchantStorefrontUrl()`.

### D. Extending the Gemini AI Agent
The agent implementation lives in `tdretail/lib/services/geminiService.ts`:
- **Model**: Uses `@google/genai` with `gemini-3.5-flash-lite`.
- **Declaring Tools**: Add tool declarations to `orderLookupTool` in `geminiService.ts`.
- **Executing Tools**: Handle the tool call in the `fc.name` switch block. **Crucial rule**: Always preserve the function call `id` (`fc.id`) on the `functionResponse` part to maintain turn structure.
- **Turn Structure Rule**: Never allow consecutive `user` turns (`user -> user`) in the history array passed to Gemini, as the API will reject them with HTTP 400.
- **Grounded Fallback Engine**: If `GEMINI_API_KEY` is not provided or hits rate limits (HTTP 429), `executeGroundedFallbackEngine()` kicks in automatically to verify orders against the database and respond deterministically.

### E. Storage Persistence & Cache Invalidation
Storage is managed by `tdretail/lib/firebase/store.ts`:
- If `FIREBASE_PROJECT_ID` is present, it connects to Google Cloud Firestore via Firebase Admin SDK.
- Otherwise, it falls back to local file-based storage at `tdretail/.data/db.json`.
- **Multi-Process Cache Invalidation**: The in-memory cache monitors `fs.statSync(DATA_FILE).mtimeMs`. When one Next.js worker or API route writes to disk, other worker threads automatically invalidate their in-memory cache and re-read the latest state.
- **Reseeding**: To reset back to pristine demo data, trigger `POST /api/seed` or click "Reset All Mock Data" in the customer persona modal.

---

## 🔧 Environment Variables Reference

| Variable | App | Required? | Description | Default / Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | `tdretail` | Recommended | Google Gemini API key from AI Studio | Grounded Fallback Engine |
| `NEXT_PUBLIC_APP_URL` | `tdretail` | Yes | TD Retail app URL | `http://localhost:3000` |
| `FIREBASE_PROJECT_ID` | `tdretail` | Optional | Google Cloud project for Firestore | Local `.data/db.json` file |
| `SENDGRID_API_KEY` | `tdretail` | Optional | SendGrid API key (`SG.xxx`) | Captured in `/outbox` viewer |
| `SENDGRID_FROM_EMAIL` | `tdretail` | Optional | Sender address for transactional emails | `support@tdretail.example.com` |
| `INBOUND_EMAIL_DOMAIN`| `tdretail` | Optional | SendGrid Inbound Parse domain | `inbound.yourdomain.com` |
| `NEXT_PUBLIC_TD_RETAIL_API_URL` | Storefronts | Yes | Endpoint pointing to TD Retail platform | `http://localhost:3000` |
| `NEXT_PUBLIC_MERCHANT_ID` | Storefronts | Yes | Merchant identifier (`merchant_music` / `merchant_b`) | Injected per storefront |

---

## 🚢 Cloud Run Deployment Commands

### Deploy `tdretail`
```bash
cd tdretail
gcloud run deploy tdretail \
  --source . \
  --region asia-southeast1 \
  --set-env-vars GEMINI_API_KEY="your_gemini_api_key",FIREBASE_PROJECT_ID="your_project_id",SENDGRID_API_KEY="your_sendgrid_key",SENDGRID_FROM_EMAIL="support@yourdomain.com",INBOUND_EMAIL_DOMAIN="inbound.yourdomain.com"
```

### Deploy `music-merchant`
```bash
cd music-merchant
gcloud run deploy music-merchant \
  --source . \
  --region asia-southeast1 \
  --update-build-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>" \
  --update-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>"
```

### Deploy `technology-merchant`
```bash
cd technology-merchant
gcloud run deploy technology-merchant \
  --source . \
  --region asia-southeast1 \
  --update-build-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>" \
  --update-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>"
```

---

## 🧪 Testing & Verification
```bash
# Verify tdretail
cd tdretail
pnpm exec tsc --noEmit
pnpm run build

# Verify music-merchant
cd ../music-merchant
pnpm exec tsc --noEmit
pnpm run build

# Verify technology-merchant
cd ../technology-merchant
pnpm exec tsc --noEmit
pnpm test
pnpm run build
```

