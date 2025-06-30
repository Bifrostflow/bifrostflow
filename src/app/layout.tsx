import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProviderWrapper } from '@/components/clerk-provider';
import { ReduxProvider } from '@/redux/redux-provider';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bifrost Flow',
  description: 'Bridge your workflows',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark `}>
        <ClerkProviderWrapper>
          <ReduxProvider>{children}</ReduxProvider>
        </ClerkProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
