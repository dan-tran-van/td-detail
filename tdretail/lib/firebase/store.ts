import fs from 'fs';
import path from 'path';
import {
  Merchant,
  Customer,
  Order,
  Conversation,
  Message,
  OutboxEmail,
  MerchantUser,
} from '@/lib/types';
import {
  SEED_CUSTOMERS,
  SEED_MERCHANTS,
  SEED_ORDERS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
} from '@/lib/data/seedData';
import { initFirebaseAdmin } from './admin';

interface StorageSchema {
  merchants: Record<string, Merchant>;
  customers: Record<string, Customer>;
  orders: Record<string, Order>;
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>; // keyed by conversationId
  outbox: OutboxEmail[];
  merchantUsers: Record<string, MerchantUser>; // keyed by email.toLowerCase()
}

// In-memory cache + file persistence fallback
let memoryState: StorageSchema | null = null;
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Ignore if cannot write to filesystem (e.g. read-only env)
    }
  }
}

function getDefaultMerchantUsers(): MerchantUser[] {
  return [
    {
      id: 'usr_soundwave_admin',
      email: 'admin@soundwave.store',
      name: 'SoundWave Store Manager',
      merchantId: 'merchant_music',
      merchantName: 'SoundWave Digital',
      role: 'owner',
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'usr_voltnest_admin',
      email: 'admin@voltnest.store',
      name: 'Volt Nest Store Manager',
      merchantId: 'merchant_b',
      merchantName: 'Volt Nest',
      role: 'owner',
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'usr_platform_admin',
      email: 'admin@tdretail.com',
      name: 'Platform Operations Specialist',
      merchantId: 'merchant_platform',
      merchantName: 'TD Retail Platform Support',
      role: 'owner',
      createdAt: '2026-03-01T00:00:00Z',
    },
  ];
}

function getDefaultState(): StorageSchema {
  const merchants: Record<string, Merchant> = {};
  for (const m of SEED_MERCHANTS) {
    merchants[m.id] = m;
  }

  const customers: Record<string, Customer> = {};
  for (const c of SEED_CUSTOMERS) {
    customers[c.id] = c;
  }

  const orders: Record<string, Order> = {};
  for (const o of SEED_ORDERS) {
    orders[o.orderId] = o;
  }

  const conversations: Record<string, Conversation> = {};
  for (const conv of SEED_CONVERSATIONS) {
    conversations[conv.id] = conv;
  }

  const messages: Record<string, Message[]> = {};
  for (const [convId, msgs] of Object.entries(SEED_MESSAGES)) {
    messages[convId] = [...msgs];
  }

  const merchantUsers: Record<string, MerchantUser> = {};
  for (const u of getDefaultMerchantUsers()) {
    merchantUsers[u.email.toLowerCase()] = u;
  }

  return {
    merchants,
    customers,
    orders,
    conversations,
    messages,
    outbox: [],
    merchantUsers,
  };
}

let lastMtime = 0;

function loadState(): StorageSchema {
  ensureDataDir();
  if (fs.existsSync(DATA_FILE)) {
    try {
      const stat = fs.statSync(DATA_FILE);
      if (memoryState && stat.mtimeMs === lastMtime) {
        return memoryState;
      }
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryState = JSON.parse(data) as StorageSchema;
      lastMtime = stat.mtimeMs;

      // Ensure any newly added seed merchants (e.g. merchant_b) are present
      for (const m of SEED_MERCHANTS) {
        if (!memoryState.merchants[m.id]) {
          memoryState.merchants[m.id] = m;
        }
      }
      // Ensure merchantUsers is present
      if (!memoryState.merchantUsers) {
        memoryState.merchantUsers = {};
        for (const u of getDefaultMerchantUsers()) {
          memoryState.merchantUsers[u.email.toLowerCase()] = u;
        }
      } else {
        if (memoryState.merchantUsers['admin@soundwave.store']) {
          memoryState.merchantUsers['admin@soundwave.store'].merchantId = 'merchant_music';
        }
      }
      // Ensure alias for merchant_a -> merchant_music
      if (memoryState.merchants['merchant_music'] && !memoryState.merchants['merchant_a']) {
        memoryState.merchants['merchant_a'] = memoryState.merchants['merchant_music'];
      }
      return memoryState;
    } catch (err) {
      console.warn('[Store] Failed to read db.json, generating default seed state:', err);
    }
  }

  if (memoryState) return memoryState;

  memoryState = getDefaultState();
  saveState();
  return memoryState;
}

