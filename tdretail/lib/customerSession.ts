import { cookies } from 'next/headers';
import { TDStore } from '@/lib/firebase/store';
import { Customer, CustomerAuthPayload, CustomerSessionData } from '@/lib/types';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';

export const CUSTOMER_SESSION_COOKIE = 'td_customer_session';
export const LEGACY_CUSTOMER_ID_COOKIE = 'td_customer_id';

/**
 * Known default demo customers that are treated as fully authenticated.
 */
const KNOWN_DEMO_CUSTOMER_IDS = new Set(SEED_CUSTOMERS.map((c) => c.id));

/**
 * Resolves the active customer session from the SSR cookie.
 * If authenticated, returns { customer, isGuest: false }.
 * If guest or unauthenticated, returns { customer, isGuest: true }.
 */
export async function getCustomerSession(): Promise<CustomerSessionData> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;

    if (sessionCookie) {
      try {
        const decoded = Buffer.from(sessionCookie, 'base64').toString('utf-8');
        const parsed: CustomerAuthPayload = JSON.parse(decoded);

        if (parsed?.customerId) {
          let customer = await TDStore.getCustomer(parsed.customerId);
          if (!customer && parsed.email) {
            customer = await TDStore.getCustomerByEmail(parsed.email);
          }

          if (customer) {
            const isGuest = Boolean(parsed.isGuest || customer.isGuest);
            return {
              customer: {
                ...customer,
                isGuest,
              },
              isGuest,
            };
          }
        }
      } catch (e) {
        console.warn('[CustomerSession] Failed to parse session cookie:', e);
      }
    }

    // Check legacy cookie td_customer_id
    const legacyCustomerId = cookieStore.get(LEGACY_CUSTOMER_ID_COOKIE)?.value;
    if (legacyCustomerId) {
      // If it's a known demo customer (e.g. Sarah Connor / Alex Chen), treat as authenticated
      if (KNOWN_DEMO_CUSTOMER_IDS.has(legacyCustomerId)) {
        const customer = await TDStore.getCustomer(legacyCustomerId);
        if (customer) {
          return { customer: { ...customer, isGuest: false }, isGuest: false };
        }
      }

      // If it's an existing customer or guest
      const customer = await TDStore.getCustomer(legacyCustomerId);
      if (customer) {
        const isGuest = Boolean(customer.isGuest || customer.id.startsWith('cust_guest_') || customer.email.includes('guest'));
        return { customer: { ...customer, isGuest }, isGuest };
      }
    }

    // Default: create a fresh guest customer
    const guestSuffix = Math.random().toString(36).substring(2, 8).toLowerCase();
    const guestId = `cust_guest_${guestSuffix}`;
    const guestEmail = `guest_${guestSuffix}@tdretail.guest`;

    const guestCustomer: Customer = {
      id: guestId,
      name: `Guest Shopper #${guestSuffix.toUpperCase()}`,
      email: guestEmail,
      isGuest: true,
      createdAt: new Date().toISOString(),
    };

    await TDStore.upsertCustomer(guestCustomer);

    return {
      customer: guestCustomer,
      isGuest: true,
    };
  } catch (error: any) {
    if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.name === 'DynamicServerError') {
      throw error;
    }
    console.error('[CustomerSession] Error resolving session:', error);
    // Fallback safe guest
    return {
      customer: {
        id: 'cust_guest_fallback',
        name: 'Guest Shopper',
        email: 'guest@tdretail.guest',
        isGuest: true,
        createdAt: new Date().toISOString(),
      },
      isGuest: true,
    };
  }
}

/**
 * Sets the customer session cookie (HTTP-only or SSR accessible).
 */
export async function setCustomerSession(customer: Customer, isGuest = false): Promise<void> {
  const cookieStore = await cookies();
  const payload: CustomerAuthPayload = {
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
    isGuest,
    createdAt: customer.createdAt || new Date().toISOString(),
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');

  cookieStore.set(CUSTOMER_SESSION_COOKIE, encoded, {
    httpOnly: false, // Accessible by client components for instant reactive UI
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Also maintain td_customer_id for backward compatibility
  cookieStore.set(LEGACY_CUSTOMER_ID_COOKIE, customer.id, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Clears the customer session cookie and returns a fresh guest session.
 */
export async function clearCustomerSession(): Promise<Customer> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  cookieStore.delete(LEGACY_CUSTOMER_ID_COOKIE);

  const guestSuffix = Math.random().toString(36).substring(2, 8).toLowerCase();
  const guestCustomer: Customer = {
    id: `cust_guest_${guestSuffix}`,
    name: `Guest Shopper #${guestSuffix.toUpperCase()}`,
    email: `guest_${guestSuffix}@tdretail.guest`,
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  await TDStore.upsertCustomer(guestCustomer);
  await setCustomerSession(guestCustomer, true);
  return guestCustomer;
}
