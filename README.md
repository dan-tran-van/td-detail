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