function saveState() {
  if (!memoryState) return;
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryState, null, 2), 'utf-8');
    try {
      lastMtime = fs.statSync(DATA_FILE).mtimeMs;
    } catch {}
  } catch (err) {
    console.warn('[Store] Could not persist state to file, retaining in-memory:', err);
  }
}

export class TDStore {
  // Check if real Firestore should be used
  private static async getFirestoreClient() {
    const { firestore, isConfigured } = initFirebaseAdmin();
    return isConfigured && firestore ? firestore : null;
  }

  // --- Seed / Reset ---
  static async seed(force = false): Promise<{ message: string; counts: Record<string, number> }> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      // Seed Firestore directly
      const batch = firestore.batch();

      for (const m of SEED_MERCHANTS) {
        batch.set(firestore.collection('merchants').doc(m.id), m, { merge: !force });
      }
      for (const c of SEED_CUSTOMERS) {
        batch.set(firestore.collection('customers').doc(c.id), c, { merge: !force });
      }
      for (const o of SEED_ORDERS) {
        batch.set(firestore.collection('orders').doc(o.orderId), o, { merge: !force });
      }
      for (const conv of SEED_CONVERSATIONS) {
        batch.set(firestore.collection('conversations').doc(conv.id), conv, { merge: !force });
      }
      for (const [convId, msgs] of Object.entries(SEED_MESSAGES)) {
        for (const msg of msgs) {
          batch.set(firestore.collection('conversations').doc(convId).collection('messages').doc(msg.id), msg, { merge: !force });
        }
      }
      for (const u of getDefaultMerchantUsers()) {
        batch.set(firestore.collection('merchant_users').doc(u.email.toLowerCase()), u, { merge: !force });
      }

