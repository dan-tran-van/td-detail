'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RotateCcw,
  RefreshCw,
  Edit,
  ExternalLink,
  ShieldCheck,
  Disc,
  Key,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order, OrderStatus } from '@/lib/types';

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Dialog state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('processing');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [courierNotes, setCourierNotes] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [savingOrder, setSavingOrder] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const highlightOrderId = urlParams.get('orderId');

      const res = await fetch('/api/merchant/orders');
      if (res.ok) {
        const data = await res.json();
        const list: Order[] = data.orders || [];
        setOrders(list);

        if (highlightOrderId) {
          const match = list.find((o) => o.orderId === highlightOrderId || o.id === highlightOrderId);
          if (match) {
            openEditModal(match);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.carrierOrCourier || '');
    setCourierNotes(order.courierNotes || '');

    // First digital item license/download if present
    const digitalItem = order.items?.find((i) => i.itemType === 'digital_audio' || i.licenseKey);
    setLicenseKey(digitalItem?.licenseKey || '');
    setDownloadUrl(digitalItem?.downloadUrl || '');

    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setSavingOrder(true);
    setSaveError(null);

    try {
      // Reuses existing PATCH /api/orders/[id] with tenant boundary enforcement
      const payload: any = {
        merchantId: editingOrder.merchantId,
        orderStatus: newStatus,
        trackingNumber: trackingNumber.trim() || undefined,
        carrierOrCourier: carrier.trim() || undefined,
        courierNotes: courierNotes.trim() || undefined,
      };

      // If digital keys modified, update items array
      if (editingOrder.items && editingOrder.items.length > 0 && (licenseKey || downloadUrl)) {
        payload.items = editingOrder.items.map((item, idx) => {
          if (idx === 0) {
            return {
              ...item,
              licenseKey: licenseKey.trim() || item.licenseKey,
              downloadUrl: downloadUrl.trim() || item.downloadUrl,
            };
          }
          return item;
        });
      }

      const res = await fetch(`/api/orders/${editingOrder.orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-merchant-id': editingOrder.merchantId,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setEditingOrder(null);
        fetchOrders();
      }, 700);
    } catch (err: any) {
      setSaveError(err.message || 'Error saving order update');
    } finally {
      setSavingOrder(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.trackingNumber || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] gap-1 font-semibold capitalize">
            <CheckCircle2 className="h-3 w-3" />
            <span>Delivered</span>
          </Badge>
        );
      case 'out_for_delivery':
        return (
          <Badge className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 text-[10px] gap-1 font-semibold capitalize">
            <Truck className="h-3 w-3" />
            <span>Out for Delivery</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] gap-1 font-semibold capitalize">
            <Clock className="h-3 w-3" />
            <span>Processing</span>
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/30 text-[10px] gap-1 font-semibold capitalize">
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border border-purple-500/30 text-[10px] gap-1 font-semibold capitalize">
            <RotateCcw className="h-3 w-3" />
            <span>Refunded</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Merchant Order Fulfillment Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Update real-time order status, courier tracking numbers, and digital item licenses. Instant ground-truth for Gemini AI.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={loading}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          <Input
            placeholder="Search order ID, customer, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['all', 'processing', 'out_for_delivery', 'delivered', 'refunded', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`h-7 px-2.5 rounded-full text-xs font-medium capitalize transition-colors shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items / Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Courier / Tracking</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span>Loading storefront orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {order.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{order.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-foreground font-medium">
                        ${order.totalAmount.toFixed(2)} {order.currency}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                        {order.items.map((i) => i.title).join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="py-3 px-4">
                      {order.trackingNumber ? (
                        <div>
                          <div className="font-mono text-xs text-foreground flex items-center gap-1">
                            <span>{order.trackingNumber}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {order.carrierOrCourier || 'Standard Carrier'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">
                          No tracking assigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(order)}
                        className="h-7 px-2.5 text-xs gap-1 font-medium cursor-pointer hover:border-primary"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Update</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Status & Fulfillment Modal */}
      <Dialog open={Boolean(editingOrder)} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent className="sm:max-w-md">
          {editingOrder && (
            <form onSubmit={handleUpdateOrder}>
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Update Order: {editingOrder.orderId}</span>
                  {getStatusBadge(editingOrder.orderStatus)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Changes made here instantly update the ground-truth database used by Gemini AI.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 text-xs">
                {saveError && (
                  <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Order successfully updated!</span>
                  </div>
                )}

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Fulfillment Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring capitalize"
                  >
                    <option value="processing">Processing (Awaiting dispatch)</option>
                    <option value="out_for_delivery">Out for Delivery (In Transit)</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Carrier and Tracking */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">
                      Courier / Carrier Name
                    </label>
                    <Input
                      placeholder="e.g. Sonic Logistics, FedEx"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">
                      Tracking Number
                    </label>
                    <Input
                      placeholder="e.g. TRK-8821-EXPRESS"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Courier Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">
                    Courier / Internal Notes
                  </label>
                  <Textarea
                    placeholder="e.g. Package left on front porch safe drop."
                    value={courierNotes}
                    onChange={(e) => setCourierNotes(e.target.value)}
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>

                {/* Digital Item Keys (if applicable) */}
                <div className="pt-2 border-t border-border space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Digital Item Entitlements
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Key className="h-3 w-3" />
                        <span>License Key</span>
                      </label>
                      <Input
                        placeholder="KEY-XXXX-XXXX"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>Download URL</span>
                      </label>
                      <Input
                        placeholder="https://vault.brand.store/dl/..."
                        value={downloadUrl}
                        onChange={(e) => setDownloadUrl(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingOrder(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingOrder}
                  className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground"
                >
                  {savingOrder ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

