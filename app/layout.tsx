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
  title: 'Best Romantic Restaurant in Bhairahawa, Butwal & Kotihawa | Kohinoor Restaurant',
  description: 'Experience the finest dining at Kohinoor Restaurant in Bhairahawa, Butwal & Kotihawa. Famous Sekuwa corner, romantic private cabins, and cheapest cozy rooms starting at just Rs 500. Perfect for couples and birthday celebrations near Lumbini.',
  keywords: 'Kohinoor Restaurant, best restaurant in Bhairahawa, romantic restaurant Butwal, Rs 500 room Bhairahawa, cheapest room Butwal, affordable room Kotihawa, romantic cabins Bhairahawa, chicken sekuwa Bhairahawa, buff sekuwa Butwal, pork sekuwa Kotihawa, peaceful restaurant Bhairahawa, boating restaurant Kotihawa, cottage stay Bhairahawa, birthday party restaurant Butwal, best restaurant for occasions Kotihawa, nature friendly restaurant near Lumbini',
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Best Romantic Restaurant in Bhairahawa, Butwal & Kotihawa | Kohinoor Restaurant',
    description: 'Experience the finest dining at Kohinoor Restaurant. Romantic private cabins, famous Sekuwa corner, and cozy rooms starting at Rs 500.',
    url: 'https://kohinoorrestaurant.com',
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
    title: 'Best Romantic Restaurant in Bhairahawa, Butwal & Kotihawa | Kohinoor Restaurant',
    description: 'Experience the finest dining at Kohinoor Restaurant. Romantic private cabins, famous Sekuwa, and rooms starting at Rs 500.',
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
import SeoJsonLd from '@/components/seo-json-ld'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${lato.variable} ${raleway.variable} bg-background`}>
      <body className="font-serif antialiased overflow-x-hidden">
        <SeoJsonLd />
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