      await batch.commit();
      console.log('[Store] Seeded Firestore with initial merchants, customers, orders, conversations, and merchant staff.');
    }

    // Always reset/update local cache as well
    memoryState = getDefaultState();
    saveState();

    return {
      message: 'Database seeded successfully',
      counts: {
        merchants: Object.keys(memoryState.merchants).length,
        customers: Object.keys(memoryState.customers).length,
        orders: Object.keys(memoryState.orders).length,
        conversations: Object.keys(memoryState.conversations).length,
      },
    };
  }

  // --- Merchants ---
  static async getMerchants(): Promise<Merchant[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const snap = await firestore.collection('merchants').get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Merchant);
          const seen = new Set<string>();
          return list.filter((m) => {
            if (!m?.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        }
      } catch (e) {
        console.warn('[Store] Firestore read error for merchants, falling back to local:', e);
      }
    }
    const state = loadState();
    const seen = new Set<string>();
    return Object.values(state.merchants).filter((m) => {
      if (!m?.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }

  static async getMerchantById(id: string): Promise<Merchant | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const doc = await firestore.collection('merchants').doc(id).get();
        if (doc.exists) return doc.data() as Merchant;
      } catch (e) {
        console.warn(`[Store] Firestore error fetching merchant ${id}:`, e);
      }
    }
    const state = loadState();
    if (id === 'merchant_a') {
      return state.merchants['merchant_music'] || state.merchants['merchant_a'] || null;
    }
    return state.merchants[id] || null;
  }

  static async upsertMerchant(merchant: Merchant): Promise<Merchant> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('merchants').doc(merchant.id).set(merchant, { merge: true });
      } catch (e) {
        console.warn(`[Store] Firestore error saving merchant ${merchant.id}:`, e);
      }
    }
    const state = loadState();
    state.merchants[merchant.id] = merchant;
    saveState();
    return merchant;
  }

  // --- Customers ---
  static async getCustomer(id: string): Promise<Customer | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const doc = await firestore.collection('customers').doc(id).get();
        if (doc.exists) return doc.data() as Customer;
      } catch (e) {
        console.warn(`[Store] Firestore error fetching customer ${id}:`, e);
      }
    }
    const state = loadState();
    return state.customers[id] || null;
  }

  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const snap = await firestore
          .collection('customers')
          .where('email', '==', email.toLowerCase())
          .limit(1)
          .get();
        if (!snap.empty) {
          return snap.docs[0].data() as Customer;
        }
      } catch (e) {
        console.warn(`[Store] Firestore error fetching customer by email ${email}:`, e);
      }
    }
    const state = loadState();
    const found = Object.values(state.customers).find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    return found || null;
  }

  static async upsertCustomer(customer: Customer): Promise<Customer> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('customers').doc(customer.id).set(customer, { merge: true });
      } catch (e) {
        console.warn(`[Store] Firestore write error for customer ${customer.id}:`, e);
      }
    }
    const state = loadState();
    state.customers[customer.id] = customer;
    saveState();
    return customer;
  }

  // --- Orders ---
  static async getOrders(customerId?: string, merchantId?: string): Promise<Order[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        let query: FirebaseFirestore.Query = firestore.collection('orders');
        if (customerId) query = query.where('customerId', '==', customerId);
        if (merchantId) query = query.where('merchantId', '==', merchantId);
        const snap = await query.get();
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Order);
        }
      } catch (e) {
        console.warn('[Store] Firestore error fetching orders:', e);
      }
    }

    const state = loadState();
    return Object.values(state.orders).filter((o) => {
      if (customerId && o.customerId !== customerId) return false;
      if (merchantId && o.merchantId !== merchantId) return false;
      return true;
    });
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const doc = await firestore.collection('orders').doc(orderId).get();
        if (doc.exists) return doc.data() as Order;
      } catch (e) {
        console.warn(`[Store] Firestore error fetching order ${orderId}:`, e);
      }
    }

    const state = loadState();
    // Normalize orderId (e.g. trim, uppercase)
    const normalized = orderId.trim().toUpperCase();
    for (const key of Object.keys(state.orders)) {
      if (key.toUpperCase() === normalized || state.orders[key].orderId.toUpperCase() === normalized) {
        return state.orders[key];
      }
    }
    return null;
  }

  static async addOrder(order: Order): Promise<Order> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('orders').doc(order.orderId).set(order, { merge: true });
      } catch (e) {
        console.warn(`[Store] Firestore write error for order ${order.orderId}:`, e);
      }
    }

    const state = loadState();
    state.orders[order.orderId] = order;
    saveState();
    return order;
  }

  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const existing = await this.getOrderById(orderId);
    if (!existing) return null;

    // Smart merge items if provided
    let mergedItems = existing.items;
    if (Array.isArray(updates.items)) {
      mergedItems = existing.items.map((existingItem) => {
        const patchItem = updates.items!.find(
          (pi) => (pi.id && pi.id === existingItem.id) || (pi.title && pi.title === existingItem.title)
        );
        if (patchItem) {
          return {
            ...existingItem,
            ...patchItem,
            title: patchItem.title || existingItem.title,
            quantity: patchItem.quantity ?? existingItem.quantity,
            unitPrice: patchItem.unitPrice ?? existingItem.unitPrice,
            licenseKey: patchItem.licenseKey ?? existingItem.licenseKey,
            downloadUrl: patchItem.downloadUrl ?? existingItem.downloadUrl,
          };
        }
        return existingItem;
      });

      // Append any new items in patch that didn't exist previously
      for (const newItem of updates.items) {
        const exists = mergedItems.some(
          (mi) => (newItem.id && mi.id === newItem.id) || (newItem.title && mi.title === newItem.title)
        );
        if (!exists) {
          mergedItems.push(newItem);
        }
      }
    }

    const updated: Order = {
      ...existing,
      ...updates,
      items: mergedItems,
      // Identity safeguards
      id: existing.id,
      orderId: existing.orderId,
      merchantId: existing.merchantId,
      customerId: existing.customerId,
      customerEmail: existing.customerEmail,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('orders').doc(updated.orderId).set(updated, { merge: true });
      } catch (e) {
        console.warn(`[Store] Firestore update error for order ${updated.orderId}:`, e);
      }
    }

    const state = loadState();
    state.orders[updated.orderId] = updated;
    saveState();
    return updated;
  }

  // --- Conversations ---
  static async getConversations(
    customerId?: string,
    merchantId?: string,
    customerEmail?: string
  ): Promise<Conversation[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        let query: FirebaseFirestore.Query = firestore.collection('conversations');
        if (customerId) query = query.where('customerId', '==', customerId);
        if (merchantId) query = query.where('merchantId', '==', merchantId);
        const snap = await query.get();
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as Conversation);
          return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
      } catch (e) {
        console.warn('[Store] Firestore error fetching conversations:', e);
      }
    }

    const state = loadState();
    const normEmail = customerEmail?.trim().toLowerCase();
    const convs = Object.values(state.conversations).filter((c) => {
      if (customerId) {
        const matchId = c.customerId === customerId;
        const matchEmail = normEmail && c.customerEmail?.toLowerCase() === normEmail;
        if (!matchId && !matchEmail) return false;
      }
      if (merchantId && c.merchantId !== merchantId) return false;
      return true;
    });

    return convs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  static async claimConversation(
    conversationId: string,
    customer: Customer
  ): Promise<Conversation | null> {
    const existing = await this.getConversationById(conversationId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Conversation = {
      ...existing,
      customerId: customer.id,
      customerEmail: customer.email,
      customerName: customer.name,
      updatedAt: now,
    };

    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('conversations').doc(conversationId).update({
          customerId: customer.id,
          customerEmail: customer.email,
          customerName: customer.name,
          updatedAt: now,
        });
      } catch (e) {
        console.warn(`[Store] Firestore update error for claimed conversation ${conversationId}:`, e);
      }
    }

    const state = loadState();
    state.conversations[conversationId] = updated;

    // Append system event message
    const systemMsg: Message = {
      id: `msg_sys_${crypto.randomUUID()}`,
      conversationId,
      sender: 'system',
      senderName: 'TD Retail System',
      content: `Conversation claimed and linked to ${customer.name} (${customer.email}).`,
      timestamp: now,
    };
    await this.addMessage(systemMsg);

    saveState();
    return updated;
  }

  static async getConversationById(id: string): Promise<Conversation | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const doc = await firestore.collection('conversations').doc(id).get();
        if (doc.exists) return doc.data() as Conversation;
      } catch (e) {
        console.warn(`[Store] Firestore error fetching conversation ${id}:`, e);
      }
    }

    const state = loadState();
    return state.conversations[id] || null;
  }

  static async createConversation(conv: Conversation): Promise<Conversation> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('conversations').doc(conv.id).set(conv);
      } catch (e) {
        console.warn('[Store] Firestore write error for new conversation:', e);
      }
    }

    const state = loadState();
    state.conversations[conv.id] = conv;
    if (!state.messages[conv.id]) {
      state.messages[conv.id] = [];
    }
    saveState();
    return conv;
  }

  static async updateConversation(
    id: string,
    updates: Partial<Conversation>
  ): Promise<Conversation | null> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('conversations').doc(id).update({
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn(`[Store] Firestore update error for conversation ${id}:`, e);
      }
    }

    const state = loadState();
    if (!state.conversations[id]) return null;

    state.conversations[id] = {
      ...state.conversations[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveState();
    return state.conversations[id];
  }

  // --- Messages ---
  static async getMessages(conversationId: string): Promise<Message[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const snap = await firestore
          .collection('conversations')
          .doc(conversationId)
          .collection('messages')
          .orderBy('timestamp', 'asc')
          .get();
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Message);
        }
      } catch (e) {
        console.warn(`[Store] Firestore error fetching messages for ${conversationId}:`, e);
      }
    }

    const state = loadState();
    return state.messages[conversationId] || [];
  }

  static async addMessage(message: Message): Promise<Message> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore
          .collection('conversations')
          .doc(message.conversationId)
          .collection('messages')
          .doc(message.id)
          .set(message);
      } catch (e) {
        console.warn('[Store] Firestore write error for message:', e);
      }
    }

    const state = loadState();
    if (!state.messages[message.conversationId]) {
      state.messages[message.conversationId] = [];
    }
    state.messages[message.conversationId].push(message);

    // Update conversation snippet and timestamp
    if (state.conversations[message.conversationId]) {
      state.conversations[message.conversationId].lastMessageSnippet =
        message.content.length > 90 ? message.content.slice(0, 90) + '...' : message.content;
      state.conversations[message.conversationId].lastMessageSender = message.sender;
      state.conversations[message.conversationId].lastMessageAt = message.timestamp;
      state.conversations[message.conversationId].updatedAt = message.timestamp;
      if (message.sender === 'ai' || message.sender === 'human_agent') {
        state.conversations[message.conversationId].unreadByCustomer = true;
      }
    }

    saveState();
    return message;
  }

  // --- Outbox Emails ---
  static async addOutboxEmail(email: OutboxEmail): Promise<OutboxEmail> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('outbox_emails').doc(email.id).set(email);
      } catch (e) {
        console.warn('[Store] Firestore write error for outbox email:', e);
      }
    }

    const state = loadState();
    state.outbox.unshift(email);
    saveState();
    return email;
  }

  static async getOutboxEmails(): Promise<OutboxEmail[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const snap = await firestore
          .collection('outbox_emails')
          .orderBy('sentAt', 'desc')
          .limit(50)
          .get();
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as OutboxEmail);
        }
      } catch (e) {
        console.warn('[Store] Firestore error fetching outbox:', e);
      }
    }

    const state = loadState();
    return state.outbox || [];
  }

  // --- Merchant Users & Auth ---
  static async getMerchantUserByEmail(email: string): Promise<MerchantUser | null> {
    const normalized = email.trim().toLowerCase();
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const doc = await firestore.collection('merchant_users').doc(normalized).get();
        if (doc.exists) return doc.data() as MerchantUser;
      } catch (e) {
        console.warn(`[Store] Firestore error fetching merchant user ${normalized}:`, e);
      }
    }
    const state = loadState();
    return state.merchantUsers?.[normalized] || null;
  }

  static async getMerchantUsers(): Promise<MerchantUser[]> {
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        const snap = await firestore.collection('merchant_users').get();
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as MerchantUser);
        }
      } catch (e) {
        console.warn('[Store] Firestore error fetching merchant users:', e);
      }
    }
    const state = loadState();
    return Object.values(state.merchantUsers || {});
  }

  static async createMerchantUser(user: MerchantUser): Promise<MerchantUser> {
    const normalized = user.email.trim().toLowerCase();
    const firestore = await this.getFirestoreClient();
    if (firestore) {
      try {
        await firestore.collection('merchant_users').doc(normalized).set(user, { merge: true });
      } catch (e) {
        console.warn(`[Store] Firestore error saving merchant user ${normalized}:`, e);
      }
    }
    const state = loadState();
    if (!state.merchantUsers) {
      state.merchantUsers = {};
    }
    state.merchantUsers[normalized] = {
      ...user,
      email: normalized,
    };
    saveState();
    return state.merchantUsers[normalized];
  }

  // --- Merchant Escalated Conversations ---
  static async getEscalatedConversations(merchantId: string): Promise<Conversation[]> {
    const all = await this.getConversations(undefined, merchantId);
    return all.filter((conv) => conv.status === 'escalated');
  }

  // --- Merchant Outbox Emails ---
  static async getOutboxEmailsByMerchant(merchantId: string): Promise<OutboxEmail[]> {
    const all = await this.getOutboxEmails();
    return all.filter((email) => email.merchantId === merchantId);
  }
}

