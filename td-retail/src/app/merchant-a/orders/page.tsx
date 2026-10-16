import { Suspense } from "react";
import { MERCHANT_A_CONFIG } from "@/config/merchants";
import { OrdersView } from "@/components/orders/OrdersView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Aura Soundworks",
  description: "Track your acoustic equipment orders and get immediate TD Retail support.",
};

export default function MerchantAOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          Loading orders...
        </div>
      }
    >
      <OrdersView merchant={MERCHANT_A_CONFIG} />
    </Suspense>
  );
}
