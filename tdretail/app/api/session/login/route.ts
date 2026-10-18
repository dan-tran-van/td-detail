import { NextRequest, NextResponse } from 'next/server';
import { setCustomerSession } from '@/lib/customerSession';
import { TDStore } from '@/lib/firebase/store';
import { Customer } from '@/lib/types';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personaId, email, name, claimConversationId } = body;

    let customer: Customer | null = null;

    // 1. 1-Click Demo Persona login
    if (personaId) {
      customer = await TDStore.getCustomer(personaId);
      if (!customer) {
        customer = SEED_CUSTOMERS.find((c) => c.id === personaId) || null;
        if (customer) {
          await TDStore.upsertCustomer(customer);
        }
      }
    } else if (email && email.trim()) {
      // 2. Custom customer email login or registration
      const cleanEmail = email.trim().toLowerCase();
      customer = await TDStore.getCustomerByEmail(cleanEmail);

      if (!customer) {
        // Automatically create account for testing
        const generatedId = `cust_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
        customer = await TDStore.upsertCustomer({
          id: generatedId,
          name: name?.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          isGuest: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Valid personaId or email is required for login.' },
        { status: 400 }
      );
    }

    // Ensure isGuest flag is explicitly false upon authenticating
    customer = {
      ...customer,
      isGuest: false,
    };
    await TDStore.upsertCustomer(customer);
    await setCustomerSession(customer, false);

    // 3. Seamless data handoff / conversation claiming
    let claimedConversation = null;
    if (claimConversationId) {
      claimedConversation = await TDStore.claimConversation(claimConversationId, customer);
    }

    return NextResponse.json({
      success: true,
      customer,
      isGuest: false,
      claimedConversation,
    });
  } catch (error: any) {
    console.error('[API] Customer login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
