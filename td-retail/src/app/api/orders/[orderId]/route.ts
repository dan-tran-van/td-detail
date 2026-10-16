import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/firestore";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Security validation: verify requester is authorized
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const isSessionOwner =
      sessionCookie && sessionCookie === order.anonymousSessionId;
    const isTokenAuthorized = token && token === order.orderAccessToken;

    if (!isSessionOwner && !isTokenAuthorized) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "Access to this order requires a valid ownership session or secure order access token.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error("[Get Order Error]", err);
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
