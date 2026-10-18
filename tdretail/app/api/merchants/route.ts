import { NextRequest, NextResponse } from 'next/server';
import { TDStore } from '@/lib/firebase/store';
import { Merchant } from '@/lib/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
    const merchants = await TDStore.getMerchants();
    return NextResponse.json({ merchants }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, category, supportEmail, supportPolicy, storefrontUrl } = body;

    if (!id?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'id and name are required to register a merchant.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const merchantId = id.trim().toLowerCase();
    const existing = await TDStore.getMerchantById(merchantId);

    const now = new Date().toISOString();
    const merchant: Merchant = {
      id: merchantId,
      name: name.trim(),
      slug: body.slug || merchantId.replace(/[^a-z0-9]/g, '-'),
      category: category || 'general',
      tagline: body.tagline || `${name} Storefront`,
      description: body.description || `${name} registered storefront on TD Retail.`,
      brandColor: body.brandColor || '#3b82f6',
      accentColor: body.accentColor || '#10b981',
      iconName: body.iconName || 'store',
      supportEmail: supportEmail || `support@${merchantId}.store`,
      supportMode: body.supportMode || 'hybrid_ai_human',
      supportPolicy: {
        returns: supportPolicy?.returns || 'Returns accepted within standard 14 days of delivery.',
        refunds: supportPolicy?.refunds || 'Refunds processed within 3-5 business days upon approved return.',
        deliveryOrDownload: supportPolicy?.deliveryOrDownload || 'Dispatched via tracked standard courier.',
        escalationThreshold: supportPolicy?.escalationThreshold || 'Disputes over $50 escalate to senior human support.',
      },
      demoPromptSuggestions: body.demoPromptSuggestions || [
        `What is the return policy for ${name}?`,
        `Where is my order status?`,
        `How do I contact customer support?`,
      ],
      storefrontUrl: storefrontUrl || 'http://localhost:3000',
      createdAt: existing?.createdAt || now,
    };

    const saved = await TDStore.upsertMerchant(merchant);

    return NextResponse.json(
      {
        success: true,
        merchant: saved,
        message: existing ? 'Merchant updated successfully.' : 'Merchant registered successfully.',
      },
      { status: existing ? 200 : 201, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('[API /api/merchants] Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to register merchant' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
