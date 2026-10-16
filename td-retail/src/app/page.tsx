"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MERCHANT_A_CONFIG, MERCHANT_B_CONFIG } from "@/config/merchants";
import { DevOutboxModal } from "@/components/dev/DevOutboxModal";
import {
  ShoppingBag,
  Package,
  Headphones,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Server,
  Mail,
  Lock,
  Layers,
  Database,
  CheckCircle2,
  ExternalLink,
  Code2,
  AudioWaveform,
  Leaf,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dev/status")
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch((err) => console.warn("Failed to fetch system status", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 p-0.5" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 shadow-md">
              TD
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block">
                TD Retail Prototype
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Multi-Merchant AI Customer Support Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono">
                {systemStatus?.database.mode === "cloud_firestore"
                  ? "Cloud Firestore Active"
                  : "Local Resilient Store Active"}
              </span>
            </div>

            <Link
              href="/merchant-a"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
            >
              Merchant A
            </Link>
            <Link
              href="/merchant-b"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              Merchant B
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex-1 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Evaluation Portal • Two Independent Merchant Storefronts</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Simulate Two Distinct Merchants with Embedded TD Retail AI Support
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Experience complete customer journeys across two independent e-commerce brands: browse 5 seeded products, test cart isolation, execute simulated checkouts, and verify automatic context-driven support resolution via chat and email.
          </p>
        </div>

        {/* Merchant Storefront Cards (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MERCHANT A CARD */}
          <div className="rounded-3xl p-8 bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Route: /merchant-a
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  merchant_a
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <AudioWaveform className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {MERCHANT_A_CONFIG.name}
                  </h2>
                  <span className="text-xs text-amber-400 font-medium">
                    {MERCHANT_A_CONFIG.tagline}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {MERCHANT_A_CONFIG.description}
              </p>

              {/* Seeded Products Preview */}
              <div className="mb-6 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  5 Seeded Products (INR Pricing):
                </span>
                <div className="space-y-1.5">
                  {MERCHANT_A_CONFIG.products.map((p) => (
                    <div
                      key={p.id}
                      className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <span className="font-medium truncate max-w-[240px]">
                        {p.name}
                      </span>
                      <span className="font-mono text-amber-400 font-bold shrink-0">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 mb-8">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Support & Resolution Policy:</span>
                </div>
                <p className="text-slate-400">
                  {MERCHANT_A_CONFIG.supportPolicy.warranty} • {MERCHANT_A_CONFIG.supportPolicy.returnWindowDays}-day critical listening guarantee.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href="/merchant-a"
                className="py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 transition"
              >
                <span>Launch Storefront A</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/merchant-a/orders"
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders & Tracking</span>
              </Link>
            </div>
          </div>

          {/* MERCHANT B CARD */}
          <div className="rounded-3xl p-8 bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 transition shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Route: /merchant-b
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  merchant_b
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {MERCHANT_B_CONFIG.name}
                  </h2>
                  <span className="text-xs text-emerald-400 font-medium">
                    {MERCHANT_B_CONFIG.tagline}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {MERCHANT_B_CONFIG.description}
              </p>

              {/* Seeded Products Preview */}
              <div className="mb-6 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  5 Seeded Products (INR Pricing):
                </span>
                <div className="space-y-1.5">
                  {MERCHANT_B_CONFIG.products.map((p) => (
                    <div
                      key={p.id}
                      className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <span className="font-medium truncate max-w-[240px]">
                        {p.name}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 mb-8">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Support & Resolution Policy:</span>
                </div>
                <p className="text-slate-400">
                  {MERCHANT_B_CONFIG.supportPolicy.warranty} • {MERCHANT_B_CONFIG.supportPolicy.returnWindowDays}-day compostable freshness guarantee.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href="/merchant-b"
                className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition"
              >
                <span>Launch Storefront B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/merchant-b/orders"
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders & Tracking</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Highlights & Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Shared Firestore Schema</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized `orders` collection powered by Firebase Admin SDK. Includes automatic resilient local storage fallback for standalone offline evaluation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">SendGrid & Dev Outbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sends branded confirmation emails with dynamic TD Retail support Reply-To routing. Features a built-in Dev Email Outbox inspector for local verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Embedded AI Support Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Present on every page. Pre-loads verified order context, validates policies, displays tool outcomes, and supports one-click human escalation.
            </p>
          </div>
        </div>
      </main>

      {/* Global Interactive Dev Email Outbox Modal */}
      <DevOutboxModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        TD Retail Multi-Merchant Hackathon Prototype • Built with Next.js App Router, React 19, TypeScript, and Tailwind CSS.
      </footer>
    </div>
  );
}
