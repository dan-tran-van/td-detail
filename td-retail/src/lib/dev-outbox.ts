import { DevEmail } from "@/types";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const OUTBOX_FILE = path.join(DATA_DIR, "dev_outbox.json");

function getOutbox(): DevEmail[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(OUTBOX_FILE)) {
      fs.writeFileSync(OUTBOX_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(OUTBOX_FILE, "utf-8");
    return JSON.parse(raw) as DevEmail[];
  } catch (err) {
    console.warn("[Dev Outbox] Failed to read outbox file", err);
    return [];
  }
}

function saveOutbox(emails: DevEmail[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(OUTBOX_FILE, JSON.stringify(emails, null, 2), "utf-8");
  } catch (err) {
    console.error("[Dev Outbox] Failed to save outbox", err);
  }
}

export function recordDevEmail(email: DevEmail): void {
  const list = getOutbox();
  list.unshift(email);
  // Keep last 100 emails in outbox
  if (list.length > 100) list.pop();
  saveOutbox(list);
}

export function getAllDevEmails(): DevEmail[] {
  return getOutbox();
}

export function getDevEmailById(id: string): DevEmail | undefined {
  return getOutbox().find((e) => e.id === id);
}

export function clearDevOutbox(): void {
  saveOutbox([]);
}
