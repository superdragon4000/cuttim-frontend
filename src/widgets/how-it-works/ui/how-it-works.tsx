import {Card} from '@/shared/ui/card/ui';
import {useTranslations} from 'next-intl';

const STEPS = [
  'upload',
  'quote',
  'pay',
  'production',
  'delivery',
] as const;

export function HowItWorks() {
  const t = useTranslations('howItWorks');

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold md:text-3xl">{t('title')}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, idx) => (
          <Card key={step} className="space-y-3 p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-sm font-semibold text-[var(--muted)]">
              {idx + 1}
            </span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t(`${step}.title`)}
            </h3>
            <p className="text-sm text-[var(--muted)]">{t(`${step}.description`)}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
