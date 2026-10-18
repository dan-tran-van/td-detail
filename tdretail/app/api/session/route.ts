import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession, setCustomerSession } from '@/lib/customerSession';
import { TDStore } from '@/lib/firebase/store';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';
import { Customer } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paramEmail = searchParams.get('customerEmail');
  const paramName = searchParams.get('customerName');
  const paramId = searchParams.get('customerId');

  // If incoming link from storefront provides visitor details, provision/resolve that customer session
  if (paramEmail) {
    const email = paramEmail.trim().toLowerCase();
    let customer = await TDStore.getCustomerByEmail(email);
    const isGuest = !SEED_CUSTOMERS.some((c) => c.email.toLowerCase() === email);

    if (!customer) {
      const generatedId = paramId || `cust_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      customer = await TDStore.upsertCustomer({
        id: generatedId,
        name: paramName?.trim() || email.split('@')[0],
        email,
        isGuest,
        createdAt: new Date().toISOString(),
      });
    }

    if (customer) {
      await setCustomerSession(customer, isGuest);
      return NextResponse.json({
        customer,
        isGuest,
        availableCustomers: SEED_CUSTOMERS,
      });
    }
  }

  const session = await getCustomerSession();
  return NextResponse.json({
    customer: session.customer,
    isGuest: session.isGuest,
    availableCustomers: SEED_CUSTOMERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let customer: Customer | null = null;

    if (body.customerId) {
      customer = await TDStore.getCustomer(body.customerId);
    } else if (body.customerEmail || body.email) {
      const email = (body.customerEmail || body.email).trim().toLowerCase();
      customer = await TDStore.getCustomerByEmail(email);
      if (!customer) {
        const id = body.customerId || `cust_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
        customer = await TDStore.upsertCustomer({
          id,
          name: (body.customerName || body.name)?.trim() || email.split('@')[0],
          email,
          isGuest: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const isGuest = Boolean(body.isGuest ?? (customer.isGuest || customer.id.startsWith('cust_guest_')));
    await setCustomerSession(customer, isGuest);

    return NextResponse.json({ success: true, customer, isGuest });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch customer session' }, { status: 500 });
  }
}
