import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'

import { Providers } from '@/components/providers'
import { APP_URL } from '@/lib/constants'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

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
      <body className={`${spaceGrotesk.variable} font-space px-4 py-2`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
