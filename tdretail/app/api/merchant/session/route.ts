import { NextRequest, NextResponse } from 'next/server';
import { getMerchantSession, setMerchantSession, clearMerchantSession } from '@/lib/merchantSession';
import { TDStore } from '@/lib/firebase/store';

export async function GET(_req: NextRequest) {
  try {
    const session = await getMerchantSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null, merchant: null });
    }
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      merchant: session.merchant,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve merchant session' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, demoMerchantId } = body;

    // 1. Quick 1-Click Demo Login Switcher (e.g. demoMerchantId: 'merchant_music' or 'merchant_b')
    if (demoMerchantId) {
      const targetId = demoMerchantId === 'merchant_a' ? 'merchant_music' : demoMerchantId;
      const merchant = await TDStore.getMerchantById(targetId) || await TDStore.getMerchantById(demoMerchantId);
      if (!merchant) {
        return NextResponse.json(
          { error: `Merchant "${demoMerchantId}" not found.` },
          { status: 404 }
        );
      }

      // Find or create default demo user for this merchant
      let user = (await TDStore.getMerchantUsers()).find(
        (u) => u.merchantId === merchant.id
      );

      if (!user) {
        user = await TDStore.createMerchantUser({
          id: `usr_${merchant.id}_admin`,
          email: `admin@${merchant.id}.store`,
          name: `${merchant.name} Manager`,
          merchantId: merchant.id,
          merchantName: merchant.name,
          role: 'owner',
          createdAt: new Date().toISOString(),
        });
      }

      await setMerchantSession({
        id: user.id,
        email: user.email,
        merchantId: merchant.id,
        role: user.role,
      });

      return NextResponse.json({
        success: true,
        message: `Logged in as ${merchant.name}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          merchantId: merchant.id,
          merchantName: merchant.name,
          role: user.role,
        },
        merchant,
      });
    }

    // 2. Standard Email/Password login
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await TDStore.getMerchantUserByEmail(normalizedEmail);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'No merchant account registered with this email.' },
        { status: 401 }
      );
    }

    const merchant = await TDStore.getMerchantById(existingUser.merchantId);
    if (!merchant) {
      return NextResponse.json(
        { error: 'Linked merchant storefront not found.' },
        { status: 404 }
      );
    }

    await setMerchantSession({
      id: existingUser.id,
      email: existingUser.email,
      merchantId: merchant.id,
      role: existingUser.role,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        merchantId: merchant.id,
        merchantName: merchant.name,
        role: existingUser.role,
      },
      merchant,
    });
  } catch (error: any) {
    console.error('Merchant login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearMerchantSession();
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear merchant session' },
      { status: 500 }
    );
  }
}
