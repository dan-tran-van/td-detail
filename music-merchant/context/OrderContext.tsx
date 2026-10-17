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
    customerId: 'cust_guest',
    customerEmail: 'guest@soundwave.store',
    customerName: 'SoundWave Guest',
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
    deliveryAddress: 'Digital Vault (guest@soundwave.store)',
    courierNotes: 'Files verified md5 checksum matching. 5 remaining direct download attempts allowed.',
    createdAt: '2026-10-14T12:00:00Z',
    updatedAt: '2026-10-14T12:05:00Z',
  },
  {
    id: 'order_mus_9042',
    orderId: 'ORD-MUS-9042',
    merchantId: 'merchant_music',
    customerId: 'cust_guest',
    customerEmail: 'guest@soundwave.store',
    customerName: 'SoundWave Guest',
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
    deliveryAddress: 'Digital Vault (guest@soundwave.store)',
    courierNotes: 'Audio stems encoded. Awaiting licensing authority digital signature.',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
  },
];

import { useVisitor } from '@/context/VisitorContext';
import { syncOrderToTDRetail } from '@/lib/api-sync';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { visitor, isLoaded: isVisitorLoaded } = useVisitor();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Isolate orders per visitor
  const visitorStorageKey = `${ORDERS_STORAGE_KEY}_${visitor.id}`;

  useEffect(() => {
    if (!isVisitorLoaded) return;
    try {
      const stored = localStorage.getItem(visitorStorageKey);
      const visitorCode = visitor.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'GST1';

      // Map seed orders to active visitor with unique order IDs
      const personalizedSeedOrders: Order[] = INITIAL_DEMO_ORDERS.map((demo, idx) => {
        const uniqueOrderId = `ORD-MUS-${visitorCode}-${idx === 0 ? '8821' : '9042'}`;
        return {
          ...demo,
          id: `order_${visitor.id}_${idx + 1}`,
          orderId: uniqueOrderId,
          customerId: visitor.id,
          customerEmail: visitor.email,
          customerName: visitor.name,
          deliveryAddress: `Digital Vault (${visitor.email})`,
        };
      });

      let loadedOrders: Order[] = [];
      if (stored) {
        const parsed: Order[] = JSON.parse(stored);
        const merged = [...parsed];
        for (const demoOrder of personalizedSeedOrders) {
          if (!merged.some((o) => o.orderId === demoOrder.orderId)) {
            merged.push(demoOrder);
          }
        }
        loadedOrders = merged;
      } else {
        loadedOrders = personalizedSeedOrders;
      }

      setOrders(loadedOrders);

      // Auto-sync all loaded orders (including checkout orders) to TD Retail platform in background
      loadedOrders.forEach((order) => {
        syncOrderToTDRetail(order).catch((err) => {
          console.debug('[OrderContext] Order sync background notice:', err);
        });
      });
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
      setOrders([]);
    } finally {
      setIsLoaded(true);
    }
  }, [isVisitorLoaded, visitor.id, visitor.email, visitor.name, visitorStorageKey]);

  useEffect(() => {
    if (!isLoaded || !isVisitorLoaded) return;
    try {
      localStorage.setItem(visitorStorageKey, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [orders, isLoaded, isVisitorLoaded, visitorStorageKey]);

  const saveOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.filter((o) => o.orderId !== order.orderId)]);
    syncOrderToTDRetail(order).catch((err) => {
      console.debug('[OrderContext] saveOrder sync error:', err);
    });
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
