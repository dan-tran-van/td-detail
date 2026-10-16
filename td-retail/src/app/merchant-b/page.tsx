import { MERCHANT_B_CONFIG } from "@/config/merchants";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terra Botanica | Organic Home & Botanical Aromatics",
  description:
    "Handcrafted artisanal botanical aromatics, cold-pressed certified organic skincare, and natural living essentials. Demo storefront for TD Retail.",
};

export default function MerchantBPage() {
  return <StorefrontView merchant={MERCHANT_B_CONFIG} />;
}
