'use client';

import {useEffect, useState} from 'react';
import {Card} from '@/shared/ui/card/ui';
import {OrderStatusBadge} from '@/entities/order/ui/order-status-badge';
import type {Order} from '@/entities/order/model/types';
import {getOrders} from '@/shared/lib/api/orders';
import {useAppSelector} from '@/shared/lib/hooks/redux';

export function ClientOrdersTable() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== 'client') return;

    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getOrders(token);
        if (active) setOrders(res);
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load orders');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [token, user?.role]);

  if (!token) {
    return (
      <Card>
        <p className="text-sm text-[var(--muted)]">Login as client to load your real orders.</p>
      </Card>
    );
  }

  if (user?.role !== 'client') {
    return (
      <Card>
        <p className="text-sm text-[var(--muted)]">Only client accounts can open this section.</p>
      </Card>
    );
  }

  return (
    <Card>
      {loading ? <p className="mb-3 text-sm text-[var(--muted)]">Loading orders...</p> : null}
      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="py-2">Order</th>
              <th className="py-2">Status</th>
              <th className="py-2">Payment</th>
              <th className="py-2">Total</th>
              <th className="py-2">Tracking</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[var(--border)]/60">
                <td className="py-3">#{o.id}</td>
                <td className="py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="py-3">{o.paymentStatus}</td>
                <td className="py-3">{Number(o.totalPrice).toFixed(2)} RUB</td>
                <td className="py-3">{o.trackingNumber ?? 'Not assigned'}</td>
              </tr>
            ))}
            {!orders.length && !loading ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-[var(--muted)]">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
