"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MerchantConfig, OrderDocument } from "@/types";
import { useChat } from "@/context/ChatContext";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { SupportChatWidget } from "@/components/chat/SupportChatWidget";
import {
  Package,
  Calendar,
  Mail,
  Headphones,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export function OrdersView({ merchant }: { merchant: MerchantConfig }) {
  const searchParams = useSearchParams();
  const { openChat } = useChat();
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMerchantA = merchant.id === "merchant_a";

  const targetOrderId = searchParams.get("orderId");
  const targetToken = searchParams.get("token");
  const autoOpenSupport =
    searchParams.get("support") === "true" ||
    searchParams.get("openChat") === "true";

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setError(null);
      try {
        // First, fetch orders associated with current session
        const res = await fetch(`/api/orders?merchantId=${merchant.id}`);
        let sessionOrders: OrderDocument[] = [];
        if (res.ok) {
          const data = await res.json();
          sessionOrders = data.orders || [];
        }

        // If a specific orderId is passed in URL, also attempt to fetch it directly with token
        if (targetOrderId) {
          const alreadyInList = sessionOrders.some(
            (o) => o.orderId === targetOrderId
          );
          if (!alreadyInList) {
            const tokenQuery = targetToken ? `?token=${targetToken}` : "";
            const directRes = await fetch(
              `/api/orders/${targetOrderId}${tokenQuery}`
            );
            if (directRes.ok) {
              const directData = await directRes.json();
              if (directData.order) {
                sessionOrders = [directData.order, ...sessionOrders];
              }
            }
          }
        }

        setOrders(sessionOrders);

        // Auto-open support if requested via deep link
        if (autoOpenSupport && targetOrderId) {
          openChat({
            merchantId: merchant.id,
            orderId: targetOrderId,
            initialMessage: `I am inquiring about my order ${targetOrderId}. Can you update me on delivery and status?`,
          });
        }
      } catch (err) {
        console.error("Failed to load orders", err);
        setError("Unable to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [merchant.id, targetOrderId, targetToken, autoOpenSupport]);

  const handleGetSupport = (order: OrderDocument) => {
    openChat({
      merchantId: merchant.id,
      orderId: order.orderId,
      initialMessage: `Hello, I need assistance with Order ${order.orderId} placed on ${merchant.name}.`,
    });
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
            Anonymous Session Orders Protected
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Orders & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Viewing customer orders for <strong>{merchant.name}</strong> • Identified via secure anonymous browser session.
          </p>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-sm">Fetching verified order records from Firestore...</span>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : orders.length === 0 ? (
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
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold mb-2">No orders found yet</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              You haven't completed any simulated purchases on {merchant.name} in this browser session. Complete a simulated checkout to view live tracking!
            </p>
            <Link
              href={`/${merchant.slug}#catalogue`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                isMerchantA
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <span>Browse Products to Purchase</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isTargeted = order.orderId === targetOrderId;
              return (
                <div
                  key={order.orderId}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isTargeted
                      ? "ring-2 ring-amber-500 shadow-xl"
                      : "hover:shadow-md"
                  } ${
                    isMerchantA
                      ? "bg-slate-900/80 border-slate-800 text-slate-100"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-6 bg-slate-950/40 dark:bg-slate-950/60 border-b border-slate-800/40 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base sm:text-lg font-extrabold tracking-wider text-amber-500 dark:text-amber-400">
                          {order.orderId}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {order.customerEmail}
                        </span>
                      </div>
                    </div>

                    {/* Get Support Now Button */}
                    <button
                      onClick={() => handleGetSupport(order)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95 ${
                        isMerchantA
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Get Support Now</span>
                    </button>
                  </div>

                  {/* Products Breakdown in this order */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="divide-y divide-slate-800/30">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between gap-4 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-950/20 p-1 shrink-0 flex items-center justify-center border border-slate-800/20">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-xs text-slate-400 block">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-sm">
                            ₹{item.lineTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Totals */}
                    <div className="pt-3 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Eligible for {merchant.supportPolicy.returnWindowDays}-day return window</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-400 uppercase font-semibold">
                          Order Total:
                        </span>
                        <span className="text-xl font-extrabold font-mono text-emerald-400">
                          ₹{order.subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer merchant={merchant} />
      <SupportChatWidget currentMerchantId={merchant.id} />
    </div>
  );
}
