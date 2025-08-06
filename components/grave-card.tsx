"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skull, Zap, Eye, Ghost, Sandwich, Users, TrendingDown, UserX } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

type Situationship = {
  id: string
  name: string
  cause: string
  dates: { start: string; end: string }
  epitaph: string
  details: {
    meetInPerson: boolean
    dateCount: number
    kissed: boolean
    hookup: boolean
    exclusive: boolean
    duration: string
  }
  revived: boolean
}

interface GraveCardProps {
  situationship: Situationship
  onRevive?: (id: string) => void
}

// Color themes for graves - base colors with gradient overlay
const colorThemes: Record<string, { baseColor: string; borderColor: string }> = {
  classic: {
    baseColor: "#3f3f46", // zinc-700 (brighter)
    borderColor: "#52525b", // zinc-600
  },
  rose: {
    baseColor: "#7f1d1d", // red-900
    borderColor: "#b91c1c", // red-700
  },
  ocean: {
    baseColor: "#1e3a8a", // blue-900
    borderColor: "#1d4ed8", // blue-700
  },
  forest: {
    baseColor: "#14532d", // green-900
    borderColor: "#15803d", // green-700
  },
  sunset: {
    baseColor: "#7c2d12", // orange-900
    borderColor: "#c2410c", // orange-700
  },
  purple: {
    baseColor: "#581c87", // purple-900
    borderColor: "#7c3aed", // purple-700
  },
  pink: {
    baseColor: "#db2777", // pink-600
    borderColor: "#be185d", // pink-800
  },
  black: {
    baseColor: "#18181b", // zinc-900
    borderColor: "#27272a", // zinc-800
  },
}

// Cause of death icons with colors - same as stats page
const causeIcons: Record<string, { icon: any; color: string }> = {
  Ghosted: { icon: Ghost, color: "text-purple-400" },
  Breadcrumbed: { icon: Sandwich, color: "text-orange-400" },
  Situationship: { icon: Users, color: "text-blue-400" },
  "Slow Fade": { icon: TrendingDown, color: "text-green-400" },
  Benched: { icon: UserX, color: "text-pink-400" },
  "Never Started": { icon: UserX, color: "text-gray-400" }, // fallback
}

// Utility to detect iOS
function isIOS() {
  if (typeof navigator === 'undefined') return false;
  // @ts-ignore
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && (typeof window === 'undefined' || !(window as any).MSStream);
}

// Emoji mapping for causes
const causeEmojis: Record<string, string> = {
  Ghosted: '👻',
  Breadcrumbed: '🍞',
  Situationship: '💔',
  'Slow Fade': '🌫️',
  Benched: '🪑',
  'Never Started': '❓',
  Cheated: '🥀',
  cheated: '🥀',
  situationship: '💔',
  'slow fade': '🌫️',
  breadcrumbed: '🍞',
  ghosted: '👻',
  benched: '🪑',
  other: '💀',
}

