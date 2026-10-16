import { Suspense } from "react";
import { MERCHANT_A_CONFIG } from "@/config/merchants";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulated Checkout | Aura Soundworks",
  description: "Complete your simulated acoustic order on Aura Soundworks.",
};

export default function MerchantACheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          Loading checkout...
        </div>
      }
    >
      <CheckoutView merchant={MERCHANT_A_CONFIG} />
    </Suspense>
  );
}
