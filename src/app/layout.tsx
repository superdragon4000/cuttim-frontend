import type {Metadata} from 'next';
import {Space_Grotesk, IBM_Plex_Mono} from 'next/font/google';
import './globals.css';

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Cuttim Laser',
  description: 'Upload DXF, get quote, pay and track laser cutting orders.',
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${space.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}
