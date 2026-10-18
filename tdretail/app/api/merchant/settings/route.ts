import { NextRequest, NextResponse } from 'next/server';
import { getMerchantSession } from '@/lib/merchantSession';
import { TDStore } from '@/lib/firebase/store';
import { Merchant } from '@/lib/types';
import { isDemoMerchant } from '@/lib/storefrontConfig';

export async function GET(_req: NextRequest) {
  try {
    const session = await getMerchantSession();
    if (!session || !session.merchant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await TDStore.getMerchantById(session.merchant.id);
    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      merchant,
      isDemoProtected: isDemoMerchant(merchant.id),
    });
  } catch (error: any) {
    console.error('[API /api/merchant/settings] Error fetching settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch merchant settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getMerchantSession();
    if (!session || !session.merchant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchantId = session.merchant.id;

    if (isDemoMerchant(merchantId)) {
      return NextResponse.json(
        {
          error: 'Demo merchants (SoundWave Digital, Volt Nest, FreshCart Direct) are protected from modification to preserve a consistent evaluation experience for all visitors. To test editing store details and AI support policies, please register a new merchant via "Register Merchant"!',
          isDemoProtected: true,
        },
        { status: 403 }
      );
    }

    const existing = await TDStore.getMerchantById(merchantId);
    if (!existing) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      name,
      tagline,
      description,
      category,
      brandColor,
      accentColor,
      supportEmail,
      supportMode,
      storefrontUrl,
      supportPolicy,
      demoPromptSuggestions,
    } = body;

    if (name !== undefined && !name.trim()) {
      return NextResponse.json({ error: 'Merchant name cannot be empty.' }, { status: 400 });
    }

    const updatedMerchant: Merchant = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      tagline: tagline !== undefined ? tagline.trim() : existing.tagline,
      description: description !== undefined ? description.trim() : existing.description,
      category: category !== undefined ? category : existing.category,
      brandColor: brandColor !== undefined ? brandColor.trim() : existing.brandColor,
      accentColor: accentColor !== undefined ? accentColor.trim() : existing.accentColor,
      supportEmail: supportEmail !== undefined ? supportEmail.trim().toLowerCase() : existing.supportEmail,
      supportMode: supportMode !== undefined ? supportMode : existing.supportMode,
      storefrontUrl: storefrontUrl !== undefined ? storefrontUrl.trim() : existing.storefrontUrl,
      supportPolicy: {
        returns: supportPolicy?.returns !== undefined ? supportPolicy.returns : existing.supportPolicy?.returns || '',
        refunds: supportPolicy?.refunds !== undefined ? supportPolicy.refunds : existing.supportPolicy?.refunds || '',
        deliveryOrDownload: supportPolicy?.deliveryOrDownload !== undefined ? supportPolicy.deliveryOrDownload : existing.supportPolicy?.deliveryOrDownload || '',
        escalationThreshold: supportPolicy?.escalationThreshold !== undefined ? supportPolicy.escalationThreshold : existing.supportPolicy?.escalationThreshold || '',
      },
      demoPromptSuggestions: Array.isArray(demoPromptSuggestions)
        ? demoPromptSuggestions.filter((p: string) => typeof p === 'string' && p.trim().length > 0)
        : existing.demoPromptSuggestions,
    };

    const saved = await TDStore.upsertMerchant(updatedMerchant);

    return NextResponse.json({
      success: true,
      message: 'Store settings and AI support policies updated successfully.',
      merchant: saved,
    });
  } catch (error: any) {
    console.error('[API /api/merchant/settings] Error updating settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update merchant settings' },
      { status: 500 }
    );
  }
}
