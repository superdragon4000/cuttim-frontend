import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/shared/ui/button/ui';

export function LandingHero() {
  const t = useTranslations('landing');

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[radial-gradient(circle_at_top_left,_var(--accent-glow),_transparent_40%),linear-gradient(135deg,var(--surface),color-mix(in_hsl,var(--surface),black_10%))] p-8 md:p-12">
      <div className="max-w-3xl space-y-6">
        <p className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--muted)]">
          Laser cutting workflow
        </p>
        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
          {t('title')}
        </h1>
        <p className="max-w-2xl text-base text-[var(--muted)] md:text-lg">
          {t('subtitle')}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/preview">
            <Button>{t('startPreview')}</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">{t('signIn')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
