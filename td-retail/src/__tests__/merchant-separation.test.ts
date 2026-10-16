import { describe, it, expect } from "vitest";
import {
  MERCHANT_A_CONFIG,
  MERCHANT_B_CONFIG,
  getMerchantById,
} from "@/config/merchants";
import { saveOrder, getOrdersForSession } from "@/lib/firestore";
import { OrderDocument } from "@/types";

describe("Merchant Separation & Cart/Order Isolation", () => {
  it("maintains distinct merchant identities and policies", () => {
    expect(MERCHANT_A_CONFIG.id).toBe("merchant_a");
    expect(MERCHANT_B_CONFIG.id).toBe("merchant_b");

    expect(MERCHANT_A_CONFIG.name).not.toBe(MERCHANT_B_CONFIG.name);
    expect(MERCHANT_A_CONFIG.supportEmail).not.toBe(
      MERCHANT_B_CONFIG.supportEmail
    );
    expect(MERCHANT_A_CONFIG.supportPolicy.returnWindowDays).toBe(30);
    expect(MERCHANT_B_CONFIG.supportPolicy.returnWindowDays).toBe(14);
  });

  it("seeds exactly 5 products per merchant with INR prices", () => {
    expect(MERCHANT_A_CONFIG.products).toHaveLength(5);
    expect(MERCHANT_B_CONFIG.products).toHaveLength(5);

    MERCHANT_A_CONFIG.products.forEach((p) => {
      expect(p.merchantId).toBe("merchant_a");
      expect(p.price).toBeGreaterThan(0);
      expect(p.name).toBeTruthy();
      expect(p.id).toBeTruthy();
    });

    MERCHANT_B_CONFIG.products.forEach((p) => {
      expect(p.merchantId).toBe("merchant_b");
      expect(p.price).toBeGreaterThan(0);
      expect(p.name).toBeTruthy();
      expect(p.id).toBeTruthy();
    });

    // Ensure no product IDs overlap between merchants
    const idsA = new Set(MERCHANT_A_CONFIG.products.map((p) => p.id));
    MERCHANT_B_CONFIG.products.forEach((p) => {
      expect(idsA.has(p.id)).toBe(false);
    });
  });

  it("isolates orders by merchant even for the same anonymous session", async () => {
    const testSession = "sess_multi_merchant_user_777";

    const orderA: OrderDocument = {
      orderId: "ORD-AURA-777001",
      merchantId: "merchant_a",
      customerName: "Dual Shopper",
      customerEmail: "shopper@test.com",
      items: [
        {
          productId: "aura-anc-pro",
          name: "Aura Horizon ANC Wireless Headphones",
          price: 24999,
          quantity: 1,
          lineTotal: 24999,
        },
      ],
      subtotal: 24999,
      currency: "INR",
      orderStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      anonymousSessionId: testSession,
      orderAccessToken: "token_a_777",
      emailStatus: "dev_outbox",
    };

    const orderB: OrderDocument = {
      orderId: "ORD-TERRA-777002",
      merchantId: "merchant_b",
      customerName: "Dual Shopper",
      customerEmail: "shopper@test.com",
      items: [
        {
          productId: "terra-candle-trio",
          name: "Terra Botanical Forest Aromatics Trio",
          price: 2499,
          quantity: 1,
          lineTotal: 2499,
        },
      ],
      subtotal: 2499,
      currency: "INR",
      orderStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      anonymousSessionId: testSession,
      orderAccessToken: "token_b_777",
      emailStatus: "dev_outbox",
    };

    await saveOrder(orderA);
    await saveOrder(orderB);

    // Query orders specifically for Merchant A
    const ordersA = await getOrdersForSession(testSession, "merchant_a");
    expect(ordersA.some((o) => o.orderId === "ORD-AURA-777001")).toBe(true);
    expect(ordersA.some((o) => o.orderId === "ORD-TERRA-777002")).toBe(false);

    // Query orders specifically for Merchant B
    const ordersB = await getOrdersForSession(testSession, "merchant_b");
    expect(ordersB.some((o) => o.orderId === "ORD-TERRA-777002")).toBe(true);
    expect(ordersB.some((o) => o.orderId === "ORD-AURA-777001")).toBe(false);
  });
});
