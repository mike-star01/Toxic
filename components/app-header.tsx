"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreVertical, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface AppHeaderProps {
  title: string
  showBack?: boolean
  showMore?: boolean
  showProfile?: boolean
  onMore?: () => void
  centered?: boolean
}

export default function AppHeader({
  title,
  showBack = false,
  showMore = false,
  showProfile = true,
  onMore,
  centered = false,
}: AppHeaderProps) {
  const router = useRouter()

  if (centered) {
    return (
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-center px-4 py-4 relative">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {showProfile && (
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="absolute right-4 p-2 hover:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Link href="/profile">
                <User className="w-6 h-6 text-white" />
              </Link>
            </Button>
          )}
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2 hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showMore && (
            <Button variant="ghost" size="sm" onClick={onMore} className="p-2 hover:bg-zinc-800">
              <MoreVertical className="h-5 w-5" />
            </Button>
          )}
          {showProfile && (
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="p-2 hover:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center"
            >
              <Link href="/profile">
                <User className="w-6 h-6 text-white" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
