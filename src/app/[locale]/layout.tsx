import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {StoreProvider} from '@/app/providers/store-provider';
import {ThemeProvider} from '@/app/providers/theme-provider';
import {SiteHeader} from '@/widgets/site-header/ui/site-header';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/shared/i18n/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StoreProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
          </div>
        </ThemeProvider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
