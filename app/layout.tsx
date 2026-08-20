import type { Metadata } from 'next';
import { Karla, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

/* Karla porte tout le corps de texte et les micro-labels.
   Noto Sans TC ne sert que de repli à S2G Moon (voir globals.css). */
const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-karla',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-tc',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Made in Taiwan — Taipei, mes adresses',
  description:
    "Mes adresses et mes quartiers préférés à Taipei, et un peu autour : guide personnel, quartier par quartier.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${karla.variable} ${notoSansTC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
