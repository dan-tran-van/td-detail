"use client";

import React from "react";
import Link from "next/link";
import { MerchantConfig } from "@/types";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { SupportChatWidget } from "@/components/chat/SupportChatWidget";
import { useChat } from "@/context/ChatContext";
import {
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Truck,
  Leaf,
  Layers,
} from "lucide-react";

export function StorefrontView({ merchant }: { merchant: MerchantConfig }) {
  const { openChat } = useChat();
  const isMerchantA = merchant.id === "merchant_a";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-amber-500 selection:text-slate-950 ${
        isMerchantA
          ? "bg-slate-950 text-slate-100"
          : "bg-stone-50/60 text-slate-900"
      }`}
    >
      {/* Top Demo Bar */}
      <div
        className={`px-4 py-1.5 text-center text-xs font-medium border-b flex items-center justify-center gap-2 ${
          isMerchantA
            ? "bg-slate-900/90 text-amber-300/90 border-slate-800"
            : "bg-emerald-800 text-emerald-100 border-emerald-700"
        }`}
      >
        <span>TD Retail Multi-Merchant Simulation:</span>
        <strong className="underline underline-offset-2">{merchant.name} Storefront</strong>
        <span className="hidden sm:inline">•</span>
        <Link
          href="/"
          className="underline hover:opacity-80 hidden sm:inline"
        >
          Return to Portal
        </Link>
      </div>

      <Navbar merchant={merchant} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/20">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ background: merchant.theme.heroGradient }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide uppercase border backdrop-blur-md">
            {isMerchantA ? (
              <span className="text-amber-400 bg-amber-500/10 border-amber-500/20 px-3 py-1 rounded-full">
                Audiophile Benchmark Series
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-500/10 border-emerald-500/20 px-3 py-1 rounded-full">
                Regenerative Organic Harvest
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            {merchant.tagline}
          </h1>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${
              isMerchantA ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {merchant.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#catalogue"
              className={`px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition active:scale-95 flex items-center gap-2 ${
                isMerchantA
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20"
              }`}
            >
              <span>Explore 5 Seeded Products</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => openChat({ merchantId: merchant.id })}
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm border transition active:scale-95 flex items-center gap-2 ${
                isMerchantA
                  ? "bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Talk to Support Concierge</span>
            </button>
          </div>

          {/* Quick Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-8 border-t border-slate-200/20 text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 shrink-0 ${isMerchantA ? "text-amber-400" : "text-emerald-600"}`} />
              <div className="text-xs">
                <span className="font-bold block">{merchant.supportPolicy.warranty}</span>
                <span className="text-slate-400">Official Coverage</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className={`w-5 h-5 shrink-0 ${isMerchantA ? "text-amber-400" : "text-emerald-600"}`} />
              <div className="text-xs">
                <span className="font-bold block">{merchant.supportPolicy.returnWindowDays}-Day Returns</span>
                <span className="text-slate-400">Guaranteed Satisfaction</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className={`w-5 h-5 shrink-0 ${isMerchantA ? "text-amber-400" : "text-emerald-600"}`} />
              <div className="text-xs">
                <span className="font-bold block">All India Express</span>
                <span className="text-slate-400">Priced in INR (₹)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 shrink-0 ${isMerchantA ? "text-amber-400" : "text-emerald-600"}`} />
              <div className="text-xs">
                <span className="font-bold block">TD Retail AI Resolution</span>
                <span className="text-slate-400">Integrated Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalogue Section */}
      <section id="catalogue" className="py-16 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                  isMerchantA ? "text-amber-400" : "text-emerald-600"
                }`}
              >
                Curated Demo Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Featured {merchant.name} Products
              </h2>
            </div>
            <p
              className={`text-xs sm:text-sm max-w-md ${
                isMerchantA ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Each item supports instant <strong>Buy Now</strong> simulated checkout or <strong>Add to Cart</strong> with full merchant cart isolation.
            </p>
          </div>

          {/* 5 Seeded Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {merchant.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                merchant={merchant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Policy & Support Highlight Section */}
      <section
        id="policy"
        className={`py-14 border-t ${
          isMerchantA
            ? "bg-slate-900/60 border-slate-800"
            : "bg-emerald-50/50 border-emerald-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isMerchantA ? "text-amber-400" : "text-emerald-700"
              }`}
            >
              Merchant Policy & Resolution Standard
            </span>
            <h3 className="text-2xl font-bold">
              Customer Satisfaction Guarantee
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                isMerchantA ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {merchant.supportPolicy.details}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4">
              {merchant.supportPolicy.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
                    isMerchantA
                      ? "bg-slate-950/70 border border-slate-800 text-slate-300"
                      : "bg-white border border-emerald-100 text-slate-700"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isMerchantA ? "text-amber-400" : "text-emerald-600"
                    }`}
                  />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer merchant={merchant} />
      <SupportChatWidget currentMerchantId={merchant.id} />
    </div>
  );
}
