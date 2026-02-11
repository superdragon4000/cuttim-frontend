import clsx from 'clsx';

export function cn(...classes: Array<string | undefined | false | null>) {
  return clsx(classes);
}
