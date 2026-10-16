import { Suspense } from "react";
import { MERCHANT_B_CONFIG } from "@/config/merchants";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulated Checkout | Terra Botanica",
  description: "Complete your simulated organic living order on Terra Botanica.",
};

export default function MerchantBCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-slate-400">
          Loading checkout...
        </div>
      }
    >
      <CheckoutView merchant={MERCHANT_B_CONFIG} />
    </Suspense>
  );
}
