import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"

import "./globals.css"

const poppins = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "HackerDigest",
  description: "Powered by Upstash",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
