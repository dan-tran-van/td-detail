import { NextRequest, NextResponse } from "next/server";
import { getAllDevEmails, clearDevOutbox } from "@/lib/dev-outbox";

export async function GET() {
  const emails = getAllDevEmails();
  return NextResponse.json({
    total: emails.length,
    emails,
  });
}

export async function DELETE() {
  clearDevOutbox();
  return NextResponse.json({ success: true, message: "Dev outbox cleared" });
}
