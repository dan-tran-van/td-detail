import { MERCHANT_A_CONFIG } from "@/config/merchants";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aura Soundworks | Reference Acoustic Gear & Headphones",
  description:
    "Engineering reference-grade headphones, planar magnetic monitors, and bespoke analog amplification. Demo storefront for TD Retail.",
};

export default function MerchantAPage() {
  return <StorefrontView merchant={MERCHANT_A_CONFIG} />;
}
