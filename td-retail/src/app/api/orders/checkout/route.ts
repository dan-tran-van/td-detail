import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMerchantById, MERCHANTS } from "@/config/merchants";
import { saveOrder, updateOrder } from "@/lib/firestore";
import { sendOrderConfirmationEmail } from "@/lib/email";
import {
  generateOrderId,
  generateOrderAccessToken,
  getOrCreateAnonymousSessionId,
  SESSION_COOKIE_NAME,
} from "@/lib/session";
import { OrderDocument, OrderItem, MerchantId } from "@/types";

const CheckoutItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

const CheckoutRequestSchema = z.object({
  merchantId: z.enum(["merchant_a", "merchant_b", "merchant-a", "merchant-b"]),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().trim().email("Invalid email address"),
  customerPhone: z.string().trim().optional(),
  items: z.array(CheckoutItemSchema).min(1, "At least one item is required"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      merchantId: rawMerchantId,
      customerName,
      customerEmail,
      customerPhone,
      items: requestedItems,
    } = parsed.data;

    // Normalize merchant ID
    const merchantId: MerchantId =
      rawMerchantId === "merchant_b" || rawMerchantId === "merchant-b"
        ? "merchant_b"
        : "merchant_a";

    const merchant = getMerchantById(merchantId);
    if (!merchant) {
      return NextResponse.json(
        { error: "Invalid merchant specified" },
        { status: 400 }
      );
    }

    // Server-side product price validation & calculation (Never trust client prices!)
    const validatedItems: OrderItem[] = [];
    let subtotal = 0;

    for (const reqItem of requestedItems) {
      const catalogProduct = merchant.products.find(
        (p) => p.id === reqItem.productId
      );

      if (!catalogProduct) {
        return NextResponse.json(
          {
            error: `Product '${reqItem.productId}' is not available in ${merchant.name} catalogue`,
          },
          { status: 400 }
        );
      }

      const lineTotal = catalogProduct.price * reqItem.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        productId: catalogProduct.id,
        name: catalogProduct.name,
        price: catalogProduct.price,
        quantity: reqItem.quantity,
        lineTotal,
        imageUrl: catalogProduct.imageUrl,
      });
    }

    // Session resolution
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
    let anonymousSessionId = sessionCookie?.value;
    let shouldSetCookie = false;

    if (!anonymousSessionId) {
      const sessionResult = await getOrCreateAnonymousSessionId();
      anonymousSessionId = sessionResult.sessionId;
      shouldSetCookie = true;
    }

    const merchantPrefix = merchantId === "merchant_a" ? "AURA" : "TERRA";
    const orderId = generateOrderId(merchantPrefix);
    const orderAccessToken = generateOrderAccessToken();
    const now = new Date().toISOString();

    const order: OrderDocument = {
      orderId,
      merchantId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      items: validatedItems,
      subtotal,
      currency: "INR",
      orderStatus: "CONFIRMED",
      createdAt: now,
      updatedAt: now,
      anonymousSessionId,
      orderAccessToken,
      emailStatus: "dev_outbox",
    };

    // 1. Save order to Firestore / local repository
    await saveOrder(order);

    // 2. Attempt email dispatch (asynchronous, does not fail order if email fails)
    let emailStatus: "sent" | "failed" | "dev_outbox" = "dev_outbox";
    try {
      const emailResult = await sendOrderConfirmationEmail(order);
      emailStatus = emailResult.status;
      await updateOrder(orderId, {
        emailStatus,
        emailDetails: {
          recipient: customerEmail,
          sentAt: emailResult.sentAt,
          messageId: emailResult.messageId,
          error: emailResult.error,
          devOutboxId: emailResult.devOutboxId,
        },
      });
    } catch (emailErr) {
      console.error("[Checkout] Email dispatch caught error:", emailErr);
      emailStatus = "failed";
      await updateOrder(orderId, {
        emailStatus: "failed",
        emailDetails: {
          recipient: customerEmail,
          error: emailErr instanceof Error ? emailErr.message : "Unknown email error",
        },
      });
    }

    const response = NextResponse.json(
      {
        success: true,
        orderId,
        orderAccessToken,
        merchantId,
        subtotal,
        currency: "INR",
        orderStatus: "CONFIRMED",
        emailStatus,
        customerEmail,
        viewOrderUrl: `/${merchant.slug}/orders?orderId=${orderId}&token=${orderAccessToken}`,
      },
      { status: 201 }
    );

    // Set anonymous session cookie if newly generated
    if (shouldSetCookie) {
      response.cookies.set(SESSION_COOKIE_NAME, anonymousSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (err: unknown) {
    console.error("[Checkout Error]", err);
    return NextResponse.json(
      {
        error: "Internal server error processing checkout",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
