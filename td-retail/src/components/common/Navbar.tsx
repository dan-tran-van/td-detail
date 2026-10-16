"use client";

import React from "react";
import Link from "next/link";
import { MerchantConfig } from "@/types";
import { useCart } from "@/context/CartContext";
import { useChat } from "@/context/ChatContext";
import {
  ShoppingBag,
  Package,
  Headphones,
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
  Leaf,
  AudioWaveform,
} from "lucide-react";

export function Navbar({ merchant }: { merchant: MerchantConfig }) {
  const { getItemCount } = useCart();
  const { openChat } = useChat();
  const itemCount = getItemCount(merchant.id);
  const isMerchantA = merchant.id === "merchant_a";

  const otherMerchantSlug = isMerchantA ? "merchant-b" : "merchant-a";
  const otherMerchantName = isMerchantA ? "Terra Botanica" : "Aura Soundworks";

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isMerchantA
          ? "bg-slate-950/90 border-slate-800 text-slate-100"
          : "bg-white/95 border-emerald-100 text-slate-900 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name */}
          <Link
            href={`/${merchant.slug}`}
            className="flex items-center gap-3 group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md transition group-hover:scale-105 ${
                isMerchantA
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-emerald-600 text-white shadow-emerald-600/20"
              }`}
            >
              {isMerchantA ? (
                <AudioWaveform className="w-5 h-5" />
              ) : (
                <Leaf className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight block">
                {merchant.name}
              </span>
              <span
                className={`text-[11px] font-medium tracking-wider uppercase block ${
                  isMerchantA ? "text-amber-400" : "text-emerald-600"
                }`}
              >
                {merchant.tagline.slice(0, 32)}...
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href={`/${merchant.slug}#catalogue`}
              className={`transition hover:opacity-80 ${
                isMerchantA ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Catalogue
            </Link>
            <Link
              href={`/${merchant.slug}#policy`}
              className={`transition hover:opacity-80 ${
                isMerchantA ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Policy & Warranty
            </Link>
            <Link
              href={`/${merchant.slug}/orders`}
              className={`flex items-center gap-1.5 transition hover:opacity-80 ${
                isMerchantA ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Merchant Switcher Badge */}
            <Link
              href={`/${otherMerchantSlug}`}
              className={`hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
                isMerchantA
                  ? "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
              title={`Switch to simulated ${otherMerchantName} storefront`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch to {otherMerchantName}</span>
            </Link>

            {/* Support Trigger */}
            <button
              onClick={() => openChat({ merchantId: merchant.id })}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
                isMerchantA
                  ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden sm:inline">Support</span>
            </button>

            {/* Orders Mobile Link */}
            <Link
              href={`/${merchant.slug}/orders`}
              className={`md:hidden p-2 rounded-xl border transition ${
                isMerchantA
                  ? "border-slate-800 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="View Orders"
            >
              <Package className="w-4 h-4" />
            </Link>

            {/* Cart Button */}
            <Link
              href={`/${merchant.slug}/cart`}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-sm transition shadow-sm ${
                isMerchantA
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span
                  className={`text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ${
                    isMerchantA
                      ? "bg-slate-950 text-amber-300"
                      : "bg-white text-emerald-800"
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
