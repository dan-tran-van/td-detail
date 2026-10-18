import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/session';
import { OrderService } from '@/lib/services/orderService';
import { TDStore } from '@/lib/firebase/store';
import { Order } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchantId') || undefined;
    const orderId = searchParams.get('orderId');
    const queryEmail = searchParams.get('customerEmail');
    const queryCustomerId = searchParams.get('customerId');

    if (orderId) {
      const order = await TDStore.getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
      }
      return NextResponse.json({ order }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    let customerIdToUse: string | undefined = undefined;
    if (queryCustomerId) {
      customerIdToUse = queryCustomerId;
    } else if (queryEmail) {
      const existingCustomer = await TDStore.getCustomerByEmail(queryEmail.trim().toLowerCase());
      customerIdToUse = existingCustomer ? existingCustomer.id : undefined;
    } else {
      const customer = await getCurrentCustomer();
      customerIdToUse = customer.id;
    }

    const orders = customerIdToUse
      ? await OrderService.getOrdersForCustomer(customerIdToUse, merchantId)
      : [];

    return NextResponse.json({ orders }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = await getCurrentCustomer();

    const customerEmail = (body.customerEmail || customer.email || '').trim().toLowerCase();
    const customerName = (body.customerName || customer.name || 'Valued Customer').trim();
    const customerId = body.customerId || (customerEmail ? `cust_${customerEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}` : customer.id);

    // Auto-upsert customer profile if absent
    if (customerEmail) {
      const existingCust = await TDStore.getCustomerByEmail(customerEmail);
      if (!existingCust) {
        await TDStore.upsertCustomer({
          id: customerId,
          name: customerName,
          email: customerEmail,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Resolve merchant dynamically and enforce registration
    const merchantId = body.merchantId;
    if (!merchantId) {
      return NextResponse.json({ error: 'merchantId is required.' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const merchant = await TDStore.getMerchantById(merchantId);
    if (!merchant) {
      return NextResponse.json({ error: `Merchant "${merchantId}" is not registered on TD Retail.` }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Dynamic prefix based on merchant category
    let orderPrefix = 'RETL';
    let defaultCarrier = 'Standard Express Delivery';
    let defaultNotes = 'Order confirmed and ready for dispatch.';

    if (merchant) {
      if (merchant.category === 'digital_music') {
        orderPrefix = 'MUS';
        defaultCarrier = 'SoundWave Instant Cloud Delivery';
        defaultNotes = 'License active and master files accessible in customer vault.';
      } else if (merchant.category === 'groceries') {
        orderPrefix = 'GROC';
        defaultCarrier = 'FreshCart Cold-Chain Express';
        defaultNotes = 'Insulated thermal totes packaged at temperature.';
      } else {
        orderPrefix = merchant.category.slice(0, 4).toUpperCase();
        defaultCarrier = `${merchant.name} Fulfillment`;
        defaultNotes = `Order placed with ${merchant.name}.`;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: body.id || `order_${crypto.randomUUID()}`,
      orderId: body.orderId || `ORD-${orderPrefix}-${randomSuffix}`,
      merchantId,
      customerId,
      customerEmail,
      customerName,
      items: body.items || [],
      orderStatus: body.orderStatus || 'processing',
      orderStatusDisplay: body.orderStatusDisplay || 'Order Confirmed & Processing',
      totalAmount: body.totalAmount ?? 19.99,
      currency: body.currency || (merchant?.category === 'digital_music' ? 'INR' : 'USD'),
      trackingNumber: body.trackingNumber || `TRK-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
      carrierOrCourier: body.carrierOrCourier || defaultCarrier,
      estimatedDelivery: body.estimatedDelivery || (merchant?.category === 'digital_music' ? 'Immediate (Instant Access)' : 'Estimated within 1-2 hours'),
      deliveryAddress: body.deliveryAddress || (merchant?.category === 'digital_music' ? `Digital Vault (${customerEmail})` : 'Delivery address on file'),
      courierNotes: body.courierNotes || defaultNotes,
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
    return NextResponse.json({ error: 'Failed to create order' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-merchant-id',
      },
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body.orderId || body.id;

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required in request body.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const merchantId = body.merchantId || req.headers.get('x-merchant-id');
    if (!merchantId) {
      return NextResponse.json(
        { error: 'merchantId is required to update an order.' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const merchant = await TDStore.getMerchantById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { error: `Merchant "${merchantId}" is not registered on TD Retail.` },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const existingOrder = await TDStore.getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json(
        { error: `Order "${orderId}" not found.` },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Cross-merchant boundary check
    if (existingOrder.merchantId !== merchantId) {
      return NextResponse.json(
        {
          error: `Security Alert: Merchant "${merchantId}" is not authorized to modify order "${orderId}" belonging to "${existingOrder.merchantId}".`,
        },
        { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const validStatuses = ['processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];
    if (body.orderStatus && !validStatuses.includes(body.orderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid orderStatus "${body.orderStatus}". Allowed: ${validStatuses.join(', ')}.`,
        },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const updatedOrder = await TDStore.updateOrder(existingOrder.orderId, body);
    if (!updatedOrder) {
      return NextResponse.json(
        { error: `Failed to update order "${orderId}".` },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-merchant-id',
        },
      }
    );
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-merchant-id',
    },
  });
}
