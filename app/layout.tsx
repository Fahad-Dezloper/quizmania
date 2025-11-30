import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import { APP_URL } from '@/lib/constants'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'Launch Template',
    action: {
      type: 'launch_frame',
      name: 'Quizmania',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export const metadata: Metadata = {
  title: 'Quizmania',
  description: 'Quizmania - Test your knowledge on Base',
  openGraph: {
    title: 'Quizmania',
    description: 'Quizmania - Test your knowledge on Base',
  },
  other: {
    'fc:frame': JSON.stringify(frame),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
