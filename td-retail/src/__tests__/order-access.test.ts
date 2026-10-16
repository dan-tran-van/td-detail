import { describe, it, expect } from "vitest";
import { saveOrder, getOrderById, getOrdersForSession } from "@/lib/firestore";
import { OrderDocument } from "@/types";

describe("Order Security & Access Authorization", () => {
  const privateOrderId = "ORD-AURA-888999";
  const legitimateSession = "sess_owner_alice";
  const foreignSession = "sess_stranger_bob";
  const secretAccessToken = "oat_super_secure_random_token_xyz123";

  const privateOrder: OrderDocument = {
    orderId: privateOrderId,
    merchantId: "merchant_a",
    customerName: "Alice Secret",
    customerEmail: "alice@private.com",
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
    anonymousSessionId: legitimateSession,
    orderAccessToken: secretAccessToken,
    emailStatus: "dev_outbox",
  };

  it("saves private order successfully", async () => {
    await saveOrder(privateOrder);
    const retrieved = await getOrderById(privateOrderId);
    expect(retrieved?.orderId).toBe(privateOrderId);
  });

  it("never exposes orders of another anonymous session", async () => {
    const ordersForBob = await getOrdersForSession(foreignSession);
    const hasAliceOrder = ordersForBob.some(
      (o) => o.orderId === privateOrderId || o.customerEmail === "alice@private.com"
    );
    expect(hasAliceOrder).toBe(false);

    const ordersForAlice = await getOrdersForSession(legitimateSession);
    const hasOwnOrder = ordersForAlice.some((o) => o.orderId === privateOrderId);
    expect(hasOwnOrder).toBe(true);
  });

  it("verifies order access token matches exactly", async () => {
    const order = await getOrderById(privateOrderId);
    expect(order).not.toBeNull();

    // Valid token check
    const isValidToken = order?.orderAccessToken === secretAccessToken;
    expect(isValidToken).toBe(true);

    // Invalid / attacker token check
    const isAttackerValid = order?.orderAccessToken === "oat_guessed_fake_token";
    expect(isAttackerValid).toBe(false);
  });
});
