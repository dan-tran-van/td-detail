import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "td_session_id";

export function generateSessionId(): string {
  return "sess_" + crypto.randomBytes(16).toString("hex");
}

export function generateOrderAccessToken(): string {
  return "oat_" + crypto.randomBytes(24).toString("hex");
}

export function generateOrderId(merchantPrefix: string): string {
  const cleanPrefix = merchantPrefix.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const randomSuffix = crypto.randomInt(100000, 999999).toString();
  return `ORD-${cleanPrefix}-${randomSuffix}`;
}

/**
 * Get the current anonymous session ID from cookies, or create a new one.
 */
export async function getOrCreateAnonymousSessionId(): Promise<{
  sessionId: string;
  isNew: boolean;
}> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME);

  if (existing?.value) {
    return { sessionId: existing.value, isNew: false };
  }

  const newSessionId = generateSessionId();
  return { sessionId: newSessionId, isNew: true };
}
