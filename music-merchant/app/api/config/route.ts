import { NextResponse } from 'next/server';
import { resolveTDRetailUrl, resolveMerchantId } from '@/lib/config';

export async function GET() {
  const tdRetailApiUrl = resolveTDRetailUrl();
  const merchantId = resolveMerchantId();

  return NextResponse.json(
    {
      tdRetailApiUrl,
      merchantId,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
