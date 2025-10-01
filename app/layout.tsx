import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { NotificationProvider } from '@/lib/notifications/NotificationProvider'

export const metadata: Metadata = {
  title: 'W2SYS - Professional Watch Management System',
  description: 'Professional luxury watch collection management system with authentication, backups, and real-time alerts',
  keywords: 'watch, collection, luxury, management, timepiece, rolex, authentication, backup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="sidebar-expanded">
        <AuthProvider>
          <NotificationProvider>
            <Providers>{children}</Providers>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


