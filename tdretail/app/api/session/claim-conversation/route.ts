import { NextRequest, NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customerSession';
import { TDStore } from '@/lib/firebase/store';

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (session.isGuest) {
      return NextResponse.json(
        { error: 'You must be logged in to claim a conversation to your account.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required.' },
        { status: 400 }
      );
    }

    const conversation = await TDStore.getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found.' },
        { status: 404 }
      );
    }

    const claimed = await TDStore.claimConversation(conversationId, session.customer);
    return NextResponse.json({
      success: true,
      conversation: claimed,
    });
  } catch (error: any) {
    console.error('[API] Claim conversation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to claim conversation' },
      { status: 500 }
    );
  }
}
