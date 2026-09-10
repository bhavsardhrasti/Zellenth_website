import { Fredoka } from 'next/font/google';
import type { ReactNode } from 'react';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-marketing-display',
});

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className={fredoka.variable}>{children}</div>;
}
