import { NextRequest, NextResponse } from 'next/server';
import { TDStore } from '@/lib/firebase/store';
import { OrderStatus } from '@/lib/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-merchant-id',
};

const VALID_STATUSES: OrderStatus[] = [
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await TDStore.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: `Order "${id}" not found.` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: true, order }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // 1. Resolve & validate merchantId
    const merchantId = body.merchantId || req.headers.get('x-merchant-id');
    if (!merchantId) {
      return NextResponse.json(
        { error: 'merchantId is required to update an order.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const merchant = await TDStore.getMerchantById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { error: `Merchant "${merchantId}" is not registered on TD Retail.` },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 2. Locate existing order
    const existingOrder = await TDStore.getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: `Order "${id}" not found.` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // 3. Strict Multi-Merchant Boundary Authorization
    if (existingOrder.merchantId !== merchantId) {
      return NextResponse.json(
        {
          error: `Security Alert: Merchant "${merchantId}" is not authorized to modify order "${id}" belonging to "${existingOrder.merchantId}".`,
        },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    // 4. Validate orderStatus if provided
    if (body.orderStatus && !VALID_STATUSES.includes(body.orderStatus)) {
      return NextResponse.json(
        {
          error: `Invalid orderStatus "${body.orderStatus}". Allowed: ${VALID_STATUSES.join(', ')}.`,
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 5. Update order in store
    const updatedOrder = await TDStore.updateOrder(existingOrder.orderId, body);
    if (!updatedOrder) {
      return NextResponse.json(
        { error: `Failed to update order "${id}".` },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
