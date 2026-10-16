# TD Retail: Multi-Merchant E-Commerce Demo Storefronts

A full-stack, data-driven e-commerce demo simulating two distinct retail merchants with an embedded **TD Retail AI customer-support resolution platform**. Built for hackathon evaluation using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Firebase Admin SDK (Firestore)**, **SendGrid**, and **pnpm** on **Node 24**.

---

## 🌟 Executive Overview

In the TD Retail vision, independent merchants integrate a shared AI-powered customer resolution layer that handles inquiries, order lookups, returns, and human escalations within the merchant's native brand experience.

This project delivers two completely distinct, credible merchant storefronts powered by a unified, data-driven storefront engine:

| Merchant | Identity | Aesthetic & Theme | Seeded Catalog | Policy & Guarantee |
| :--- | :--- | :--- | :--- | :--- |
| **Merchant A** (`/merchant-a`) | **Aura Soundworks** | Obsidian Dark Navy & Champagne Gold (`#D4AF37`) | 5 Reference Audiophile Audio Products (₹12,499 – ₹42,500) | 30-Day Critical Listening Guarantee, 2-Year Acoustic Warranty |
| **Merchant B** (`/merchant-b`) | **Terra Botanica** | Botanical Emerald & Warm Sand (`#059669`) | 5 Artisanal Organic Home & Skincare Essentials (₹2,499 – ₹5,200) | 14-Day Freshness Return Guarantee, 100% Carbon-Neutral Shipping |

Both storefronts share the exact same underlying component architecture, making them readily deployable to independent custom domains with zero code rewrites.

---

## 🚀 Key Features

### 1. Data-Driven Storefronts & 5 Seeded Products
- Each merchant displays **exactly 5 seeded products** with crisp local vector artwork, INR (`₹`) pricing, descriptions, technical specs, and availability badges.
- **Add to Cart** with quantity controls and instant feedback.
- **Buy Now** button for instant one-click simulated purchase bypassing the cart.

### 2. Merchant Cart Isolation & Persistence
- Dedicated cart routes: `/merchant-a/cart` and `/merchant-b/cart`.
- **Strict Merchant Isolation**: Adding an item on Merchant A never pollutes Merchant B's cart.
- Cart state persists across page navigation and browser reloads via anonymous browser sessions and scoped localStorage keys.

### 3. Simulated Checkout & Server-Side Security
- Dedicated checkout routes: `/merchant-a/checkout` and `/merchant-b/checkout`.
- Captures Customer Name, Email, and optional Phone number.
- **Server-Side Price Validation**: Recalculates all line totals and subtotals directly from the source-of-truth product catalog to prevent client-side price tampering.
- Generates unique order IDs (`ORD-AURA-XXXXXX` and `ORD-TERRA-XXXXXX`) and cryptographically random `orderAccessToken`s.
- **No Payment Gateway**: Simulates payment collection and creates immediate order records in Firestore.

### 4. Shared Firestore Database (Firebase Admin SDK)
- Standardized `orders` collection schema coordinated with TD Retail.
- Documents contain `orderId`, `merchantId`, `customerName`, `customerEmail`, `customerPhone`, `items`, `subtotal`, `currency` ("INR"), `orderStatus` ("CONFIRMED"), `createdAt`, `updatedAt`, `anonymousSessionId`, `orderAccessToken`, and `emailStatus`.
- **Resilient Fallback Mode**: When running locally without cloud Firebase credentials, automatically utilizes a persistent file-backed JSON store in `.data/firestore_mock.json` that provides identical query semantics.

### 5. SendGrid Email Integration & Dev Email Outbox
- Dispatches order confirmation emails with merchant branding, order reference, breakdown, and "Get Support Now" deep links.
- **Case-Specific Reply-To**: Configures Reply-To address (`order-<orderId>@reply.tdretail.demo`) so customer replies route directly into the TD Retail resolution pipeline.
- **Fault-Tolerant**: Email failures are captured honestly without failing the order transaction.
- **Interactive Dev Email Outbox**: If `SENDGRID_API_KEY` is not provided, emails are captured into a local outbox. Accessible via the bottom-left floating badge or `/api/dev/emails` to preview rendered HTML, headers, and reply routing.

### 6. Embedded TD Retail Support Chat Widget
- Embedded across all pages (product catalogue, cart, checkout, orders, confirmation).
- Adapts dynamically to the active merchant's branding and color tokens.
- **Verified Order Context**: Clicking **"Get Support Now"** on any order card launches the chat with verified order context pre-loaded.
- **Tool-Backed Outcomes**: Displays badges for automated actions (order lookup, return policy evaluation, delivery estimates).
- **Human Escalation**: Provides a **"Request Human Agent"** action that creates a priority ticket (`TDR-ESC-XXXXX`) and notifies customer service.
- **Configurable Backend**: Proxies upstream to `TD_RETAIL_API_URL` when provided, or uses its built-in TD Retail AI engine when running standalone.

### 7. Order Privacy & Anonymous Authorization
- No customer passwords or signup required.
- Orders are queryable only by the matching `anonymousSessionId` cookie or via a secure `orderAccessToken`.
- Cross-session customer orders cannot be accessed or enumerated.

---

## 🛠️ Project Structure

