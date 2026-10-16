"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, MerchantId, Product } from "@/types";

interface CartContextType {
  getCart: (merchantId: MerchantId) => CartItem[];
  addItem: (merchantId: MerchantId, product: Product, quantity?: number) => void;
  removeItem: (merchantId: MerchantId, productId: string) => void;
  updateQuantity: (
    merchantId: MerchantId,
    productId: string,
    quantity: number
  ) => void;
  clearCart: (merchantId: MerchantId) => void;
  getItemCount: (merchantId: MerchantId) => number;
  getSubtotal: (merchantId: MerchantId) => number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<Record<MerchantId, CartItem[]>>({
    merchant_a: [],
    merchant_b: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load carts from localStorage on mount
  useEffect(() => {
    try {
      const savedA = localStorage.getItem("td_cart_merchant_a");
      const savedB = localStorage.getItem("td_cart_merchant_b");

      setCarts({
        merchant_a: savedA ? JSON.parse(savedA) : [],
        merchant_b: savedB ? JSON.parse(savedB) : [],
      });
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveCartToStorage = (merchantId: MerchantId, items: CartItem[]) => {
    try {
      localStorage.setItem(`td_cart_${merchantId}`, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  };

  const getCart = (merchantId: MerchantId): CartItem[] => {
    return carts[merchantId] || [];
  };

  const addItem = (
    merchantId: MerchantId,
    product: Product,
    quantity: number = 1
  ) => {
    setCarts((prev) => {
      const currentItems = prev[merchantId] || [];
      const existingIndex = currentItems.findIndex(
        (i) => i.productId === product.id
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...currentItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          lineTotal: newQty * product.price,
        };
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          lineTotal: quantity * product.price,
          merchantId,
          imageUrl: product.imageUrl,
          category: product.category,
        };
        updated = [...currentItems, newItem];
      }

      saveCartToStorage(merchantId, updated);
      return { ...prev, [merchantId]: updated };
    });
  };

  const removeItem = (merchantId: MerchantId, productId: string) => {
    setCarts((prev) => {
      const currentItems = prev[merchantId] || [];
      const updated = currentItems.filter((i) => i.productId !== productId);
      saveCartToStorage(merchantId, updated);
      return { ...prev, [merchantId]: updated };
    });
  };

  const updateQuantity = (
    merchantId: MerchantId,
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(merchantId, productId);
      return;
    }

    setCarts((prev) => {
      const currentItems = prev[merchantId] || [];
      const updated = currentItems.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
            lineTotal: quantity * item.price,
          };
        }
        return item;
      });

      saveCartToStorage(merchantId, updated);
      return { ...prev, [merchantId]: updated };
    });
  };

  const clearCart = (merchantId: MerchantId) => {
    setCarts((prev) => {
      saveCartToStorage(merchantId, []);
      return { ...prev, [merchantId]: [] };
    });
  };

  const getItemCount = (merchantId: MerchantId): number => {
    const items = carts[merchantId] || [];
    return items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getSubtotal = (merchantId: MerchantId): number => {
    const items = carts[merchantId] || [];
    return items.reduce((acc, item) => acc + item.lineTotal, 0);
  };

  return (
    <CartContext.Provider
      value={{
        getCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
