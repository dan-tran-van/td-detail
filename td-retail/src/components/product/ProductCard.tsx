"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, MerchantConfig } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  Check,
  Plus,
  Zap,
  Star,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export function ProductCard({
  product,
  merchant,
}: {
  product: Product;
  merchant: MerchantConfig;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isMerchantA = merchant.id === "merchant_a";

  const handleAddToCart = () => {
    addItem(merchant.id, product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    // Initiate direct purchase without adding to cart
    router.push(
      `/${merchant.slug}/checkout?productId=${product.id}&quantity=1`
    );
  };

  return (
    <div
      className={`group rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isMerchantA
          ? "bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/5 text-slate-100"
          : "bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-emerald-500/10 text-slate-900"
      }`}
    >
      {/* Visual Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-slate-950/20 p-4 flex items-center justify-center">
        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isMerchantA
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-emerald-600/90 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Availability Status */}
        <span
          className={`absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            product.status === "IN_STOCK"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}
        >
          {product.status.replace("_", " ")}
        </span>

        {/* SVG/Vector Illustration */}
        <div className="relative w-full h-full max-w-[280px] max-h-[220px] transition-transform duration-500 group-hover:scale-105">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & ID */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`font-semibold uppercase tracking-wider ${
                isMerchantA ? "text-amber-400/90" : "text-emerald-700"
              }`}
            >
              {product.category}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              ID: {product.id}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="font-bold text-base sm:text-lg leading-snug tracking-tight mb-1">
            {product.name}
          </h3>
          <p
            className={`text-xs font-medium mb-3 ${
              isMerchantA ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {product.subtitle}
          </p>

          {/* Description */}
          <p
            className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
              isMerchantA ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {product.description}
          </p>

          {/* Key Feature Bullets */}
          <ul className="space-y-1 mb-5">
            {product.features.slice(0, 2).map((feat, i) => (
              <li
                key={i}
                className={`text-[11px] flex items-center gap-1.5 ${
                  isMerchantA ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isMerchantA ? "bg-amber-400" : "bg-emerald-600"
                  }`}
                />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Price in INR</span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Buttons: Add to Cart and Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : isMerchantA
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm ${
                isMerchantA
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
