import { NextResponse } from 'next/server';

export async function GET() {
  const tdRetailApiUrl =
    process.env.TD_RETAIL_API_URL ||
    process.env.NEXT_PUBLIC_TD_RETAIL_API_URL ||
    'http://localhost:3000';

  const merchantId =
    process.env.MERCHANT_ID ||
    process.env.NEXT_PUBLIC_MERCHANT_ID ||
    'merchant_music';

  return NextResponse.json(
    {
      tdRetailApiUrl: tdRetailApiUrl.replace(/\/+$/, ''),
      merchantId,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
