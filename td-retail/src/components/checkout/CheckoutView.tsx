"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MerchantConfig, OrderItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { useChat } from "@/context/ChatContext";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SupportChatWidget } from "@/components/chat/SupportChatWidget";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Headphones,
  PackageCheck,
  Sparkles,
} from "lucide-react";

export function CheckoutView({ merchant }: { merchant: MerchantConfig }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCart, clearCart } = useCart();
  const { openChat } = useChat();

  const isMerchantA = merchant.id === "merchant_a";

  // Check if this is a "Buy Now" direct purchase
  const directProductId = searchParams.get("productId");
  const directQuantityStr = searchParams.get("quantity");
  const directQuantity = directQuantityStr
    ? parseInt(directQuantityStr, 10)
    : 1;

  const directProduct = directProductId
    ? merchant.products.find((p) => p.id === directProductId)
    : undefined;

  // Form state
  const [customerName, setCustomerName] = useState("Aarav Sharma");
  const [customerEmail, setCustomerEmail] = useState("aarav.sharma@example.com");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state (Order Confirmation)
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    orderAccessToken: string;
    subtotal: number;
    currency: string;
    orderStatus: string;
    emailStatus: string;
    viewOrderUrl: string;
    customerEmail: string;
    items: OrderItem[];
  } | null>(null);

  // Determine items to purchase
  const checkoutItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
    imageUrl?: string;
  }> = directProduct
    ? [
        {
          productId: directProduct.id,
          name: directProduct.name,
          price: directProduct.price,
          quantity: directQuantity,
          lineTotal: directProduct.price * directQuantity,
          imageUrl: directProduct.imageUrl,
        },
      ]
    : getCart(merchant.id).map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
        imageUrl: i.imageUrl,
      }));

  const subtotal = checkoutItems.reduce((acc, i) => acc + i.lineTotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (checkoutItems.length === 0) {
      setErrorMessage("Your checkout basket is empty.");
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: merchant.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process order");
      }

      // If this was a cart checkout, clear cart now
      if (!directProduct) {
        clearCart(merchant.id);
      }

      setConfirmedOrder({
        orderId: data.orderId,
        orderAccessToken: data.orderAccessToken,
        subtotal: data.subtotal,
        currency: data.currency,
        orderStatus: data.orderStatus,
        emailStatus: data.emailStatus,
        viewOrderUrl: data.viewOrderUrl,
        customerEmail,
        items: checkoutItems,
      });
    } catch (err: unknown) {
      console.error("Checkout submission failed", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error submitting order"
      );
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/${merchant.slug}`}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
              isMerchantA ? "text-amber-400" : "text-emerald-700"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {merchant.name} Storefront</span>
          </Link>
        </div>

        {/* ORDER CONFIRMATION VIEW (AFTER SUCCESSFUL CHECKOUT) */}
        {confirmedOrder ? (
          <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div
              className={`rounded-2xl p-6 sm:p-10 border shadow-xl ${
                isMerchantA
                  ? "bg-slate-900/90 border-slate-800 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${
                    isMerchantA
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 block mb-1">
                  Simulated Purchase Confirmed
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Order Successfully Placed!
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Order record has been persisted into the shared Firestore database.
                </p>
              </div>

              {/* Order Reference Box */}
              <div
                className={`p-5 rounded-xl border mb-6 text-center ${
                  isMerchantA
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Unique Order Reference ID
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-wider mt-1 text-amber-500 dark:text-amber-400">
                  {confirmedOrder.orderId}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    STATUS: {confirmedOrder.orderStatus}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Email: {confirmedOrder.emailStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Products in this Order
                </h3>
                <div className="divide-y divide-slate-800/40 border-y border-slate-800/40 py-2">
                  {confirmedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-xs text-slate-400 block">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="font-mono font-bold">
                        ₹{item.lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-baseline pt-2 text-base font-bold">
                  <span>Total Paid (Simulated)</span>
                  <span className="text-xl font-mono text-emerald-400">
                    ₹{confirmedOrder.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Email Notification Status Callout */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1 mb-8">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Order Confirmation Email Dispatched</span>
                </div>
                <p className="text-slate-400">
                  Confirmation sent to <strong>{confirmedOrder.customerEmail}</strong>. If running in local development mode without SendGrid API key, view the rendered email in the Dev Email Outbox.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={`/${merchant.slug}/orders?orderId=${confirmedOrder.orderId}&token=${confirmedOrder.orderAccessToken}`}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 ${
                    isMerchantA
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>View Order & Tracking</span>
                </Link>

                <button
                  onClick={() =>
                    openChat({
                      merchantId: merchant.id,
                      orderId: confirmedOrder.orderId,
                      initialMessage: `I just placed Order ${confirmedOrder.orderId}. Can you confirm delivery estimate?`,
                    })
                  }
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition active:scale-95 ${
                    isMerchantA
                      ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700"
                      : "bg-white hover:bg-slate-50 text-emerald-700 border-slate-200"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Get Support Now via TD Retail</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div>
            <div className="mb-8">
              <span
                className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                  isMerchantA ? "text-amber-400" : "text-emerald-700"
                }`}
              >
                {directProduct ? "Instant Buy Now Checkout" : "Cart Checkout"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Simulated Checkout
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Completing purchase on <strong>{merchant.name}</strong> • No payment credentials required.
              </p>
            </div>

            {checkoutItems.length === 0 ? (
              <div className="p-8 text-center border rounded-2xl border-slate-800 text-slate-400">
                <p>No products selected for checkout.</p>
                <Link
                  href={`/${merchant.slug}`}
                  className="mt-4 inline-block font-semibold underline text-amber-400"
                >
                  Browse {merchant.name} Catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Column */}
                <div className="lg:col-span-7">
                  <form
                    onSubmit={handleSubmit}
                    className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${
                      isMerchantA
                        ? "bg-slate-900/80 border-slate-800 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-3 border-b border-slate-800/40">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Customer & Delivery Details</span>
                    </div>

                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-300">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950/60 dark:bg-slate-950 border border-slate-700/80 focus:border-amber-500 outline-none transition"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-300">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. aarav.sharma@example.com"
                          className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950/60 dark:bg-slate-950 border border-slate-700/80 focus:border-amber-500 outline-none transition"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Order confirmation email with TD Retail support reply-to will be sent here.
                        </span>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-300">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950/60 dark:bg-slate-950 border border-slate-700/80 focus:border-amber-500 outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Simulated Payment Notice */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Simulated Hackathon Checkout</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">
                        No credit card or payment gateway is required. Confirming your purchase creates an active order in Firestore and initiates email confirmation.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${
                        isMerchantA
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-amber-500/20"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Persisting Order to Firestore...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            Confirm Purchase • ₹{subtotal.toLocaleString("en-IN")}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Items & Subtotal Column */}
                <div className="lg:col-span-5">
                  <div
                    className={`p-6 rounded-2xl border space-y-4 sticky top-24 ${
                      isMerchantA
                        ? "bg-slate-900/80 border-slate-800"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <h2 className="text-base font-bold">Review Your Items</h2>

                    <div className="divide-y divide-slate-800/40">
                      {checkoutItems.map((item) => (
                        <div
                          key={item.productId}
                          className="py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-sm block">
                              {item.name}
                            </span>
                            <span className="text-slate-400">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-sm">
                            ₹{item.lineTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800/40 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span className="font-mono">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Courier Express Delivery</span>
                        <span className="text-emerald-400 font-bold uppercase">
                          FREE
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-slate-800/40 text-base font-bold">
                        <span>Order Total</span>
                        <span className="text-xl font-black font-mono">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer merchant={merchant} />
      <SupportChatWidget currentMerchantId={merchant.id} />
    </div>
  );
}
