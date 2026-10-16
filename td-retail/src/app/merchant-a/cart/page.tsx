import { MERCHANT_A_CONFIG } from "@/config/merchants";
import { CartView } from "@/components/cart/CartView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Aura Soundworks",
  description: "View and manage items in your Aura Soundworks acoustic cart.",
};

export default function MerchantACartPage() {
  return <CartView merchant={MERCHANT_A_CONFIG} />;
}
