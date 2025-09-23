import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Situationship Graveyard",
  description: "A place to bury your failed situationships and learn from them",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black text-zinc-100`}>
        <ThemeProvider>
          <div className="pb-16">{children}</div>
          <BottomNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
