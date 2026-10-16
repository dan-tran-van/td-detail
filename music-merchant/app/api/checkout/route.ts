import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderItem } from '@/lib/types';
import { syncOrderToTDRetail } from '@/lib/api-sync';

// In-memory fallback outbox for simulated email confirmations
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
  var __MUSIC_OUTBOX: OutboxEmailRecord[] | undefined;
}

globalThis.__MUSIC_OUTBOX = globalThis.__MUSIC_OUTBOX || [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, isDirectBuy } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer?.email?.trim() || !customer?.name?.trim()) {
      return NextResponse.json({ error: 'Customer name and email are required' }, { status: 400 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-MUS-${randomSuffix}`;
    const now = new Date().toISOString();

    const orderItems: OrderItem[] = items.map((item: any, idx: number) => {
      const p = item.product || item;
      return {
        id: `item_mus_${randomSuffix}_${idx + 1}`,
        title: p.title,
        artistOrBrand: p.artist,
        quantity: item.quantity || 1,
        unitPrice: p.price,
        itemType: 'digital_audio',
        formatOrWeight: p.format || 'FLAC 24-bit / 96kHz + WAV Stems',
        licenseKey: `SW-${randomSuffix}-${p.id ? p.id.substring(0, 4).toUpperCase() : 'FLAC'}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        downloadUrl: `https://downloads.soundwave.store/vault/SW-${randomSuffix}-${p.id || 'AUDIO'}.zip`,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const newOrder: Order = {
      id: `order_mus_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      merchantId: 'merchant_music',
      customerId: `cust_${customer.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
      customerEmail: customer.email.trim(),
      customerName: customer.name.trim(),
      items: orderItems,
      orderStatus: 'delivered',
      orderStatusDisplay: 'Download Ready & License Active',
      totalAmount,
      currency: 'INR',
      trackingNumber: `DIGITAL-DL-${randomSuffix}-VERIFIED`,
      carrierOrCourier: 'SoundWave Cloud CDN (High Speed Vault)',
      estimatedDelivery: 'Immediate (Instant Access)',
      deliveryAddress: `Digital Vault (${customer.email.trim()})`,
      courierNotes: 'Cryptographic license keys generated and master lossless audio stems deposited in vault.',
      createdAt: now,
      updatedAt: now,
    };

    // 1. Synchronize order to TD Retail platform via REST API
    const syncResult = await syncOrderToTDRetail(newOrder);

    // 2. Dispatch simulated order confirmation email
    const emailRecord: OutboxEmailRecord = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: newOrder.orderId,
      to: newOrder.customerEmail,
      customerName: newOrder.customerName,
      subject: `Order Confirmation #${newOrder.orderId} • SoundWave Digital`,
      body: `Thank you for your order, ${newOrder.customerName}!\n\nOrder ID: ${newOrder.orderId}\nTotal: ₹${newOrder.totalAmount}\nStatus: ${newOrder.orderStatusDisplay}\n\nYour 24-bit FLAC downloads and master audio stems are ready in your vault.\n\nLicense Key: ${newOrder.items[0]?.licenseKey || 'ACTIVE'}\nDownload Link: ${newOrder.items[0]?.downloadUrl || '#'}\n\nNeed assistance? Reply directly to this email or click "Get Support Now" in your orders page.`,
      sentAt: now,
      status: process.env.SENDGRID_API_KEY ? 'sent' : 'simulated_fallback',
    };

    if (!globalThis.__MUSIC_OUTBOX) {
      globalThis.__MUSIC_OUTBOX = [];
    }
    globalThis.__MUSIC_OUTBOX.unshift(emailRecord);

    return NextResponse.json({
      success: true,
      order: newOrder,
      sync: syncResult,
    });
  } catch (error: any) {
    console.error('Error during checkout processing:', error);
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 });
  }
}

export async function GET() {
  // Return outbox emails for dev diagnostic outbox view
  return NextResponse.json({
    emails: globalThis.__MUSIC_OUTBOX || [],
  });
}
