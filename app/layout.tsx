import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lato, Raleway } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    icon: [
      {
        url: 'logo.PNG',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'logo.PNG',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'logo.PNG',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${raleway.variable} bg-background`}>
      <body className="font-serif antialiased overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
