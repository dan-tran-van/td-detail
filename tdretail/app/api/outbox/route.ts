import { NextRequest, NextResponse } from 'next/server';
import { TDStore } from '@/lib/firebase/store';
import { getCurrentCustomer } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';
    const queryEmail = searchParams.get('customerEmail')?.trim().toLowerCase();
    const customer = await getCurrentCustomer();
    const allEmails = await TDStore.getOutboxEmails();

    const responseHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (showAll || (!customer?.email && !queryEmail)) {
      return NextResponse.json({
        emails: allEmails,
        customer,
        totalCount: allEmails.length,
      }, { headers: responseHeaders });
    }

    const targetEmail = queryEmail || customer.email.toLowerCase();
    const filtered = allEmails.filter(
      (e) => e.to.toLowerCase() === targetEmail
    );

    return NextResponse.json({
      emails: filtered,
      customer,
      totalCount: allEmails.length,
      customerCount: filtered.length,
    }, { headers: responseHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch outbox emails' }, { status: 500 });
  }
}
