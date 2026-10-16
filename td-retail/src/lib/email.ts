import { OrderDocument, DevEmail } from "@/types";
import { getMerchantById } from "@/config/merchants";
import { recordDevEmail } from "./dev-outbox";
import sgMail from "@sendgrid/mail";

export interface SendEmailResult {
  status: "sent" | "failed" | "dev_outbox";
  recipient: string;
  sentAt: string;
  messageId?: string;
  devOutboxId?: string;
  error?: string;
}

export function generateOrderConfirmationHtml(order: OrderDocument): string {
  const merchant = getMerchantById(order.merchantId);
  const merchantName = merchant?.name || order.merchantId;
  const merchantSlug = merchant?.slug || "merchant-a";
  const appBaseUrl =
    process.env.APP_BASE_URL || "http://localhost:3000";
  const supportEmail =
    merchant?.supportEmail || "support@tdretail.demo";
  const supportUrl = `${appBaseUrl}/${merchantSlug}/orders?orderId=${order.orderId}&support=true`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #64748b; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b; text-align: right;">
          ₹${item.price.toLocaleString("en-IN")}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #0f172a; text-align: right; font-weight: 600;">
          ₹${item.lineTotal.toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const brandColor = order.merchantId === "merchant_a" ? "#D4AF37" : "#059669";
  const brandDark = order.merchantId === "merchant_a" ? "#0F172A" : "#06281E";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: ${brandDark}; padding: 32px 28px; text-align: center; border-bottom: 3px solid ${brandColor};">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${merchantName}</h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Official Order Confirmation</p>
            </td>
          </tr>

          <!-- Confirmation Card Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Order Reference ID</p>
                <p style="margin: 6px 0 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: 1px;">${order.orderId}</p>
                <div style="margin-top: 8px;">
                  <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
                    STATUS: ${order.orderStatus}
                  </span>
                </div>
              </div>

              <p style="margin: 0 0 16px; font-size: 15px; color: #334155; line-height: 1.5;">
                Hello <strong>${order.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #475569; line-height: 1.6;">
                Thank you for shopping with <strong>${merchantName}</strong>. Your order has been placed successfully in our multi-merchant platform and is currently being processed.
              </p>

              <!-- Items Table -->
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #f8fafc;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Product</th>
                    <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Price</th>
                    <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="3" style="padding: 14px 12px; text-align: right; font-size: 15px; font-weight: 700; color: #0f172a;">
                      Order Subtotal (${order.currency}):
                    </td>
                    <td style="padding: 14px 12px; text-align: right; font-size: 18px; font-weight: 800; color: #0f172a;">
                      ₹${order.subtotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Customer & Support Section -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">Customer & Delivery Details</h3>
                <p style="margin: 0 0 4px; font-size: 14px; color: #475569;"><strong>Email:</strong> ${order.customerEmail}</p>
                ${order.customerPhone ? `<p style="margin: 0 0 4px; font-size: 14px; color: #475569;"><strong>Phone:</strong> ${order.customerPhone}</p>` : ""}
                <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Merchant Support:</strong> <a href="mailto:${supportEmail}" style="color: ${brandColor}; text-decoration: none;">${supportEmail}</a></p>
              </div>

              <!-- Support CTA Button -->
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${supportUrl}" style="display: inline-block; background-color: ${brandColor}; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  Get Support Now on ${merchantName}
                </a>
                <p style="margin: 10px 0 0; font-size: 13px; color: #64748b;">
                  Clicking this link connects your order directly with the TD Retail AI resolution assistant.
                </p>
              </div>

              <!-- Reply instructions for TD Retail routing -->
              <div style="border-top: 1px dashed #cbd5e1; padding-top: 18px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                  <strong>Need help via email?</strong> You can directly reply to this email! Your reply will be automatically ingested and routed to our TD Retail AI Support Assistant with order context pre-linked.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Simulated E-commerce Demo • Powered by <strong>TD Retail Multi-Merchant AI Support Platform</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(
  order: OrderDocument
): Promise<SendEmailResult> {
  const merchant = getMerchantById(order.merchantId);
  const merchantName = merchant?.name || order.merchantId;
  const merchantSupportEmail =
    merchant?.supportEmail || "support@tdretail.demo";
  const now = new Date().toISOString();

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "no-reply@tdretail.demo";
  const fromName =
    process.env.EMAIL_FROM_NAME || `${merchantName} via TD Retail`;
  
  // Custom case-specific Reply-To address routed to TD Retail support system
  const replyTo = `order-${order.orderId.toLowerCase()}@${
    process.env.REPLY_DOMAIN || "reply.tdretail.demo"
  }`;

  const subject = `Order Confirmed: ${order.orderId} - ${merchantName}`;
  const htmlContent = generateOrderConfirmationHtml(order);

  // If SendGrid API Key is NOT configured, capture to Dev Outbox with full diagnostic fidelity
  if (!apiKey || apiKey.startsWith("SG.placeholder") || apiKey === "your-sendgrid-api-key") {
    const devOutboxId = `dev-mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const devEmail: DevEmail = {
      id: devOutboxId,
      orderId: order.orderId,
      merchantId: order.merchantId,
      merchantName,
      to: order.customerEmail,
      from: fromEmail,
      fromName,
      replyTo,
      subject,
      htmlContent,
      sentAt: now,
      status: "simulated_sent",
    };

    recordDevEmail(devEmail);
    console.log(
      `[Email Service] SENDGRID_API_KEY absent. Simulated email saved to Dev Outbox (ID: ${devOutboxId}) for ${order.customerEmail}. View at /api/dev/emails`
    );

    return {
      status: "dev_outbox",
      recipient: order.customerEmail,
      sentAt: now,
      devOutboxId,
    };
  }

  // Attempt real SendGrid delivery
  try {
    sgMail.setApiKey(apiKey);
    const msg = {
      to: order.customerEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      replyTo: {
        email: replyTo,
        name: `${merchantName} Support (TD Retail)`,
      },
      subject,
      html: htmlContent,
    };

    const [response] = await sgMail.send(msg);
    const messageId = response.headers["x-message-id"] || `sg-${Date.now()}`;

    console.log(
      `[Email Service] Order confirmation email sent via SendGrid to ${order.customerEmail} (MessageId: ${messageId})`
    );

    return {
      status: "sent",
      recipient: order.customerEmail,
      sentAt: now,
      messageId: Array.isArray(messageId) ? messageId[0] : messageId,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "SendGrid delivery failed";
    console.error("[Email Service] SendGrid delivery error:", errorMessage);

    // Also preserve in Dev Outbox for post-mortem debugging
    const devOutboxId = `failed-mail-${Date.now()}`;
    recordDevEmail({
      id: devOutboxId,
      orderId: order.orderId,
      merchantId: order.merchantId,
      merchantName,
      to: order.customerEmail,
      from: fromEmail,
      fromName,
      replyTo,
      subject,
      htmlContent,
      sentAt: now,
      status: "failed",
    });

    return {
      status: "failed",
      recipient: order.customerEmail,
      sentAt: now,
      error: errorMessage,
      devOutboxId,
    };
  }
}
