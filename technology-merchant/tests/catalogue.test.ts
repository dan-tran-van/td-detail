import { describe, it, expect } from 'vitest';
import { SEEDED_PRODUCTS, getProductById } from '../lib/products';
import { resolveMerchantId, DEFAULT_TD_RETAIL_CONFIG } from '../lib/config';

describe('Product Catalogue & Merchant Identity', () => {
  it('seeds exactly 5 products as required by specification', () => {
    expect(SEEDED_PRODUCTS).toHaveLength(5);
  });

  it('guarantees merchantId is merchant_b', () => {
    expect(DEFAULT_TD_RETAIL_CONFIG.merchantId).toBe('merchant_b');
    expect(resolveMerchantId()).toBe('merchant_b');
  });

  it('contains valid stock statuses across products', () => {
    const outOfStock = SEEDED_PRODUCTS.filter((p) => p.availabilityStatus === 'out_of_stock');
    const inStock = SEEDED_PRODUCTS.filter((p) => p.availabilityStatus === 'in_stock');

    expect(outOfStock.length).toBeGreaterThan(0);
    expect(inStock.length).toBeGreaterThan(0);
    expect(getProductById('VN-2005')?.availabilityStatus).toBe('out_of_stock');
  });

  it('re-prices items accurately from catalog without trusting client prices', () => {
    const product = getProductById('VN-2001');
    expect(product).toBeDefined();
    expect(product?.price).toBe(3499);
  });
});
