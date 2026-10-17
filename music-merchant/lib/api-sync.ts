import { Order, SupportConversation, SupportMessage } from './types';

declare global {
  interface Window {
    __TD_CONFIG?: {
      tdRetailApiUrl?: string;
      merchantId?: string;
    };
  }
}

import { resolveTDRetailUrl, resolveMerchantId } from './config';

export function getTDRetailPortalUrl(): string {
  return resolveTDRetailUrl();
}

function getTDRetailApiBase(): string {
  return `${getTDRetailPortalUrl()}/api`;
}

function getMerchantId(): string {
  return resolveMerchantId();
}

/**
 * Sync an order created in music-merchant to the central TD Retail platform API.
 */
export async function syncOrderToTDRetail(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const apiBase = getTDRetailApiBase();
    const res = await fetch(`${apiBase}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...order,
        merchantId: getMerchantId(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[APISync] Could not sync order to TD Retail platform:', err?.message || err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Initialize a support conversation on the TD Retail platform.
 */
export async function createSupportSession(params: {
  orderId?: string;
  order?: Order;
  subject: string;
  initialMessage: string;
  customerEmail: string;
  customerName: string;
}): Promise<{ success: boolean; conversation?: SupportConversation; initialAiReply?: SupportMessage; error?: string }> {
  try {
    if (params.order) {
      await syncOrderToTDRetail(params.order).catch(() => {});
    }

    const apiBase = getTDRetailApiBase();
    const res = await fetch(`${apiBase}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantId: getMerchantId(),
        orderId: params.orderId || params.order?.orderId || undefined,
        subject: params.subject,
        initialMessage: params.initialMessage,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to start inquiry' };
    }

    const aiMessage = data.messages?.find((m: SupportMessage) => m.sender === 'ai');

    return {
      success: true,
      conversation: data.conversation,
      initialAiReply: aiMessage,
    };
  } catch (err: any) {
    console.error('[APISync] Error initiating support session with TD Retail:', err);
    return { success: false, error: err?.message || 'Failed to reach support platform' };
  }
}

/**
 * Fetch messages in an existing conversation thread.
 */
export async function fetchConversationThread(
  conversationId: string,
  customerEmail?: string
): Promise<{
  conversation?: SupportConversation;
  messages: SupportMessage[];
  error?: string;
}> {
  try {
    const apiBase = getTDRetailApiBase();
    const query = customerEmail ? `?customerEmail=${encodeURIComponent(customerEmail)}` : '';
    const res = await fetch(`${apiBase}/conversations/${conversationId}${query}`);
    if (!res.ok) {
      return { messages: [], error: 'Could not load conversation' };
    }
    const data = await res.json();
    return {
      conversation: data.conversation,
      messages: data.messages || [],
    };
  } catch (err: any) {
    return { messages: [], error: err?.message || 'Network error' };
  }
}

/**
 * Send a follow-up message to an existing support conversation on TD Retail.
 */
export async function sendFollowupMessage(
  conversationId: string,
  messageContent: string,
  customer?: { email?: string; id?: string; name?: string }
): Promise<{ success: boolean; aiReply?: SupportMessage; error?: string }> {
  try {
    const apiBase = getTDRetailApiBase();
    const res = await fetch(`${apiBase}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: messageContent,
        customerEmail: customer?.email,
        customerId: customer?.id,
        customerName: customer?.name,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to send message' };
    }

    return {
      success: true,
      aiReply: data.aiMessage,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send message' };
  }
}
