'use client';

import {useTheme} from '@/app/providers/theme-provider';
import {Button} from '@/shared/ui/button/ui';

export function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === 'graphite' ? 'paper' : 'graphite')}
      aria-label="Toggle theme"
    >
      {theme === 'graphite' ? 'Paper Theme' : 'Graphite Theme'}
    </Button>
  );
}
