'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {Button} from '@/shared/ui/button/ui';

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const target = locale === 'en' ? 'ru' : 'en';

  return (
    <Button variant="ghost" onClick={() => router.replace(pathname, {locale: target})}>
      {locale === 'en' ? 'RU' : 'EN'}
    </Button>
  );
}
