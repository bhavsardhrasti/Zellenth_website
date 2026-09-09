import type { Metadata } from 'next';
import { Rozha_One, Aboreto, Architects_Daughter, Poppins } from 'next/font/google';
import './globals.css';

const rozhaOne = Rozha_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

const aboreto = Aboreto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-accent',
});

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-handwritten',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Zellenth',
  description: 'Visualize any laminate on any door, in real time.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${rozhaOne.variable} ${aboreto.variable} ${architectsDaughter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
