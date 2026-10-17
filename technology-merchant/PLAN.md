# Volt Nest Storefront Implementation Plan

## Overview
Volt Nest is the official modern tech accessories merchant (`merchant_b`) storefront for the TD Retail resolution platform.
This plan maps all requirements from `merchant-tech-accessories-prompt.md` and tracks verification across development.

---

## Steps & Verification Status

### Step 1: Scaffold, Dependencies & Quality Tools
- [x] **Goal**: Node 24 + pnpm + Next.js App Router + TS strict + Tailwind + ESLint + Vitest.
- **Files**: `package.json`, `vitest.config.ts`, `.nvmrc`
- **Verification**: `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test`
- **Result**: Core build passes with zero errors; Vitest and Zod installed and configured.

### Step 2: Merchant Config, Branding & Policy Page
- [x] **Goal**: Ensure merchant identity (`merchant_b`), styling variables (electric blue / neon lime on dark charcoal), policy text, and dedicated policy page (`/policy`).
- **Files**: `lib/config.ts`, `app/policy/page.tsx`, `components/Header.tsx`, `app/layout.tsx`
- **Verification**: `pnpm typecheck && pnpm build`
- **Result**: Dedicated policy page live at `/policy` detailing 10-day replacement and 1-year warranty. Header and footer navigation updated.

### Step 3: Product Catalogue & Product Detail Pages (`/products/[id]`)
- [x] **Goal**: 5 seeded products with ID, name, high quality images, specs, stock status, and dedicated product detail page per product (`/products/[id]`).
- **Files**: `lib/products.ts`, `app/products/[id]/page.tsx`, `app/page.tsx`
- **Verification**: `pnpm typecheck && pnpm build`
- **Result**: All 5 products have deep-linkable product detail pages (`/products/[id]`) with responsive specs, warranty highlights, Add to Cart, and Buy Now.

### Step 4: Cart & Session Scoping
- [x] **Goal**: Anonymous session support, merchant scoping (`merchant_b`), line totals, price recalculation protection.
- **Files**: `context/CartContext.tsx`, `app/cart/page.tsx`
- **Verification**: `pnpm test`, `pnpm build`
- **Result**: Cart maintains state across sessions, scoped to merchant_b with live header counter.

### Step 5: Secure Checkout & Server Validation with Zod
- [x] **Goal**: Server-side validation with Zod, catalogue re-pricing (never trust client prices), unique order ID (`ORD-VN-...`), confirmation page (`/orders/[orderId]/confirmation`).
- **Files**: `app/api/checkout/route.ts`, `app/checkout/page.tsx`, `app/orders/[orderId]/confirmation/page.tsx`, `app/orders/[orderId]/page.tsx`
- **Verification**: `pnpm test`, `pnpm build`
- **Result**: Client price tampering ignored; out-of-stock purchases rejected; order confirmation page shows full details and direct support hook.

### Step 6: Order Access & Support Chat Integration
- [x] **Goal**: Embedded TD Retail support widget across pages, preloaded with order context, route proxying to TD Retail.
- **Files**: `components/SupportChatWidget.tsx`, `app/orders/page.tsx`
- **Verification**: `pnpm build`
- **Result**: Support chat opens seamlessly from order list, order details, and confirmation pages.

### Step 7: Tests, .env.example, README & Seed Verification
- [x] **Goal**: Vitest test suites verifying checkout, price calculation, out-of-stock rejection, and merchant isolation; complete docs.
- **Files**: `tests/checkout.test.ts`, `tests/catalogue.test.ts`, `.env.example`, `README.md`, `scripts/seed.mjs`
- **Verification**:
  - `pnpm typecheck`: Clean (0 errors)
  - `pnpm lint`: Clean (0 errors)
  - `pnpm test`: 8/8 tests passing
  - `pnpm seed`: 5/5 products verified
  - `pnpm build`: Successful Next.js 16 build with partial prerendering
- **Result**: All test suites pass 100%. Project is completely finished and production-ready.
