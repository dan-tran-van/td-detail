import { NextResponse } from 'next/server';
import { clearCustomerSession } from '@/lib/customerSession';

export async function POST() {
  try {
    const guestCustomer = await clearCustomerSession();
    return NextResponse.json({
      success: true,
      customer: guestCustomer,
      isGuest: true,
    });
  } catch (error: any) {
    console.error('[API] Customer logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
