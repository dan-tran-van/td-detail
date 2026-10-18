import { NextRequest, NextResponse } from 'next/server';
import { getMerchantSession } from '@/lib/merchantSession';
import { TDStore } from '@/lib/firebase/store';
import { EmailService } from '@/lib/services/emailService';
import { Message } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getMerchantSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversation = await TDStore.getConversationById(id);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.merchantId !== session.merchant.id) {
      return NextResponse.json(
        { error: 'Forbidden: Conversation belongs to another merchant' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { content, resolve } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Reply content cannot be empty' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const message: Message = {
      id: `msg_human_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: conversation.id,
      sender: 'human_agent',
      senderName: `${session.user.name} (${session.merchant.name} Support)`,
      content: content.trim(),
      timestamp,
      createdAt: timestamp,
    };

    await TDStore.addMessage(message);

    // Update conversation metadata
    const nextStatus = resolve ? 'resolved' : 'active';
    await TDStore.updateConversation(conversation.id, {
      status: nextStatus,
      lastMessageSnippet: content.trim().substring(0, 100),
      lastMessageSender: 'human_agent',
      lastMessageAt: timestamp,
      unreadByCustomer: true,
      updatedAt: timestamp,
    });

    // Send email notification to customer if they have an email address
    if (conversation.customerEmail) {
      try {
        await EmailService.sendSupportEmail({
          conversationId: conversation.id,
          to: conversation.customerEmail,
          subject: `Update regarding: ${conversation.subject}`,
          bodyText: content.trim(),
          merchantId: session.merchant.id,
          senderName: `${session.user.name} (${session.merchant.name} Support)`,
        });
      } catch (emailErr) {
        console.warn('Failed to dispatch outbox email for human agent reply:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message,
      conversationStatus: nextStatus,
    });
  } catch (error: any) {
    console.error('Error replying to escalated conversation:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send reply' },
      { status: 500 }
    );
  }
}
