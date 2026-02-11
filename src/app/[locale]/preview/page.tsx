import {QuotePreviewForm} from '@/features/public-preview/ui/quote-preview-form';

export default function PreviewPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Public Quote Preview</h1>
      <p className="max-w-3xl text-sm text-[var(--muted)]">
        Guest mode shows the full flow before registration: upload DXF, pick material,
        set quantity, estimate shipping and total. Register to place a real order.
      </p>
      <QuotePreviewForm />
    </section>
  );
}
