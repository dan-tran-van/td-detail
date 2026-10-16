"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MerchantConfig } from "@/types";
import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SupportChatWidget } from "@/components/chat/SupportChatWidget";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
} from "lucide-react";

export function CartView({ merchant }: { merchant: MerchantConfig }) {
  const router = useRouter();
  const { getCart, updateQuantity, removeItem, getSubtotal, clearCart } =
    useCart();
  const items = getCart(merchant.id);
  const subtotal = getSubtotal(merchant.id);
  const isMerchantA = merchant.id === "merchant_a";

  const handleProceedToCheckout = () => {
    router.push(`/${merchant.slug}/checkout`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isMerchantA
          ? "bg-slate-950 text-slate-100"
          : "bg-stone-50/60 text-slate-900"
      }`}
    >
      <Navbar merchant={merchant} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/${merchant.slug}`}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
              isMerchantA ? "text-amber-400" : "text-emerald-700"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping on {merchant.name}</span>
          </Link>

          <span className="text-xs text-slate-500">
            Cart Scoped to: <strong>{merchant.name}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>

        {items.length === 0 ? (
          <div
            className={`rounded-2xl p-12 text-center border ${
              isMerchantA
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                isMerchantA
                  ? "bg-slate-800 text-amber-400"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold mb-2">Your cart is empty</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Looks like you haven't added any {merchant.name} products to your cart yet. Explore our seeded collection!
            </p>
            <Link
              href={`/${merchant.slug}#catalogue`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                isMerchantA
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Table / List */}
            <div className="lg:col-span-8 space-y-4">
              <div
                className={`rounded-2xl overflow-hidden border ${
                  isMerchantA
                    ? "bg-slate-900/70 border-slate-800 divide-y divide-slate-800"
                    : "bg-white border-slate-200 divide-y divide-slate-100"
                }`}
              >
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Info & Thumbnail */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950/20 p-2 shrink-0 flex items-center justify-center border border-slate-800/20">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          ID: {item.productId}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Unit Price: ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Line Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/30">
                      {/* Stepper */}
                      <div
                        className={`flex items-center rounded-xl border p-1 ${
                          isMerchantA
                            ? "bg-slate-950 border-slate-800"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              merchant.id,
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              merchant.id,
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="p-1 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block sm:hidden">
                          Total
                        </span>
                        <span className="font-bold text-base font-mono">
                          ₹{item.lineTotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(merchant.id, item.productId)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 px-2">
                <span>Cart persists across refreshes and page reloads.</span>
                <button
                  onClick={() => clearCart(merchant.id)}
                  className="hover:text-red-400 underline transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div
                className={`rounded-2xl p-6 border sticky top-24 ${
                  isMerchantA
                    ? "bg-slate-900/80 border-slate-800"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm pb-4 border-b border-slate-200/20">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-slate-200 dark:text-slate-100">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Simulated Shipping</span>
                    <span className="text-emerald-400 font-semibold uppercase text-xs">
                      FREE (INR Express)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Simulated Taxes & Duties</span>
                    <span className="text-emerald-400 font-semibold uppercase text-xs">
                      Included
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline py-4 mb-6">
                  <div>
                    <span className="font-bold text-base">Estimated Total</span>
                    <span className="text-[11px] text-slate-400 block">
                      All prices in Indian Rupees
                    </span>
                  </div>
                  <span className="text-2xl font-black font-mono">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2 ${
                    isMerchantA
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-500/20"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20"
                  }`}
                >
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-5 p-3 rounded-xl bg-slate-950/40 dark:bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>No Real Payment Collected</span>
                  </div>
                  <p>
                    Simulated checkout will record your order to Firestore, dispatch confirmation email, and assign tracking to TD Retail AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer merchant={merchant} />
      <SupportChatWidget currentMerchantId={merchant.id} />
    </div>
  );
}