```
td-retail/
├── public/
│   └── products/                  # 10 custom SVG product illustrations
│       ├── aura-anc-pro.svg
│       ├── aura-studio-mon.svg
│       ├── ...
│       ├── terra-candle-trio.svg
│       └── terra-diffuser-stone.svg
├── scripts/
│   └── seed.ts                    # Merchant & order seeding script
├── src/
│   ├── __tests__/                 # Automated test suite
│   │   ├── checkout.test.ts
│   │   ├── merchant-separation.test.ts
│   │   └── order-access.test.ts
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts      # TD Retail chat API
│   │   │   ├── dev/emails/route.ts# Dev outbox API
│   │   │   ├── dev/seed/route.ts  # Dev seed API
│   │   │   ├── dev/status/route.ts# System diagnostics API
│   │   │   └── orders/            # Orders & checkout endpoints
│   │   ├── merchant-a/            # Merchant A storefront routes
│   │   ├── merchant-b/            # Merchant B storefront routes
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Demo portal homepage
│   ├── components/
│   │   ├── cart/CartView.tsx
│   │   ├── chat/SupportChatWidget.tsx
│   │   ├── checkout/CheckoutView.tsx
│   │   ├── common/Navbar.tsx & Footer.tsx
│   │   ├── dev/DevOutboxModal.tsx
│   │   ├── orders/OrdersView.tsx
│   │   └── product/ProductCard.tsx
│   ├── config/
│   │   └── merchants.ts           # Merchant definitions & product catalogs
│   ├── context/
│   │   ├── CartContext.tsx        # Merchant-scoped cart state
│   │   └── ChatContext.tsx        # Global support chat state
│   ├── lib/
│   │   ├── dev-outbox.ts          # Local email capture store
│   │   ├── email.ts               # SendGrid email service
│   │   ├── firestore.ts           # Firebase Admin & local fallback store
│   │   └── session.ts             # Session & security token helpers
│   └── types/
│       └── index.ts               # Core TypeScript definitions
├── .env.example
├── vitest.config.ts
└── package.json
```

---

## ⚡ Quick Start

### 1. Requirements
- **Node.js**: v20 or v24 (tested on v24.18.0)
- **pnpm**: v11 or higher (`corepack enable pnpm` or `npm install -g pnpm`)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url> td-retail
cd td-retail

# Install dependencies with pnpm
pnpm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(By default, `.env.local` runs with the local resilient store and local dev email outbox, requiring zero cloud credentials to run immediately).*

### 4. Seed Demo Data
Populate the database with seeded demo orders:
```bash
pnpm seed
```

### 5. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the automated test suite powered by **Vitest**:
```bash
pnpm test
```

The test suite validates:
1. **Checkout & Order Creation**: Order ID formatting, pricing calculations, item validations, and Firestore persistence.
2. **Merchant Separation**: Distinct merchant themes, policies, 5 seeded products each, and strict order query isolation.
3. **Order Access Authorization**: Verifies that anonymous sessions cannot access orders belonging to other customers without valid access tokens.

---

## 🌐 Routes Overview

- **`/`** — Multi-merchant demo portal and diagnostic overview.
- **`/merchant-a`** — Aura Soundworks storefront (5 seeded audio products).
- **`/merchant-a/cart`** — Dedicated cart for Aura Soundworks.
- **`/merchant-a/checkout`** — Simulated checkout for Aura Soundworks.
- **`/merchant-a/orders`** — Orders tracking with "Get Support Now" integration.
- **`/merchant-b`** — Terra Botanica storefront (5 seeded organic products).
- **`/merchant-b/cart`** — Dedicated cart for Terra Botanica.
- **`/merchant-b/checkout`** — Simulated checkout for Terra Botanica.
- **`/merchant-b/orders`** — Orders tracking with "Get Support Now" integration.
- **`/api/dev/emails`** — Interactive dev email inspector endpoint.
- **`/api/dev/status`** — System health and diagnostic status endpoint.

---

## 📬 TD Retail Email & Support Routing

When an order is created:
1. The customer receives an email with order reference, item details, and a **"Get Support Now"** link.
2. The `Reply-To` header is set to `order-<orderId>@reply.tdretail.demo`.
3. When the customer replies to the email, the upstream TD Retail platform extracts the order context from the reply-to address, enabling frictionless, authenticated support without requiring the customer to log in.

---

## 🏆 Hackathon Judges' Inspection Walkthrough

1. **Visit the Demo Portal**: Navigate to `http://localhost:3000/`. Review the side-by-side merchant profiles.
2. **Shop on Merchant A**:
   - Open `/merchant-a`.
   - Add "Aura Horizon ANC Wireless Headphones" and "Aura Pulse Spatial True Wireless Earbuds" to cart.
   - Click **Cart** (`/merchant-a/cart`). Notice line totals and subtotal in INR.
   - Proceed to **Simulated Checkout** (`/merchant-a/checkout`).
   - Enter your name and email, and click **Confirm Purchase**.
   - Note the order confirmation with unique `ORD-AURA-XXXXXX`.
3. **Verify Cart Isolation**:
   - Switch to Merchant B (`/merchant-b`).
   - Open Cart (`/merchant-b/cart`). Notice Merchant B's cart is completely empty.
   - Click **Buy Now** on "Terra Botanical Forest Aromatics Trio" to test direct purchase.
4. **Test Embedded TD Retail Chat**:
   - Open Orders (`/merchant-a/orders`).
   - Click **Get Support Now** on your recent order.
   - Notice the chat widget slides open with the order ID automatically linked.
   - Ask: *"Where is my order?"* or *"What is your return policy?"*.
   - Click **"Request Human Agent"** to observe ticket escalation (`TDR-ESC-XXXXX`).
5. **Inspect Outbox**:
   - Click the floating **Dev Email Outbox** button in the bottom-left corner to preview the dispatched HTML email with the case-specific reply-to header.
