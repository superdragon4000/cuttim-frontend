import {ManagerOrdersTable} from '@/widgets/order-lists/ui/manager-orders-table';

export default function ManagerOrdersPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Manager Console</h1>
      <p className="text-sm text-[var(--muted)]">
        Download files, update production status, assign tracking and verify payment state.
      </p>
      <ManagerOrdersTable />
    </section>
  );
}
