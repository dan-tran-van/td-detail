/**
 * TD Retail SDK Configuration & Constants
 * 
 * Centralized configuration module designed to be extracted cleanly into a
 * reusable package/SDK (e.g. `@tdretail/sdk` or `@tdretail/client`).
 */

export interface TDRetailConfig {
  /** Base URL of the central TD Retail platform (e.g. https://tdretail-xxx.run.app) */
  apiUrl: string;
  /** Merchant identifier registered on the TD Retail platform */
  merchantId: string;
}

/**
 * Default fallback configuration.
 * When converting this to an external package, consumers can supply their own
 * config via `initTDRetail({ apiUrl, merchantId })` or environment variables.
 */
export const DEFAULT_TD_RETAIL_CONFIG: TDRetailConfig = {
  apiUrl: 'https://tdretail-215785827581.asia-southeast1.run.app',
  merchantId: 'merchant_music',
};

declare global {
  interface Window {
    __TD_CONFIG?: {
      tdRetailApiUrl?: string;
      merchantId?: string;
    };
  }
}

let activeConfig: TDRetailConfig = { ...DEFAULT_TD_RETAIL_CONFIG };

/**
 * Configure the TD Retail client explicitly.
 * Useful when integrating into standalone applications or package consumers.
 */
export function configureTDRetail(customConfig: Partial<TDRetailConfig>): void {
  activeConfig = {
    ...activeConfig,
    ...customConfig,
  };
}

/**
 * Resolves the active TD Retail API URL in priority order:
 * 1. Window runtime config (injected via `<script>` in HTML)
 * 2. Next.js / Node.js environment variables (NEXT_PUBLIC_TD_RETAIL_API_URL / TD_RETAIL_API_URL)
 * 3. Configured SDK instance config / default production endpoint
 */
export function resolveTDRetailUrl(): string {
  if (typeof window !== 'undefined' && window.__TD_CONFIG?.tdRetailApiUrl) {
    return window.__TD_CONFIG.tdRetailApiUrl.replace(/\/+$/, '');
  }

  const envUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_TD_RETAIL_API_URL) ||
    (typeof process !== 'undefined' && process.env?.TD_RETAIL_API_URL);

  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return activeConfig.apiUrl.replace(/\/+$/, '');
}

/**
 * Resolves the active merchant ID in priority order:
 * 1. Window runtime config
 * 2. Environment variables (NEXT_PUBLIC_MERCHANT_ID / MERCHANT_ID)
 * 3. Configured SDK instance / default ID
 */
export function resolveMerchantId(): string {
  if (typeof window !== 'undefined' && window.__TD_CONFIG?.merchantId) {
    return window.__TD_CONFIG.merchantId;
  }

  const envId =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MERCHANT_ID) ||
    (typeof process !== 'undefined' && process.env?.MERCHANT_ID);

  if (envId && envId.trim() !== '') {
    return envId.trim();
  }

  return activeConfig.merchantId;
}
