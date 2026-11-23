import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Rasa Nyiur — Kuliner Khas Manado',
    template: '%s | Rasa Nyiur',
  },
  description:
    'Pesan makanan khas Manado yang autentik — Tinutuan, Ayam Woku, Cakalang Fufu, dan lebih banyak lagi. Diantar langsung ke pintu rumahmu di Kota Manado.',
  keywords: ['makanan manado', 'kuliner minahasa', 'tinutuan', 'cakalang fufu', 'ayam woku', 'pesan antar manado'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://rasa-nyiur.vercel.app',
    siteName: 'Rasa Nyiur',
    title: 'Rasa Nyiur — Kuliner Khas Manado',
    description: 'Pesan makanan khas Manado yang autentik, diantar langsung ke rumahmu.',
  },
  metadataBase: new URL('https://rasa-nyiur.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} antialiased bg-[#F5F6F5]`}>
        {children}
      </body>
    </html>
  );
}
