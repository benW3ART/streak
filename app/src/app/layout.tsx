import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/contexts/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STREAK - Daily Check-in Game',
  description: 'Miss one day, lose everything. Daily check-in game for Solana Seeker.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'STREAK',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
