import { NextRequest, NextResponse } from 'next/server';
import { getMerchantSession } from '@/lib/merchantSession';
import { TDStore } from '@/lib/firebase/store';

export async function GET(req: NextRequest) {
  try {
    const session = await getMerchantSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const conversation = await TDStore.getConversationById(conversationId);
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Security check: ensure conversation belongs to current merchant
      if (conversation.merchantId !== session.merchant.id) {
        return NextResponse.json(
          { error: 'Forbidden: Conversation belongs to another merchant' },
          { status: 403 }
        );
      }

      const messages = await TDStore.getMessages(conversationId);
      return NextResponse.json({
        success: true,
        conversation,
        messages,
      });
    }

    const escalations = await TDStore.getEscalatedConversations(session.merchant.id);
    return NextResponse.json({
      success: true,
      escalations,
      count: escalations.length,
    });
  } catch (error: any) {
    if (error?.digest === 'HANGING_PROMISE_REJECTION' || error?.name === 'DynamicServerError') {
      throw error;
    }
    console.error('Error fetching merchant escalations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escalations' },
      { status: 500 }
    );
  }
}
