'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/lib/types';

interface OrderContextType {
  orders: Order[];
  saveOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'volt_nest_merchant_b_orders_v1';

// Seed sample confirmed orders for the demo
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'order_vn_8821',
    orderId: 'ORD-VN-8821',
    merchantId: 'merchant_b',
    customerId: 'cust_guest',
    customerEmail: 'guest@voltnest.store',
    customerName: 'Volt Nest Guest',
    items: [
      {
        id: 'item_vn_1',
        title: 'VoltCore Pro 100W GaN Charger',
        artistOrBrand: 'Volt Nest',
        quantity: 1,
        unitPrice: 3499,
        itemType: 'physical_accessory',
        formatOrWeight: 'GaN III • 100W • 3-Port',
      },
    ],
    orderStatus: 'delivered',
    orderStatusDisplay: 'Delivered — Ready for Use',
    totalAmount: 3499,
    currency: 'INR',
    trackingNumber: 'VN-TRK-8821-DEL',
    carrierOrCourier: 'Delhivery Express',
    estimatedDelivery: 'Delivered',
    deliveryAddress: 'Digital Vault (guest@voltnest.store)',
    courierNotes: 'Package delivered and signed. 1-year warranty activated from delivery date.',
    createdAt: '2026-10-12T10:00:00Z',
    updatedAt: '2026-10-14T14:30:00Z',
  },
  {
    id: 'order_vn_9042',
    orderId: 'ORD-VN-9042',
    merchantId: 'merchant_b',
    customerId: 'cust_guest',
    customerEmail: 'guest@voltnest.store',
    customerName: 'Volt Nest Guest',
    items: [
      {
        id: 'item_vn_2',
        title: 'NeoArc X1 True Wireless Earbuds',
        artistOrBrand: 'Volt Nest',
        quantity: 1,
        unitPrice: 5999,
        itemType: 'physical_accessory',
        formatOrWeight: 'ANC • BT 5.3 • 32h Battery',
      },
    ],
    orderStatus: 'shipped',
    orderStatusDisplay: 'In Transit — Out for Delivery',
    totalAmount: 5999,
    currency: 'INR',
    trackingNumber: 'VN-TRK-9042-SHP',
    carrierOrCourier: 'BlueDart Premium',
    estimatedDelivery: 'Expected Oct 18, 2026',
    deliveryAddress: 'Digital Vault (guest@voltnest.store)',
    courierNotes: 'Package en route. Last scanned at Mumbai hub.',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-16T08:00:00Z',
  },
];

import { useVisitor } from '@/context/VisitorContext';
import { syncOrderToTDRetail } from '@/lib/api-sync';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { visitor, isLoaded: isVisitorLoaded } = useVisitor();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const visitorStorageKey = `${ORDERS_STORAGE_KEY}_${visitor.id}`;

  useEffect(() => {
    if (!isVisitorLoaded) return;
    try {
      const stored = localStorage.getItem(visitorStorageKey);
      const visitorCode = visitor.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'GST1';

      const personalizedSeedOrders: Order[] = INITIAL_DEMO_ORDERS.map((demo, idx) => {
        const uniqueOrderId = `ORD-VN-${visitorCode}-${idx === 0 ? '8821' : '9042'}`;
        return {
          ...demo,
          id: `order_${visitor.id}_${idx + 1}`,
          orderId: uniqueOrderId,
          customerId: visitor.id,
          customerEmail: visitor.email,
          customerName: visitor.name,
          deliveryAddress: `Volt Nest Delivery (${visitor.email})`,
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
