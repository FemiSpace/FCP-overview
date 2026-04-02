import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FCP — Firm Clean Power',
  description: 'UPHES Superfecta: Business model, assumptions, and unit economics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
