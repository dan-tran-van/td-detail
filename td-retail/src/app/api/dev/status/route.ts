import { NextResponse } from "next/server";
import { getDatabaseStatus } from "@/lib/firestore";
import { getAllDevEmails } from "@/lib/dev-outbox";

export async function GET() {
  const dbStatus = getDatabaseStatus();
  const emails = getAllDevEmails();

  const sendgridConfigured = Boolean(
    process.env.SENDGRID_API_KEY &&
      !process.env.SENDGRID_API_KEY.startsWith("SG.placeholder") &&
      process.env.SENDGRID_API_KEY !== "your-sendgrid-api-key"
  );

  const tdRetailApiUrl = process.env.TD_RETAIL_API_URL || null;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: {
      mode: dbStatus.mode,
      details:
        dbStatus.mode === "cloud_firestore"
          ? `Connected to Google Cloud Firestore (Project: ${dbStatus.projectId})`
          : `Resilient file-backed local store active (.data/firestore_mock.json) with ${dbStatus.itemCount} orders`,
    },
    email: {
      sendgridConfigured,
      mode: sendgridConfigured ? "live_sendgrid" : "local_dev_outbox",
      outboxCount: emails.length,
      fromEmail: process.env.EMAIL_FROM || "no-reply@tdretail.demo",
      merchantASupport:
        process.env.MERCHANT_A_SUPPORT_EMAIL || "support@aurasoundworks.tdretail.demo",
      merchantBSupport:
        process.env.MERCHANT_B_SUPPORT_EMAIL || "care@terrabotanica.tdretail.demo",
    },
    tdRetailIntegration: {
      externalApiConfigured: Boolean(tdRetailApiUrl),
      apiUrl: tdRetailApiUrl,
      mode: tdRetailApiUrl ? "external_proxy" : "built_in_resolution_engine",
    },
  });
}
