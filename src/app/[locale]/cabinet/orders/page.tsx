import {ClientOrdersTable} from '@/widgets/order-lists/ui/client-orders-table';

export default function ClientOrdersPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="text-sm text-[var(--muted)]">
        Connected to backend order status flow: pending to paid to fabricated to shipped.
      </p>
      <ClientOrdersTable />
    </section>
  );
}
