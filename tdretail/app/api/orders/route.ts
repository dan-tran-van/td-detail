import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/session';
import { OrderService } from '@/lib/services/orderService';
import { TDStore } from '@/lib/firebase/store';
import { Order } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const customer = await getCurrentCustomer();
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchantId') || undefined;
    const orderId = searchParams.get('orderId');

    if (orderId) {
      const order = await TDStore.getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    const orders = await OrderService.getOrdersForCustomer(customer.id, merchantId);
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCurrentCustomer();
    const body = await req.json();

    const customerEmail = body.customerEmail || customer.email;
    const customerName = body.customerName || customer.name;
    const customerId = body.customerId || (customerEmail ? `cust_${customerEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}` : customer.id);

    const newOrder: Order = {
      id: body.id || `order_${crypto.randomUUID()}`,
      orderId: body.orderId || `ORD-${body.merchantId === 'merchant_music' ? 'MUS' : 'GROC'}-${Math.floor(1000 + Math.random() * 9000)}`,
      merchantId: body.merchantId || 'merchant_music',
      customerId: customerId,
      customerEmail: customerEmail,
      customerName: customerName,
      items: body.items || [],
      orderStatus: body.orderStatus || 'processing',
      orderStatusDisplay: body.orderStatusDisplay || 'Order Confirmed & Processing',
      totalAmount: body.totalAmount ?? 19.99,
      currency: body.currency || 'INR',
      trackingNumber: body.trackingNumber || `TRK-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
      carrierOrCourier: body.carrierOrCourier || 'SoundWave Instant Cloud Delivery',
      estimatedDelivery: body.estimatedDelivery || 'Immediate (Instant Access)',
      deliveryAddress: body.deliveryAddress || `Digital Vault (${customerEmail})`,
      courierNotes: body.courierNotes || 'License active and master files accessible in customer vault.',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in database (Firestore in prod, db.json in dev)
    await TDStore.addOrder(newOrder);

    return NextResponse.json(
      { success: true, order: newOrder },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error saving order in tdretail API:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
