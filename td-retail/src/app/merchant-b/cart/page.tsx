import { MERCHANT_B_CONFIG } from "@/config/merchants";
import { CartView } from "@/components/cart/CartView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Terra Botanica",
  description: "View and manage items in your Terra Botanica organic living cart.",
};

export default function MerchantBCartPage() {
  return <CartView merchant={MERCHANT_B_CONFIG} />;
}
