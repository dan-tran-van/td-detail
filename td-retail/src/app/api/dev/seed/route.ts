import { NextResponse } from "next/server";
import { MERCHANT_A_CONFIG, MERCHANT_B_CONFIG } from "@/config/merchants";
import { saveOrder, getDatabaseStatus } from "@/lib/firestore";
import { OrderDocument } from "@/types";

export async function POST() {
  try {
    const now = new Date();
    const sampleOrderA: OrderDocument = {
      orderId: "ORD-AURA-109284",
      merchantId: "merchant_a",
      customerName: "Priya Nair",
      customerEmail: "priya.nair@example.com",
      customerPhone: "+91 98450 11223",
      items: [
        {
          productId: "aura-anc-pro",
          name: "Aura Horizon ANC Wireless Headphones",
          price: 24999,
          quantity: 1,
          lineTotal: 24999,
          imageUrl: "/products/aura-anc-pro.svg",
        },
      ],
      subtotal: 24999,
      currency: "INR",
      orderStatus: "CONFIRMED",
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      anonymousSessionId: "demo_seed_session_aura",
      orderAccessToken: "oat_demo_seed_aura_token_9988",
      emailStatus: "dev_outbox",
    };

    const sampleOrderB: OrderDocument = {
      orderId: "ORD-TERRA-204918",
      merchantId: "merchant_b",
      customerName: "Rohan Varma",
      customerEmail: "rohan.varma@example.com",
      customerPhone: "+91 99000 88776",
      items: [
        {
          productId: "terra-candle-trio",
          name: "Terra Botanical Forest Aromatics Trio",
          price: 2499,
          quantity: 2,
          lineTotal: 4998,
          imageUrl: "/products/terra-candle-trio.svg",
        },
      ],
      subtotal: 4998,
      currency: "INR",
      orderStatus: "SHIPPED",
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      anonymousSessionId: "demo_seed_session_terra",
      orderAccessToken: "oat_demo_seed_terra_token_7766",
      emailStatus: "dev_outbox",
    };

    await saveOrder(sampleOrderA);
    await saveOrder(sampleOrderB);

    const status = getDatabaseStatus();

    return NextResponse.json({
      success: true,
      message: "Seeded demo orders and validated merchant catalogs",
      database: status,
      seededOrders: [sampleOrderA.orderId, sampleOrderB.orderId],
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Seeding failed", message: String(err) },
      { status: 500 }
    );
  }
}
