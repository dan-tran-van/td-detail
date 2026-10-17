export interface Product {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number; // in INR (₹)
  category: 'charging' | 'audio' | 'display' | 'wearable' | 'hub';
  specs: string; // e.g. "GaN 100W / 3-port / USB-C PD"
  warranty: string; // e.g. "1-Year Manufacturer Warranty"
  coverImage: string;
  badge?: string;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
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
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
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
