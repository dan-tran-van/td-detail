import { NextRequest, NextResponse } from "next/server";
import { getOrdersForSession } from "@/lib/firestore";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { MerchantId } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
    const sessionId = sessionCookie?.value;

    if (!sessionId) {
      // No session cookie yet, so customer has no prior orders
      return NextResponse.json({ orders: [] });
    }

    const { searchParams } = new URL(req.url);
    const merchantParam = searchParams.get("merchantId");
    let merchantId: MerchantId | undefined = undefined;

    if (
      merchantParam === "merchant_a" ||
      merchantParam === "merchant-a"
    ) {
      merchantId = "merchant_a";
    } else if (
      merchantParam === "merchant_b" ||
      merchantParam === "merchant-b"
    ) {
      merchantId = "merchant_b";
    }

    const orders = await getOrdersForSession(sessionId, merchantId);

    // Return sanitized orders
    return NextResponse.json({ orders });
  } catch (err: unknown) {
    console.error("[Orders List Error]", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
