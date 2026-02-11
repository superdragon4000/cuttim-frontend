'use client';

import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/navigation';
import {ThemeToggle} from '@/shared/ui/theme-toggle/ui';
import {LanguageSwitch} from '@/shared/ui/language-switch/ui';
import {useAppDispatch, useAppSelector} from '@/shared/lib/hooks/redux';
import {Button} from '@/shared/ui/button/ui';
import {clearAuth} from '@/app/store/slices/auth-slice';
import {logout} from '@/shared/lib/api/auth';

export function SiteHeader() {
  const t = useTranslations('nav');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const onLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore network issues during local logout
    }
    localStorage.removeItem('auth');
    dispatch(clearAuth());
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_hsl,var(--background),transparent_15%)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--foreground)]">
          Cuttim
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/preview" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            {t('preview')}
          </Link>
          {user?.role === 'client' ? (
            <Link href="/cabinet/orders" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {t('cabinet')}
            </Link>
          ) : null}
          {user?.role === 'manager' ? (
            <Link href="/manager/orders" className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {t('manager')}
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          {user ? (
            <Button variant="outline" onClick={onLogout}>
              {t('logout')}
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline">{t('login')}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
