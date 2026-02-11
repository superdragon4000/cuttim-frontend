import {cn} from '@/shared/lib/cn';
import type {OrderStatus} from '../model/types';

const LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  fabricated: 'Fabricated',
  shipped: 'Shipped',
  completed: 'Completed',
  canceled: 'Canceled',
};

export function OrderStatusBadge({status}: {status: OrderStatus}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        status === 'pending' && 'bg-amber-300/20 text-amber-200',
        status === 'paid' && 'bg-emerald-300/20 text-emerald-200',
        status === 'fabricated' && 'bg-cyan-300/20 text-cyan-200',
        status === 'shipped' && 'bg-blue-300/20 text-blue-200',
        status === 'completed' && 'bg-lime-300/20 text-lime-200',
        status === 'canceled' && 'bg-rose-300/20 text-rose-200',
      )}
    >
      {LABEL[status]}
    </span>
  );
}
