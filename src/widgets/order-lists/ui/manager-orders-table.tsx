'use client';

import {useCallback, useEffect, useState} from 'react';
import {Card} from '@/shared/ui/card/ui';
import {OrderStatusBadge} from '@/entities/order/ui/order-status-badge';
import type {Order, OrderStatus, PaymentStatus} from '@/entities/order/model/types';
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  updateTracking,
} from '@/shared/lib/api/orders';
import {useAppSelector} from '@/shared/lib/hooks/redux';
import {Button} from '@/shared/ui/button/ui';
import {env} from '@/shared/config/env';

export function ManagerOrdersTable() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token || user?.role !== 'manager') return;

    setLoading(true);
    try {
      const res = await getOrders(token, {limit: 50});
      setOrders(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const onUpdateStatus = async (orderId: number) => {
    if (!token) return;
    const value = prompt('Enter lifecycle status: pending/paid/fabricated/shipped/completed/canceled');
    if (!value) return;

    try {
      await updateOrderStatus(token, orderId, value as OrderStatus);
      await loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Status update failed');
    }
  };

  const onUpdatePayment = async (orderId: number) => {
    if (!token) return;
    const value = prompt('Enter payment status: pending/paid/failed');
    if (!value) return;

    try {
      await updatePaymentStatus(token, orderId, value as PaymentStatus);
      await loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment update failed');
    }
  };

  const onSetTracking = async (orderId: number) => {
    if (!token) return;
    const tracking = prompt('Tracking number');
    if (!tracking) return;

    try {
      await updateTracking(token, orderId, tracking);
      await loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tracking update failed');
    }
  };

  const onDownloadFile = async (fileId?: number) => {
    if (!token || !fileId) return;

    try {
      const response = await fetch(`${env.backendUrl}/files/${fileId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Download failed ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-file-${fileId}.dxf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed');
    }
  };

  if (!token) {
    return (
      <Card>
        <p className="text-sm text-[var(--muted)]">Login as manager to work with real orders.</p>
      </Card>
    );
  }

  if (user?.role !== 'manager') {
    return (
      <Card>
        <p className="text-sm text-[var(--muted)]">Only manager accounts can open this section.</p>
      </Card>
    );
  }

  return (
    <Card>
      {loading ? <p className="mb-3 text-sm text-[var(--muted)]">Loading orders...</p> : null}
      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="py-2">Order</th>
              <th className="py-2">Lifecycle</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Total</th>
              <th className="py-2">Tracking</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[var(--border)]/60 align-top">
                <td className="py-3">#{o.id}</td>
                <td className="py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="py-3">{o.paymentStatus}</td>
                <td className="py-3">{Number(o.totalPrice).toFixed(2)} RUB</td>
                <td className="py-3">{o.trackingNumber ?? 'Not assigned'}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => onUpdateStatus(o.id)}>
                      Status
                    </Button>
                    <Button variant="outline" onClick={() => onUpdatePayment(o.id)}>
                      Payment
                    </Button>
                    <Button variant="outline" onClick={() => onSetTracking(o.id)}>
                      Tracking
                    </Button>
                    <button
                      className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-xs"
                      onClick={() => onDownloadFile(o.files[0]?.file?.id)}
                      type="button"
                    >
                      Download DXF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!orders.length && !loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-[var(--muted)]">
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
