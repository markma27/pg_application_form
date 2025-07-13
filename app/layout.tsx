import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import './animations.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
}

export const metadata: Metadata = {
  title: 'PortfolioGuardian - Client Application',
  description: 'Secure client onboarding for investment portfolio administration and reporting service.',
  robots: 'noindex, nofollow',
  icons: {
    icon: [
      {
        url: '/logo-favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo-favicon.svg',
        color: '#22c55e',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://*.supabase.co; frame-src https://js.stripe.com;" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className={`${montserrat.variable} font-sans`}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
