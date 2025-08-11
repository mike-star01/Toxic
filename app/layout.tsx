import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNav from "@/components/bottom-nav"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Situationship Graveyard",
  description: "Memorialize your failed talking stages, flings, and almost-relationships",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-zinc-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="pb-16">{children}</div>
          <BottomNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