export default function GraveCard({ situationship, onRevive }: GraveCardProps) {
  const [isRevived, setIsRevived] = useState(situationship.revived)
  const [selectedColor, setSelectedColor] = useState("classic")
  const { toast } = useToast()

  useEffect(() => {
    // Load saved color theme for this grave
    const savedColor = localStorage.getItem(`grave-color-${situationship.id}`)
    if (savedColor && colorThemes[savedColor]) {
      setSelectedColor(savedColor)
    }
  }, [situationship.id])

  const handleRevive = () => {
    setIsRevived(true)

    if (onRevive) {
      onRevive(situationship.id)
    }

    toast({
      title: "They're alive!",
      description: `${situationship.name} has been revived from the dead!`,
    })
  }

  const handleBury = () => {
    setIsRevived(false)

    toast({
      title: "Back to the grave",
      description: `${situationship.name} has been buried again.`,
    })
  }

  // Limit epitaph to 85 characters
  const limitedEpitaph =
    situationship.epitaph.length > 85 ? situationship.epitaph.substring(0, 85) : situationship.epitaph

  const currentTheme = colorThemes[selectedColor] || colorThemes.classic
  const isPink = selectedColor === "pink"
  const causeData = causeIcons[situationship.cause] || causeIcons["Never Started"]
  const CauseIcon = causeData.icon

  return (
    <div className="relative">
      {/* Tombstone with base color + gradient overlay */}
      <div
        className="relative border-4 rounded-t-[40px] p-3 pb-3 h-[300px] flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: currentTheme.baseColor,
          background: isPink
            ? `linear-gradient(to bottom right, #db2777, rgba(255,255,255,0.65)), url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.2" fill="white" opacity="0.85"/><circle cx="80" cy="30" r="1.7" fill="white" opacity="0.7"/><circle cx="50" cy="70" r="2.1" fill="white" opacity="0.8"/><circle cx="70" cy="90" r="1.5" fill="white" opacity="0.7"/><circle cx="30" cy="50" r="1.8" fill="white" opacity="0.8"/><circle cx="60" cy="20" r="1.2" fill="deepskyblue" opacity="0.5"/><circle cx="90" cy="80" r="1.5" fill="deepskyblue" opacity="0.4"/><circle cx="20" cy="80" r="1.3" fill="white" opacity="0.7"/><circle cx="40" cy="90" r="1.1" fill="deepskyblue" opacity="0.5"/></svg>') repeat`
            : `linear-gradient(to bottom right, ${currentTheme.baseColor}, rgba(255,255,255,0.15))`,
          borderColor: isRevived ? "#fbbf24" : currentTheme.borderColor,
          ...(isRevived
            ? {
                boxShadow: `
                0 0 20px rgba(251, 191, 36, 0.8),
                0 0 40px rgba(251, 191, 36, 0.6),
                0 0 60px rgba(251, 191, 36, 0.4),
                inset 0 0 20px rgba(251, 191, 36, 0.1)
              `,
              }
            : {}),
        }}
      >
        {/* Name */}
        <div className="text-center mb-3">
          <h3 className="text-base font-bold text-white leading-tight">{situationship.name}</h3>
        </div>

        {/* Centered skull icon and dates below */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-2">
            <Skull className="h-6 w-6 text-zinc-300" />
          </div>
          <div className="text-zinc-200 text-xs text-center">
            {situationship.dates.start} - {situationship.dates.end}
          </div>
          {/* Cause of death icon - bigger and colored or emoji on iOS */}
          <div className="mt-2">
            <span className="text-2xl">{causeEmojis[situationship.cause as keyof typeof causeEmojis] || '❓'}</span>
          </div>
        </div>

        {/* Epitaph - fixed height container */}
        <div className="flex-1 flex items-center justify-center mb-3 px-1 min-h-0">
          <p className="text-zinc-100 italic text-xs text-center leading-relaxed">"{limitedEpitaph}"</p>
        </div>

        {/* Bottom buttons with proper containment */}
        <div className="flex justify-between items-center pt-2 border-t border-white/20 gap-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-200 hover:text-white hover:bg-black/30 h-8 text-xs px-2 flex-1"
            asChild
          >
            <Link href={`/situationship/${situationship.id}`}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>

          {isRevived ? (
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-400 text-zinc-200 hover:bg-black/30 bg-transparent h-8 text-xs px-2 flex-1"
              onClick={handleBury}
            >
              <span className="mr-1">⚰️</span>
              Bury
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-amber-400 text-amber-300 hover:bg-amber-950/50 bg-transparent h-8 text-xs px-2 flex-1"
              onClick={handleRevive}
            >
              <Zap className="h-3 w-3 mr-1" />
              Revive
            </Button>
          )}
        </div>
      </div>

      {/* Stone base with stronger golden glow */}
      <div
        className={`w-full h-2 border-x-4 border-b-4 ${
          isRevived ? "bg-amber-400 border-amber-400" : "bg-zinc-600 border-zinc-600"
        }`}
        style={
          isRevived
            ? {
                boxShadow: `
            0 0 15px rgba(251, 191, 36, 0.8),
            0 0 30px rgba(251, 191, 36, 0.6)
          `,
              }
            : {}
        }
      ></div>
    </div>
  )
}
