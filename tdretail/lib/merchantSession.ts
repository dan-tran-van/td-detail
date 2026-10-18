import { cookies } from 'next/headers';
import { TDStore } from '@/lib/firebase/store';
import { MerchantSessionData, MerchantUser, Merchant } from '@/lib/types';

export const MERCHANT_SESSION_COOKIE = 'td_merchant_session';

export interface CookieSessionPayload {
  userId: string;
  email: string;
  merchantId: string;
  role: 'owner' | 'staff';
}

/**
 * Resolves the authenticated merchant session from the HTTP-only cookie.
 * Returns null if not logged in or if the merchant cannot be found.
 */
export async function getMerchantSession(): Promise<MerchantSessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(MERCHANT_SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      return null;
    }

    let parsed: CookieSessionPayload;
    try {
      parsed = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
    } catch {
      return null;
    }

    if (!parsed?.email || !parsed?.merchantId) {
      return null;
    }

    const merchantUser = await TDStore.getMerchantUserByEmail(parsed.email);
    const merchant = await TDStore.getMerchantById(parsed.merchantId);

    if (!merchant) {
      return null;
    }

    return {
      user: {
        id: merchantUser?.id || parsed.userId,
        email: parsed.email,
        name: merchantUser?.name || merchant.name,
        merchantId: merchant.id,
        merchantName: merchant.name,
        role: parsed.role || 'owner',
      },
      merchant,
    };
  } catch (error: any) {
    if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.name === 'DynamicServerError') {
      throw error;
    }
    console.error('[MerchantSession] Failed to resolve merchant session:', error);
    return null;
  }
}

/**
 * Creates and sets the merchant session cookie.
 */
export async function setMerchantSession(user: {
  id: string;
  email: string;
  merchantId: string;
  role: 'owner' | 'staff';
}): Promise<void> {
  const cookieStore = await cookies();
  const payload: CookieSessionPayload = {
    userId: user.id,
    email: user.email,
    merchantId: user.merchantId,
    role: user.role,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  cookieStore.set(MERCHANT_SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clears the merchant session cookie.
 */
export async function clearMerchantSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(MERCHANT_SESSION_COOKIE);
}
