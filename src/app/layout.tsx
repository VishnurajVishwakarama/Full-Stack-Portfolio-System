import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

import { supabase } from '@/lib/supabase'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('settings').select('profileImage').eq('id', 'site').single()

  return {
    title: 'Vishnuraj Vishwakarma - Portfolio',
    description: 'Full-Stack Portfolio System',
    icons: data?.profileImage ? { icon: data.profileImage } : undefined,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
