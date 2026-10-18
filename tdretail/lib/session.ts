import { cookies, headers } from 'next/headers';
import { Customer } from '@/lib/types';
import { TDStore } from '@/lib/firebase/store';
import { SEED_CUSTOMERS } from '@/lib/data/seedData';
import { initFirebaseAdmin } from '@/lib/firebase/admin';
import { getCustomerSession } from '@/lib/customerSession';

const FIREBASE_TOKEN_COOKIE = 'td_firebase_token';

/**
 * Resolves the active customer using a hybrid approach:
 * 1. Checks for a verified Firebase Auth Bearer token in the Authorization header or cookie.
 * 2. If present and valid, fetches or provisions the authenticated customer in TDStore.
 * 3. Otherwise, resolves via getCustomerSession() (supporting authenticated users & isolated guests).
 */
export async function getCurrentCustomer(): Promise<Customer> {
  // 1. Try Firebase Auth token verification
  const { auth, isConfigured } = initFirebaseAdmin();
  if (isConfigured && auth) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization');
      const cookieStore = await cookies();
      const tokenFromCookie = cookieStore.get(FIREBASE_TOKEN_COOKIE)?.value;

      let idToken: string | null = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        idToken = authHeader.substring(7);
      } else if (tokenFromCookie) {
        idToken = tokenFromCookie;
      }

      if (idToken) {
        const decoded = await auth.verifyIdToken(idToken);
        if (decoded && decoded.email) {
          let customer = await TDStore.getCustomerByEmail(decoded.email);
          if (!customer) {
            // Provision new customer profile from Firebase token
            customer = await TDStore.upsertCustomer({
              id: `cust_${decoded.uid}`,
              name: decoded.name || decoded.email.split('@')[0],
              email: decoded.email,
              avatarUrl: decoded.picture || undefined,
              isGuest: false,
              createdAt: new Date().toISOString(),
            });
          }
          return customer;
        }
      }
    } catch (err) {
      console.warn('[Session] Firebase token validation failed, falling back to customer session:', err);
    }
  }

  // 2. Delegate to Customer Session
  const session = await getCustomerSession();
  return session.customer;
}

export function getDefaultCustomerId(): string {
  return 'cust_sarah_connor';
}

