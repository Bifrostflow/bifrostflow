import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProviderWrapper } from '@/components/clerk-provider';
import { ReduxProvider } from '@/redux/redux-provider';
import ThemeProvider from '@/context/theme-provider';
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background w-screen sm:w-full`}>
        <ThemeProvider>
          <ClerkProviderWrapper>
            <ReduxProvider>{children}</ReduxProvider>
          </ClerkProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
