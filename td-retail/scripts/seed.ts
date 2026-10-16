import { MERCHANT_A_CONFIG, MERCHANT_B_CONFIG } from "../src/config/merchants";
import { saveOrder, getDatabaseStatus } from "../src/lib/firestore";
import { OrderDocument } from "../src/types";

async function main() {
  console.log("==========================================");
  console.log("TD Retail: Initializing Merchants & Seeds");
  console.log("==========================================");

  const status = getDatabaseStatus();
  console.log(`Database Mode: ${status.mode}`);

  console.log(`\nSeeding Merchant A: ${MERCHANT_A_CONFIG.name}`);
  console.log(`- Products: ${MERCHANT_A_CONFIG.products.length}`);
  MERCHANT_A_CONFIG.products.forEach((p) => {
    console.log(`  • [${p.id}] ${p.name} - ₹${p.price.toLocaleString("en-IN")}`);
  });

  console.log(`\nSeeding Merchant B: ${MERCHANT_B_CONFIG.name}`);
  console.log(`- Products: ${MERCHANT_B_CONFIG.products.length}`);
  MERCHANT_B_CONFIG.products.forEach((p) => {
    console.log(`  • [${p.id}] ${p.name} - ₹${p.price.toLocaleString("en-IN")}`);
  });

  // Seed sample demo orders for quick evaluation
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
      {
        productId: "aura-earbuds-air",
        name: "Aura Pulse Spatial True Wireless Earbuds",
        price: 12499,
        quantity: 1,
        lineTotal: 12499,
        imageUrl: "/products/aura-earbuds-air.svg",
      },
    ],
    subtotal: 37498,
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
      {
        productId: "terra-diffuser-stone",
        name: "Terra Nebulizing Stone Ultrasonic Diffuser",
        price: 4850,
        quantity: 1,
        lineTotal: 4850,
        imageUrl: "/products/terra-diffuser-stone.svg",
      },
    ],
    subtotal: 9848,
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

  console.log("\n✓ Seed orders successfully written to database:");
  console.log(`  1. [${sampleOrderA.orderId}] ${sampleOrderA.customerName} - ₹${sampleOrderA.subtotal.toLocaleString("en-IN")}`);
  console.log(`  2. [${sampleOrderB.orderId}] ${sampleOrderB.customerName} - ₹${sampleOrderB.subtotal.toLocaleString("en-IN")}`);
  console.log("\nSeeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
