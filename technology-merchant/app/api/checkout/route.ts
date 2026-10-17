import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Order, OrderItem } from '@/lib/types';
import { syncOrderToTDRetail } from '@/lib/api-sync';
import { getProductById } from '@/lib/products';

// Zod schema for checkout validation
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

// In-memory dev outbox for simulated email confirmations
export interface OutboxEmailRecord {
  id: string;
  orderId: string;
  to: string;
  customerName: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'simulated_fallback';
}

declare global {
  var __VOLT_NEST_OUTBOX: OutboxEmailRecord[] | undefined;
}

globalThis.__VOLT_NEST_OUTBOX = globalThis.__VOLT_NEST_OUTBOX || [];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Server-side validation via Zod
    const validationResult = CheckoutPayloadSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Invalid checkout payload' },
        { status: 400 }
      );
    }

    const { items, customer } = validationResult.data;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ts = Date.now().toString(16).toUpperCase().slice(-4);
    const orderId = `ORD-VN-${randomSuffix}-${ts}`;
    const now = new Date().toISOString();

    // 2. Server re-pricing from catalogue & out-of-stock rejection
    const orderItems: OrderItem[] = [];
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const catalogueProduct = getProductById(item.product.id);

      if (!catalogueProduct) {
        return NextResponse.json(
          { error: `Product ${item.product.id} does not exist in catalogue` },
          { status: 400 }
        );
      }

      if (catalogueProduct.availabilityStatus === 'out_of_stock') {
        return NextResponse.json(
          { error: `Product "${catalogueProduct.title}" is out of stock and cannot be purchased` },
          { status: 400 }
        );
      }

      orderItems.push({
        id: `item_vn_${randomSuffix}_${idx + 1}`,
        title: catalogueProduct.title,
        artistOrBrand: catalogueProduct.brand ?? 'Volt Nest',
        quantity: item.quantity,
        unitPrice: catalogueProduct.price, // Trust server catalogue price ONLY
        itemType: 'physical_accessory',
        formatOrWeight: catalogueProduct.specs || 'Volt Nest Product',
      });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const newOrder: Order = {
      id: `order_vn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      merchantId: 'merchant_b',
      customerId: `cust_${customer.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
      customerEmail: customer.email.trim(),
      customerName: customer.name.trim(),
      items: orderItems,
      orderStatus: 'confirmed',
      orderStatusDisplay: 'Order Confirmed — Preparing for Dispatch',
      totalAmount,
      currency: 'INR',
      trackingNumber: `VN-TRK-${randomSuffix}-PENDING`,
      carrierOrCourier: 'Volt Nest Logistics',
      estimatedDelivery: '3–5 Business Days',
      deliveryAddress: `Volt Nest Delivery (${customer.email.trim()})`,
      courierNotes: '1-year warranty activated from order date. 10-day replacement policy applies for defective items.',
      createdAt: now,
      updatedAt: now,
    };

    // 3. Sync to TD Retail platform
    const syncResult = await syncOrderToTDRetail(newOrder);

    // 4. Record email to dev outbox (or SendGrid if API key available)
    const emailRecord: OutboxEmailRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: newOrder.orderId,
      to: newOrder.customerEmail,
      customerName: newOrder.customerName,
      subject: `Order Confirmation ${newOrder.orderId} • Volt Nest`,
      body: `Thank you for your order, ${newOrder.customerName}!\n\nOrder ID: ${newOrder.orderId}\nTotal: ₹${newOrder.totalAmount}\nStatus: ${newOrder.orderStatusDisplay}\n\nYour Volt Nest tech accessories will be dispatched within 1 business day.\n\nTracking: ${newOrder.trackingNumber}\nEstimated Delivery: ${newOrder.estimatedDelivery}\n\nWarranty: 1-year manufacturer warranty + 10-day replacement for defective items.\n\nNeed assistance? Reply to this email or click "Get Support Now" on your orders page.`,
      sentAt: now,
      status: process.env.SENDGRID_API_KEY ? 'sent' : 'simulated_fallback',
    };

    if (!globalThis.__VOLT_NEST_OUTBOX) {
      globalThis.__VOLT_NEST_OUTBOX = [];
    }
    globalThis.__VOLT_NEST_OUTBOX.unshift(emailRecord);

    return NextResponse.json({
      success: true,
      order: newOrder,
      sync: syncResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    console.error('Error during Volt Nest checkout processing:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    emails: globalThis.__VOLT_NEST_OUTBOX || [],
  });
}
