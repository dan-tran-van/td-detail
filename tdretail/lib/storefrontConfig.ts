/**
 * Merchant Storefront URL Resolution Helpers
 */

export const DEFAULT_MERCHANT_STOREFRONTS = {
  music: 'https://music-merchant-215785827581.asia-southeast1.run.app',
  technology: 'https://technology-merchant-215785827581.asia-southeast1.run.app',
};

export function resolveStorefrontUrl(type: 'music' | 'technology'): string {
  if (type === 'music') {
    const envUrl = process.env.NEXT_PUBLIC_MUSIC_MERCHANT_URL;
    if (envUrl && envUrl.trim() !== '') return envUrl.trim().replace(/\/+$/, '');

    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:3001';
    }
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001';
    }

    return DEFAULT_MERCHANT_STOREFRONTS.music;
  }

  if (type === 'technology') {
    const envUrl = process.env.NEXT_PUBLIC_TECH_MERCHANT_URL;
    if (envUrl && envUrl.trim() !== '') return envUrl.trim().replace(/\/+$/, '');

    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:3002';
    }
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      return 'http://localhost:3002';
    }

    return DEFAULT_MERCHANT_STOREFRONTS.technology;
  }

  return '#';
}
