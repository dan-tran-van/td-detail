export type MerchantId = "merchant_a" | "merchant_b";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // in INR
  merchantId: MerchantId;
  category: string;
  status: "IN_STOCK" | "LOW_STOCK" | "PRE_ORDER";
  badge?: string;
  features: string[];
  imageUrl: string;
  rating: number;
  reviewsCount: number;
}

export interface MerchantTheme {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  navBg: string;
  heroGradient: string;
}

export interface MerchantConfig {
  id: MerchantId;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  currency: "INR";
  currencySymbol: "₹";
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  supportPolicy: {
    returnWindowDays: number;
    warranty: string;
    highlights: string[];
    details: string;
  };
  theme: MerchantTheme;
  products: Product[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  merchantId: MerchantId;
  imageUrl?: string;
  category?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export type OrderStatus =
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderDocument {
  orderId: string;
  merchantId: MerchantId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  currency: "INR";
  orderStatus: OrderStatus;
  createdAt: string; // ISO 8601
  updatedAt: string;
  anonymousSessionId: string;
  orderAccessToken: string;
  emailStatus: "sent" | "failed" | "dev_outbox";
  emailDetails?: {
    recipient: string;
    sentAt?: string;
    messageId?: string;
    error?: string;
    devOutboxId?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "agent" | "system";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "resolved" | "escalated";
  toolOutcomes?: Array<{
    name: string;
    detail: string;
    status: "success" | "info" | "warning";
  }>;
  supportReference?: string;
  canEscalate?: boolean;
}

export interface DevEmail {
  id: string;
  orderId: string;
  merchantId: MerchantId;
  merchantName: string;
  to: string;
  from: string;
  fromName: string;
  replyTo: string;
  subject: string;
  htmlContent: string;
  sentAt: string;
  status: "simulated_sent" | "sendgrid_sent" | "failed";
}
