import { NextRequest, NextResponse } from 'next/server';
import { TDStore } from '@/lib/firebase/store';
import { getCurrentCustomer } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';
    const customer = await getCurrentCustomer();
    const allEmails = await TDStore.getOutboxEmails();

    if (showAll || !customer?.email) {
      return NextResponse.json({
        emails: allEmails,
        customer,
        totalCount: allEmails.length,
      });
    }

    const customerEmailLower = customer.email.toLowerCase();
    const filtered = allEmails.filter(
      (e) => e.to.toLowerCase() === customerEmailLower
    );

    return NextResponse.json({
      emails: filtered,
      customer,
      totalCount: allEmails.length,
      customerCount: filtered.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch outbox emails' }, { status: 500 });
  }
}
