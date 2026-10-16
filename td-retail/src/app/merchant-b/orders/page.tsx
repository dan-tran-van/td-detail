import { Suspense } from "react";
import { MERCHANT_B_CONFIG } from "@/config/merchants";
import { OrdersView } from "@/components/orders/OrdersView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Terra Botanica",
  description: "Track your organic living orders and get immediate TD Retail support.",
};

export default function MerchantBOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-slate-400">
          Loading orders...
        </div>
      }
    >
      <OrdersView merchant={MERCHANT_B_CONFIG} />
    </Suspense>
  );
}
