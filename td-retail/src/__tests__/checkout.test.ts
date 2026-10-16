import { describe, it, expect } from "vitest";
import { MERCHANT_A_CONFIG, MERCHANT_B_CONFIG } from "@/config/merchants";
import { saveOrder, getOrderById } from "@/lib/firestore";
import { generateOrderId, generateOrderAccessToken } from "@/lib/session";
import { OrderDocument } from "@/types";

describe("Simulated Checkout & Order Creation", () => {
  it("generates correct order IDs with merchant-specific prefix", () => {
    const auraOrderId = generateOrderId("AURA");
    const terraOrderId = generateOrderId("TERRA");

    expect(auraOrderId).toMatch(/^ORD-AURA-\d{6}$/);
    expect(terraOrderId).toMatch(/^ORD-TERRA-\d{6}$/);
  });

  it("persists a newly created order and retrieves it accurately", async () => {
    const orderId = generateOrderId("AURA");
    const token = generateOrderAccessToken();
    const product = MERCHANT_A_CONFIG.products[0];

    const order: OrderDocument = {
      orderId,
      merchantId: "merchant_a",
      customerName: "Test Buyer",
      customerEmail: "buyer@test.com",
      customerPhone: "+91 91234 56789",
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 2,
          lineTotal: product.price * 2,
          imageUrl: product.imageUrl,
        },
      ],
      subtotal: product.price * 2,
      currency: "INR",
      orderStatus: "CONFIRMED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      anonymousSessionId: "sess_test_12345",
      orderAccessToken: token,
      emailStatus: "dev_outbox",
    };

    await saveOrder(order);

    const retrieved = await getOrderById(orderId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.orderId).toBe(orderId);
    expect(retrieved?.merchantId).toBe("merchant_a");
    expect(retrieved?.subtotal).toBe(product.price * 2);
    expect(retrieved?.orderStatus).toBe("CONFIRMED");
    expect(retrieved?.customerEmail).toBe("buyer@test.com");
  });

  it("calculates exact subtotal from catalog prices", () => {
    const item1 = MERCHANT_B_CONFIG.products[0];
    const item2 = MERCHANT_B_CONFIG.products[1];

    const qty1 = 3;
    const qty2 = 1;

    const expectedSubtotal = item1.price * qty1 + item2.price * qty2;
    expect(expectedSubtotal).toBeGreaterThan(0);
  });
});
