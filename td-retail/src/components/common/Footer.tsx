import React from "react";
import Link from "next/link";
import { MerchantConfig } from "@/types";
import { ShieldCheck, RefreshCw, Mail, Phone, Clock, Sparkles } from "lucide-react";

export function Footer({ merchant }: { merchant: MerchantConfig }) {
  const isMerchantA = merchant.id === "merchant_a";

  return (
    <footer
      className={`border-t transition-colors ${
        isMerchantA
          ? "bg-slate-950 border-slate-900 text-slate-400"
          : "bg-slate-50 border-slate-200 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <h3
              className={`text-lg font-bold ${
                isMerchantA ? "text-white" : "text-slate-900"
              }`}
            >
              {merchant.name}
            </h3>
            <p className="text-sm leading-relaxed max-w-md">
              {merchant.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isMerchantA
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {merchant.supportPolicy.warranty}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isMerchantA
                    ? "bg-slate-800 text-slate-300 border border-slate-700"
                    : "bg-slate-200/80 text-slate-800"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {merchant.supportPolicy.returnWindowDays}-Day Satisfaction
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4
              className={`text-xs font-bold uppercase tracking-wider ${
                isMerchantA ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Storefront Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${merchant.slug}`}
                  className="hover:underline transition"
                >
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href={`/${merchant.slug}/orders`}
                  className="hover:underline transition"
                >
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link
                  href={`/${merchant.slug}/cart`}
                  className="hover:underline transition"
                >
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline transition">
                  TD Retail Demo Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Routing */}
          <div className="space-y-3">
            <h4
              className={`text-xs font-bold uppercase tracking-wider ${
                isMerchantA ? "text-slate-300" : "text-slate-900"
              }`}
            >
              Direct Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{merchant.supportEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{merchant.supportPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{merchant.supportHours}</span>
              </li>
            </ul>
            <div className="p-3 rounded-lg text-[11px] bg-slate-900/50 dark:bg-slate-900 border border-slate-800 text-slate-400">
              Integrated with TD Retail multi-merchant AI customer support resolution platform.
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-slate-800/60 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {merchant.name}. All demo rights reserved. Prices in INR (₹).</p>
          <p className="flex items-center gap-1.5 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hackathon prototype for TD Retail multi-merchant resolution platform
          </p>
        </div>
      </div>
    </footer>
  );
}
