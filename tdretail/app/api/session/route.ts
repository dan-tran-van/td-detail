import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentCustomer } from '@/lib/session';
import { TDStore } from '@/lib/firebase/store';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';
import { Customer } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paramEmail = searchParams.get('customerEmail');
  const paramName = searchParams.get('customerName');
  const paramId = searchParams.get('customerId');

  const cookieStore = await cookies();

  // If incoming link from music-merchant provides visitor details, provision/resolve that customer immediately!
  if (paramEmail) {
    const email = paramEmail.trim().toLowerCase();
    let customer = await TDStore.getCustomerByEmail(email);
    if (!customer) {
      const generatedId = paramId || `cust_${paramEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      customer = await TDStore.upsertCustomer({
        id: generatedId,
        name: paramName?.trim() || email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      });
    }

    if (customer) {
      cookieStore.set('td_customer_id', customer.id, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        customer,
        availableCustomers: SEED_CUSTOMERS,
      });
    }
  }

  const customer = await getCurrentCustomer();
  const allCustomers = SEED_CUSTOMERS;
  return NextResponse.json({
    customer,
    availableCustomers: allCustomers,
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
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const cookieStore = await cookies();
    cookieStore.set('td_customer_id', customer.id, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch customer session' }, { status: 500 });
  }
}
