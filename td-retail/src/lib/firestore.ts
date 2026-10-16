import { OrderDocument, MerchantId } from "@/types";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore, Query } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// In-memory / file-backed fallback storage location
const DATA_DIR = path.join(process.cwd(), ".data");
const FALLBACK_FILE = path.join(DATA_DIR, "firestore_mock.json");

interface FallbackStore {
  orders: Record<string, OrderDocument>;
}

function getFallbackStore(): FallbackStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FALLBACK_FILE)) {
      const initial: FallbackStore = { orders: {} };
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(FALLBACK_FILE, "utf-8");
    return JSON.parse(raw) as FallbackStore;
  } catch (err) {
    console.warn("[Firestore Local Fallback] Read error, resetting store", err);
    return { orders: {} };
  }
}

function saveFallbackStore(store: FallbackStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[Firestore Local Fallback] Failed to save store", err);
  }
}

let firestoreInstance: Firestore | null = null;
let isRealFirestore = false;

function initFirebase(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firestoreInstance = getFirestore(existingApps[0]);
    isRealFirestore = true;
    return firestoreInstance;
  }

  try {
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      const app = initializeApp({
        credential: cert(serviceAccount),
      });
      firestoreInstance = getFirestore(app);
      isRealFirestore = true;
      console.log("[Firestore] Initialized with FIREBASE_SERVICE_ACCOUNT_KEY");
      return firestoreInstance;
    }

    if (projectId && clientEmail && privateKey) {
      if (privateKey.includes("\\n")) {
        privateKey = privateKey.replace(/\\n/g, "\n");
      }
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      firestoreInstance = getFirestore(app);
      isRealFirestore = true;
      console.log(`[Firestore] Initialized with project ID: ${projectId}`);
      return firestoreInstance;
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const app = initializeApp();
      firestoreInstance = getFirestore(app);
      isRealFirestore = true;
      console.log("[Firestore] Initialized with default credentials");
      return firestoreInstance;
    }
  } catch (err) {
    console.warn(
      "[Firestore] Firebase Admin init failed, falling back to resilient local store:",
      err instanceof Error ? err.message : err
    );
  }

  isRealFirestore = false;
  return null;
}

export function getDatabaseStatus(): {
  mode: "cloud_firestore" | "local_resilient_store";
  projectId?: string;
  itemCount: number;
} {
  const db = initFirebase();
  if (db && isRealFirestore) {
    return {
      mode: "cloud_firestore",
      projectId: process.env.FIREBASE_PROJECT_ID || "cloud-default",
      itemCount: -1,
    };
  }
  const store = getFallbackStore();
  return {
    mode: "local_resilient_store",
    itemCount: Object.keys(store.orders).length,
  };
}

/**
 * Save an order to Firestore (or local fallback store)
 */
export async function saveOrder(order: OrderDocument): Promise<void> {
  const db = initFirebase();
  if (db && isRealFirestore) {
    await db.collection("orders").doc(order.orderId).set(order);
    return;
  }

  const store = getFallbackStore();
  store.orders[order.orderId] = order;
  saveFallbackStore(store);
}

/**
 * Get an order by its unique orderId
 */
export async function getOrderById(orderId: string): Promise<OrderDocument | null> {
  const db = initFirebase();
  if (db && isRealFirestore) {
    const doc = await db.collection("orders").doc(orderId).get();
    if (!doc.exists) return null;
    return doc.data() as OrderDocument;
  }

  const store = getFallbackStore();
  return store.orders[orderId] || null;
}

/**
 * Get all orders for a specific anonymous session and merchant
 */
export async function getOrdersForSession(
  sessionId: string,
  merchantId?: MerchantId
): Promise<OrderDocument[]> {
  const db = initFirebase();
  if (db && isRealFirestore) {
    let query: Query = db
      .collection("orders")
      .where("anonymousSessionId", "==", sessionId);

    if (merchantId) {
      query = query.where("merchantId", "==", merchantId);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => doc.data() as OrderDocument);
  }

  const store = getFallbackStore();
  const allOrders = Object.values(store.orders);

  return allOrders
    .filter((order) => {
      const matchSession = order.anonymousSessionId === sessionId;
      const matchMerchant = merchantId ? order.merchantId === merchantId : true;
      return matchSession && matchMerchant;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Update order status or fields
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<OrderDocument>
): Promise<OrderDocument | null> {
  const now = new Date().toISOString();
  const db = initFirebase();
  if (db && isRealFirestore) {
    const ref = db.collection("orders").doc(orderId);
    await ref.update({ ...updates, updatedAt: now });
    const updatedDoc = await ref.get();
    return updatedDoc.data() as OrderDocument;
  }

  const store = getFallbackStore();
  if (!store.orders[orderId]) return null;

  store.orders[orderId] = {
    ...store.orders[orderId],
    ...updates,
    updatedAt: now,
  };
  saveFallbackStore(store);
  return store.orders[orderId];
}
