# SoundWave Digital Storefront (Merchant A)

Lossless digital audio and multi-track master stems storefront for **SoundWave Digital (`merchant_music`)**. Built with Next.js 16 (App Router), shadcn/ui semantic tokens, React Bits physics and typography animations, integrated directly with the **TD Retail** multi-merchant AI customer support resolution platform.

---

## 1. Quickstart & Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run local development server (port 3001)
pnpm dev -p 3001
```

Visit: **`http://localhost:3001`**

---

## 2. Configuration & TD Retail SDK Integration

Configuration is managed in `lib/config.ts`:
- **Local Development**: Automatically discovers and proxies to `http://localhost:3000` when running on `localhost`.
- **Environment Overrides**:
  ```ini
  PORT=3001
  NEXT_PUBLIC_TD_RETAIL_API_URL=http://localhost:3000
  NEXT_PUBLIC_MERCHANT_ID=merchant_music
  ```

---

## 3. Scripts

- `pnpm dev -p 3001`: Start Next.js development server on port 3001
- `pnpm exec tsc --noEmit`: Typecheck codebase
- `pnpm run build`: Production build with Next.js 16 Partial Prerendering (PPR)

---

## 4. Key Architectural Features

1. **Lossless Catalog & Instant Vault**:
   - 5 seeded FLAC releases with bit-perfect audio specs, stem packages, and instant cryptographic license generation.
2. **Zero-Touch Order Sync**:
   - Every checked-out order syncs via `POST /api/orders` to the central `tdretail` platform in the background.
3. **Embedded AI Support Drawer**:
   - Support drawer powered by `tdretail`'s Gemini AI Agent, pre-grounded with order status and digital license key lookups.
