export interface Product {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number; // in INR (₹)
  category: 'album' | 'ep' | 'sample_pack' | 'single';
  format: string; // e.g. "FLAC 24-bit / 96kHz + WAV Stems"
  licenseType: string; // e.g. "Commercial Studio License"
  coverImage: string;
  trackCount: number;
  duration: string;
  badge?: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  title: string;
  artistOrBrand?: string;
  quantity: number;
  unitPrice: number;
  itemType?: string;
  formatOrWeight?: string;
  licenseKey?: string;
  downloadUrl?: string;
}

export interface Order {
  id: string;
  orderId: string;
  merchantId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  orderStatus: 'confirmed' | 'processing' | 'delivered' | 'cancelled' | 'refunded';
  orderStatusDisplay: string;
  totalAmount: number;
  currency: string;
  trackingNumber: string;
  carrierOrCourier: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  courierNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  sender: 'customer' | 'ai' | 'human_agent';
  senderName: string;
  content: string;
  timestamp: string;
  metadata?: {
    isAiGrounded?: boolean;
    modelName?: string;
    groundedOrderId?: string;
    groundedOrderStatus?: string;
    escalationTriggered?: boolean;
  };
}

export interface SupportConversation {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  merchantId: string;
  orderId?: string;
  subject: string;
  status: 'active' | 'escalated' | 'resolved';
  lastMessageSnippet?: string;
  lastMessageSender?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}
