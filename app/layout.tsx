import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Kebun Pintar - TK Paud Harapan Kita Gadingan',
  description: 'Game APE interaktif edukatif untuk pengembangan kognitif dan motorik anak usia dini TK Paud Harapan Kita Gadingan',
  openGraph: {
    title: 'Kebun Pintar - TK Paud Harapan Kita Gadingan',
    description: 'Game APE interaktif edukatif untuk pengembangan kognitif dan motorik anak usia dini TK Paud Harapan Kita Gadingan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kebun Pintar - TK Paud Harapan Kita Gadingan',
    description: 'Game APE interaktif edukatif untuk pengembangan kognitif dan motorik anak usia dini TK Paud Harapan Kita Gadingan',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
