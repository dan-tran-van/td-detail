# TD Retail — Monorepo Architecture

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.5%20Flash%20Lite-4285F4)](https://deepmind.google/technologies/gemini/)
[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Run-4285F4)](https://cloud.google.com/run)
[![SendGrid](https://img.shields.io/badge/SendGrid-Inbound%20Parse-00B2E3)](https://sendgrid.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Admin%20Firestore-FFCA28)](https://firebase.google.com/)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange)](https://pnpm.io/)

An enterprise-grade, multi-merchant customer support resolution platform built for the **TD Retail Hackathon**.

The monorepo contains two coordinated applications:
1. **`tdretail`** (`port 3000`): The centralized multi-merchant customer resolution platform, consolidated inbox, Gemini AI agent with server-grounded tool calling, and SendGrid email routing.
2. **`music-merchant`** (`port 3001`): A standalone participating digital music storefront (**SoundWave Digital**) demonstrating zero-friction cross-merchant order synchronization, visitor isolation, and embedded AI support drawers.

---

## 🏗️ Repository Structure

```
.
├── tdretail/            # Central resolution portal, APIs, and Gemini AI Agent
│   ├── app/             # Next.js App Router (/inbox, /chat, /outbox, /storefront)
│   ├── lib/             # Services (Gemini, Order, Email), Firebase store, types
│   └── components/      # ModernAppShell, ChatThread, PersonaSelector
│
├── music-merchant/      # Independent Digital Audio Storefront (SoundWave Digital)
│   ├── app/             # Storefront catalog, cart, checkout, orders
│   ├── components/      # Storefront UI, SupportChatWidget drawer
│   ├── context/         # VisitorContext, OrderContext, CartContext
│   └── lib/             # api-sync.ts, products catalog
│
├── AGENTS.md            # Monorepo architecture & AI coding agent guidelines
└── README.md            # Monorepo setup, deployment, and live URLs
```

---

## 🚀 Live Deployments (Google Cloud Run)

Both services are containerized and deployed to **Google Cloud Run** in `asia-southeast1`:

| Service | Role | Live URL |
| :--- | :--- | :--- |
| **`tdretail`** | Central Platform & Gemini AI Agent | `https://<tdretail-service-url>` |
| **`music-merchant`** | SoundWave Digital Storefront | `https://<music-merchant-service-url>` |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js `v20+` or `v22+`
- `pnpm` (`v9+` or `v11+`)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Install Dependencies
```bash
# In tdretail
cd tdretail
pnpm install

# In music-merchant
cd ../music-merchant
pnpm install
```

### 2. Configure Environment Variables

**`tdretail/.env.local`**:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional: SendGrid & Firebase Admin
SENDGRID_API_KEY=
FIREBASE_PROJECT_ID=tdretail-demo-project
```

**`music-merchant/.env.local`**:
```ini
PORT=3001
NEXT_PUBLIC_TD_RETAIL_API_URL=http://localhost:3000
NEXT_PUBLIC_MERCHANT_ID=merchant_music
```

### 3. Run Dev Servers Concurrently

Open two terminal windows:

```bash
# Terminal 1: Run TD Retail Central Platform on port 3000
cd tdretail
pnpm dev

# Terminal 2: Run Music Merchant Storefront on port 3001
cd music-merchant
pnpm dev -p 3001
```

Visit:
- SoundWave Digital Storefront: **`http://localhost:3001`**
- TD Retail Central Platform: **`http://localhost:3000`**

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
- `music-merchant` dynamically discovers `tdretail` at runtime via `RootLayout` script injection and `getTDRetailPortalUrl()`, automatically switching between local `http://localhost:3000` and the live Cloud Run backend without hardcoded bundle URLs.

---

## 🚢 Cloud Run Deployment Commands

### Deploy `tdretail`
```bash
cd tdretail
gcloud run deploy tdretail \
  --source . \
  --region asia-southeast1 \
  --set-env-vars GEMINI_API_KEY="your_gemini_api_key"
```

### Deploy `music-merchant`
Next.js bakes `NEXT_PUBLIC_*` variables into the client bundle at **build time** and reads them at **runtime**. When deploying via Cloud Run source build, pass both `--update-build-env-vars` and `--update-env-vars`:

```bash
cd music-merchant
gcloud run deploy music-merchant \
  --source . \
  --region asia-southeast1 \
  --update-build-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>" \
  --update-env-vars="NEXT_PUBLIC_TD_RETAIL_API_URL=https://<your-tdretail-service-url>"
```

---

## 🧪 Testing & Verification
```bash
# Verify music-merchant build
cd music-merchant
pnpm exec tsc --noEmit
pnpm run build

# Verify tdretail build
cd ../tdretail
pnpm exec tsc --noEmit
pnpm run build
```
