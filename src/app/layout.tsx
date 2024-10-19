import { Inter } from 'next/font/google';
import Root from '@/components/Root';
import getStaticMetadata from '@/lib/getStaticMetadata';

import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata = getStaticMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Root>{children}</Root>
      </body>
    </html>
  );
}
