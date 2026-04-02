import type { Metadata, Viewport } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { InteractiveDots } from '@/components/InteractiveDots';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://interviewwithus.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Interview with us — Live Expert Help During Your Interview',
    template: '%s | Interview with us',
  },
  description:
    'Book a live expert to assist you during your technical interview. Real-time answers, concise and speakable. ₹299 for 30 min, ₹499 for 1 hour+.',
  keywords: [
    'interview help', 'technical interview assistance', 'live interview support',
    'interview with us', 'interview preparation India', 'interview expert help',
    'coding interview help', 'interview assistance service',
  ],
  authors: [{ name: 'Interview with us' }],
  creator: 'Interview with us',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Interview with us',
    title: 'Interview with us — Live Expert Help During Your Interview',
    description: 'A live expert assists you throughout your technical interview. ₹299 / ₹499.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Interview with us' }],
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f9f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0b100c' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Interview with us',
              description: 'Live expert assistance during technical interviews.',
              provider: { '@type': 'Organization', name: 'Interview with us' },
              areaServed: 'IN',
              offers: [
                { '@type': 'Offer', name: '30 minute session', price: '299', priceCurrency: 'INR' },
                { '@type': 'Offer', name: '1 hour+ session', price: '499', priceCurrency: 'INR' },
              ],
              url: SITE_URL,
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <InteractiveDots />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
