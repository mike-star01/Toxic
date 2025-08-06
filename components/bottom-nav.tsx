"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Skull, Plus, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/graveyard",
    icon: Skull,
    label: "Graveyard",
  },
  {
    href: "/add",
    icon: Plus,
    label: "Add",
    isSpecial: true,
  },
  {
    href: "/stats",
    icon: BarChart3,
    label: "Stats",
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-zinc-800 z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto h-20">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-w-[90px] h-[76px]",
                item.isSpecial
                  ? "bg-red-800 hover:bg-red-900 text-white"
                  : isActive
                    ? "text-red-400 bg-zinc-800"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800",
                pathname === item.href && "font-bold"
              )}
            >
              <Icon className="mb-1 w-11 h-11" />
              <span className="text-base font-semibold">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
