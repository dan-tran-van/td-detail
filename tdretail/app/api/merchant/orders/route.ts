import { NextRequest, NextResponse } from 'next/server';
import { getMerchantSession } from '@/lib/merchantSession';
import { TDStore } from '@/lib/firebase/store';

export async function GET(_req: NextRequest) {
  try {
    const session = await getMerchantSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await TDStore.getOrders(undefined, session.merchant.id);
    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
      merchant: {
        id: session.merchant.id,
        name: session.merchant.name,
      },
    });
  } catch (error: any) {
    if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.name === 'DynamicServerError') {
      throw error;
    }
    console.error('Error fetching merchant orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant orders' },
      { status: 500 }
    );
  }
}
