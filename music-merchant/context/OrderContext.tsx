'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/lib/types';

interface OrderContextType {
  orders: Order[];
  saveOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'soundwave_music_orders_v1';

// Seed sample confirmed orders so the demo is instantly full and queryable
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'order_mus_8821',
    orderId: 'ORD-MUS-8821',
    merchantId: 'merchant_music',
    customerId: 'cust_sarah_connor',
    customerEmail: 'sarah.connor@example.com',
    customerName: 'Sarah Connor',
    items: [
      {
        id: 'item_mus_1',
        title: 'Neon Echoes (Synthwave Vol. 2 - Deluxe Master)',
        artistOrBrand: 'Kavinsky & The Midnight Echo',
        quantity: 1,
        unitPrice: 1999,
        itemType: 'digital_audio',
        formatOrWeight: 'FLAC 24-bit / 96kHz + 320kbps MP3 + WAV Stems',
        licenseKey: 'SW-8821-NEON-FLAC-L01',
        downloadUrl: 'https://downloads.soundwave.store/vault/SW-8821-NEON-DELUXE.zip',
      },
    ],
    orderStatus: 'delivered',
    orderStatusDisplay: 'Download Ready & License Active',
    totalAmount: 1999,
    currency: 'INR',
    trackingNumber: 'DIGITAL-DL-8821-OK',
    carrierOrCourier: 'SoundWave Cloud Vault (High Speed CDN)',
    estimatedDelivery: 'Immediate (Instant Access)',
    deliveryAddress: 'Digital Vault (sarah.connor@example.com)',
    courierNotes: 'Files verified md5 checksum matching. 5 remaining direct download attempts allowed.',
    createdAt: '2026-10-14T12:00:00Z',
    updatedAt: '2026-10-14T12:05:00Z',
  },
  {
    id: 'order_mus_9042',
    orderId: 'ORD-MUS-9042',
    merchantId: 'merchant_music',
    customerId: 'cust_sarah_connor',
    customerEmail: 'sarah.connor@example.com',
    customerName: 'Sarah Connor',
    items: [
      {
        id: 'item_mus_2',
        title: 'Midnight Velocity (Cyberpunk OST)',
        artistOrBrand: 'SoundWave Cinematic Labs',
        quantity: 1,
        unitPrice: 1499,
        itemType: 'digital_audio',
        formatOrWeight: 'FLAC 24-bit / 48kHz + Instrumental Stems',
        licenseKey: 'SW-9042-OST-COMM-77',
        downloadUrl: 'https://downloads.soundwave.store/vault/SW-9042-CYBERPUNK.zip',
      },
    ],
    orderStatus: 'processing',
    orderStatusDisplay: 'Generating Cryptographic License Keys',
    totalAmount: 1499,
    currency: 'INR',
    trackingNumber: 'DIGITAL-GEN-9042-PENDING',
    carrierOrCourier: 'SoundWave Key Generator Engine',
    estimatedDelivery: 'Within 5-10 minutes',
    deliveryAddress: 'Digital Vault (sarah.connor@example.com)',
    courierNotes: 'Audio stems encoded. Awaiting licensing authority digital signature.',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed: Order[] = JSON.parse(stored);
        // Merge initial demo orders if not already present
        const merged = [...parsed];
        for (const demoOrder of INITIAL_DEMO_ORDERS) {
          if (!merged.some((o) => o.orderId === demoOrder.orderId)) {
            merged.push(demoOrder);
          }
        }
        setOrders(merged);
      } else {
        setOrders(INITIAL_DEMO_ORDERS);
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
      setOrders(INITIAL_DEMO_ORDERS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [orders, isLoaded]);

  const saveOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.filter((o) => o.orderId !== order.orderId)]);
  };

  const getOrderById = (orderId: string) => {
    const normalized = orderId.trim().toUpperCase();
    return orders.find(
      (o) => o.orderId.toUpperCase() === normalized || o.id === orderId
    );
  };

  return (
    <OrderContext.Provider value={{ orders, saveOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
