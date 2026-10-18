import { NextRequest, NextResponse } from 'next/server';
import { TDStore } from '@/lib/firebase/store';
import { getCurrentCustomer } from '@/lib/session';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';

// Strict whitelist of evaluation demo personas.
// Any emails sent to active user sessions, real emails, or guest shoppers are strictly excluded.
const DEMO_PERSONA_EMAILS = new Set(SEED_CUSTOMERS.map((c) => c.email.toLowerCase()));

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = (searchParams.get('email') || searchParams.get('customerEmail'))?.trim().toLowerCase();
    const persona = searchParams.get('persona')?.trim().toLowerCase();
    const customer = await getCurrentCustomer();
    const allEmails = await TDStore.getOutboxEmails();

    const responseHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    // Strict security guardrail: Filter ONLY emails sent to demo personas
    const demoEmails = allEmails.filter((e) =>
      DEMO_PERSONA_EMAILS.has(e.to.toLowerCase())
    );

    // If filtering by a specific demo persona (e.g. sarah.connor@example.com)
    const targetFilter = persona || queryEmail;
    let filtered = demoEmails;

    if (targetFilter) {
      if (DEMO_PERSONA_EMAILS.has(targetFilter)) {
        filtered = demoEmails.filter(
          (e) => e.to.toLowerCase() === targetFilter
        );
      } else {
        // Active user sessions or non-demo emails are strictly not exposed
        filtered = [];
      }
    }

    return NextResponse.json(
      {
        emails: filtered,
        totalCount: demoEmails.length,
        filteredCount: filtered.length,
        demoPersonas: Array.from(DEMO_PERSONA_EMAILS),
        isGuarded: true,
      },
      { headers: responseHeaders }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch outbox emails' }, { status: 500 });
  }
}
