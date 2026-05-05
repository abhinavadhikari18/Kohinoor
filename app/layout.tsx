import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato, Raleway } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import SmoothScroller from '@/components/smooth-scroller'
import CustomCursor from '@/components/custom-cursor'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ["latin"],
  variable: '--font-lato',
  weight: ['100', '300', '400', '700', '900'],
  display: 'swap',
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: '--font-raleway',
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kohinoor Restaurant | Where Peace, Nature & Love Meet',
  description: 'Experience the finest dining at Kohinoor Restaurant - a diamond in culinary excellence. Private cabins, serene lake views, famous Sekuwa corner, and cozy rooms starting at Rs 500.',
  keywords: 'Kohinoor Restaurant, fine dining, private cabins, Sekuwa, romantic dining, nature restaurant, Nepal restaurant',
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Kohinoor Restaurant | Where Peace, Nature & Love Meet',
    description: 'Experience the finest dining at Kohinoor Restaurant - a diamond in culinary excellence.',
    url: 'https://kohinoorrestaurant.com', // Replace with actual URL if known, but keeping generic for now or user can provide
    siteName: 'Kohinoor Restaurant',
    images: [
      {
        url: '/favicon.jpg',
        width: 800,
        height: 800,
        alt: 'Kohinoor Restaurant Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kohinoor Restaurant | Where Peace, Nature & Love Meet',
    description: 'Experience the finest dining at Kohinoor Restaurant - a diamond in culinary excellence.',
    images: ['/favicon.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${lato.variable} ${raleway.variable} bg-background`}>
      <body className="font-serif antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroller />
          <CustomCursor />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Toaster position="bottom-right" richColors theme="system" />
        </ThemeProvider>
      </body>
    </html>
  )
}
