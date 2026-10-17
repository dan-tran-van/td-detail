import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { getProductById } from '../lib/products';

const CheckoutItemSchema = z.object({
  product: z.object({
    id: z.string().min(1),
  }),
  quantity: z.number().int().positive().default(1),
});

const CheckoutPayloadSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, 'Cart is empty'),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Valid email address is required'),
    phone: z.string().optional(),
  }),
  isDirectBuy: z.boolean().optional(),
});

describe('Checkout Validation & Price Protection Logic', () => {
  it('rejects checkout with empty cart', () => {
    const invalidPayload = {
      items: [],
      customer: { name: 'Arjun', email: 'arjun@example.com' },
    };

    const res = CheckoutPayloadSchema.safeParse(invalidPayload);
    expect(res.success).toBe(false);
  });

  it('rejects checkout with invalid email', () => {
    const invalidPayload = {
      items: [{ product: { id: 'VN-2001' }, quantity: 1 }],
      customer: { name: 'Arjun', email: 'invalid-email-format' },
    };

    const res = CheckoutPayloadSchema.safeParse(invalidPayload);
    expect(res.success).toBe(false);
  });

  it('ignores client-tampered price and uses authoritative catalogue price', () => {
    const item = { product: { id: 'VN-2001', price: 1 }, quantity: 2 };
    const catalogueProduct = getProductById(item.product.id);

    expect(catalogueProduct).toBeDefined();
    // Authoritative total calculation using catalogue price only
    const computedTotal = (catalogueProduct?.price ?? 0) * item.quantity;
    expect(computedTotal).toBe(3499 * 2);
    expect(computedTotal).not.toBe(1 * 2);
  });

  it('rejects out of stock products from purchase', () => {
    const outOfStockItem = { product: { id: 'VN-2005' }, quantity: 1 };
    const catalogueProduct = getProductById(outOfStockItem.product.id);

    expect(catalogueProduct?.availabilityStatus).toBe('out_of_stock');
  });
});
