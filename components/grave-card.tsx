"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skull, Zap, Eye, Ghost, Sandwich, Users, TrendingDown, UserX, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Situationship = {
  id: string
  name: string
  cause: string
  dates: { start: string; end: string }
  epitaph: string
  photo?: string // Add optional photo field
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
  onBury?: (id: string) => void
  onDelete?: (id: string) => void
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

// Utility to format date from YYYY-MM to "Month YYYY"
function formatDate(dateString: string) {
  if (!dateString) return ''
  
  try {
    // Handle both "YYYY-MM" and "Month YYYY" formats
    if (dateString.includes('-')) {
      const [year, month] = dateString.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else {
      // Already formatted, return as is
      return dateString
    }
  } catch (error) {
    return dateString
  }
}

// Emoji mapping for causes
const causeEmojis: Record<string, string> = {
  Ghosted: '👻',
  Breadcrumbed: '🍞',
  Situationship: '🥀',
  'Slow Fade': '🌅',
  Benched: '🪑',
  'Never Started': '❓',
  Cheated: '💔',
  cheated: '💔',
  situationship: '🥀',
  'slow fade': '🌅',
  breadcrumbed: '🍞',
  ghosted: '👻',
  benched: '🪑',
  other: '💀',
}

export default function GraveCard({ situationship, onRevive, onBury, onDelete }: GraveCardProps) {
  const [isRevived, setIsRevived] = useState(situationship.revived)
  const [selectedColor, setSelectedColor] = useState("classic")
  const { toast } = useToast()

  useEffect(() => {
    // Load saved color theme for this grave
    const loadColor = () => {
      const savedColor = localStorage.getItem(`grave-color-${situationship.id}`)
      if (savedColor && colorThemes[savedColor]) {
        setSelectedColor(savedColor)
      }
    }

    // Load initial color
    loadColor()

    // Listen for storage changes (when color is changed in detail page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `grave-color-${situationship.id}`) {
        loadColor()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [situationship.id])

  const handleRevive = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // Short vibration
    }

    setIsRevived(true)

    if (onRevive) {
      onRevive(situationship.id)
    }

    toast({
      title: "They're alive!",
      description: `${situationship.name} has been revived from the dead!`,
      duration: 4000,
    })
  }

  const handleBury = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // Short vibration
    }

    setIsRevived(false)

    if (onBury) {
      onBury(situationship.id)
    }

    toast({
      title: "Back to the grave",
      description: `${situationship.name} has been buried again.`,
      duration: 4000,
    })
  }

  const handleDelete = () => {
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]) // Longer vibration for delete
    }

    if (onDelete) {
      onDelete(situationship.id)
    }

    toast({
      title: "Grave deleted",
      description: `${situationship.name} has been permanently removed.`,
      duration: 4000,
    })
  }

  // Limit epitaph to 100 characters
  const limitedEpitaph =
    situationship.epitaph.length > 100 ? situationship.epitaph.substring(0, 100) : situationship.epitaph

  const currentTheme = colorThemes[selectedColor] || colorThemes.classic
  const isPink = selectedColor === "pink"
  const isClassic = selectedColor === "classic"
  const isBlack = selectedColor === "black"
  const causeData = causeIcons[situationship.cause] || causeIcons["Never Started"]
  const CauseIcon = causeData.icon

  return (
    <div className="relative">
      {isRevived && (
        <div
          className="absolute -inset-0.5 rounded-t-[44px] pointer-events-none z-0"
          style={{
            background: 'transparent',
            mixBlendMode: 'normal',
            boxShadow: `0 0 18px rgba(251,191,36,.42), 0 0 28px rgba(251,191,36,.28)`,
            animation: 'outerPulse 2.2s ease-in-out infinite'
          }}
        />
      )}
      {/* Tombstone with base color + gradient overlay */}
      <div
        className="relative z-10 rounded-t-[40px] p-3 pb-3 h-[300px] flex flex-col justify-between overflow-visible"
        style={{
          backgroundColor: (isPink || isClassic || isBlack || selectedColor === "rose" || selectedColor === "ocean") ? 'transparent' : currentTheme.baseColor,
          background: isPink
            ? `linear-gradient(to bottom right, #db2777, rgba(255,255,255,0.65)), url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.2" fill="white" opacity="0.85"/><circle cx="80" cy="30" r="1.7" fill="white" opacity="0.7"/><circle cx="50" cy="70" r="2.1" fill="white" opacity="0.8"/><circle cx="70" cy="90" r="1.5" fill="white" opacity="0.7"/><circle cx="30" cy="50" r="1.8" fill="white" opacity="0.8"/><circle cx="60" cy="20" r="1.2" fill="deepskyblue" opacity="0.5"/><circle cx="90" cy="80" r="1.5" fill="deepskyblue" opacity="0.4"/><circle cx="20" cy="80" r="1.3" fill="white" opacity="0.7"/><circle cx="40" cy="90" r="1.1" fill="deepskyblue" opacity="0.5"/></svg>') repeat`
            : isClassic
            ? `linear-gradient(135deg, ${currentTheme.baseColor} 0%, rgba(82, 82, 91, 0.9) 30%, rgba(52, 52, 59, 0.8) 60%, rgba(39, 39, 42, 1) 100%), 
               url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${currentTheme.baseColor.replace('#', '%23')}"/><ellipse cx="8" cy="12" rx="5" ry="3" fill="rgba(255,255,255,0.15)" transform="rotate(25 8 12)"/><ellipse cx="28" cy="8" rx="4" ry="2" fill="rgba(0,0,0,0.2)" transform="rotate(-15 28 8)"/><ellipse cx="35" cy="25" rx="6" ry="4" fill="rgba(255,255,255,0.1)" transform="rotate(40 35 25)"/><ellipse cx="15" cy="32" rx="3" ry="2" fill="rgba(0,0,0,0.25)" transform="rotate(-30 15 32)"/><ellipse cx="5" cy="35" rx="4" ry="3" fill="rgba(255,255,255,0.12)" transform="rotate(60 5 35)"/><ellipse cx="32" cy="35" rx="5" ry="2" fill="rgba(0,0,0,0.18)" transform="rotate(-45 32 35)"/><circle cx="12" cy="20" r="1.5" fill="rgba(255,255,255,0.2)"/><circle cx="25" cy="15" r="1" fill="rgba(0,0,0,0.3)"/><circle cx="38" cy="18" r="1.2" fill="rgba(255,255,255,0.18)"/><circle cx="20" cy="38" r="0.8" fill="rgba(0,0,0,0.25)"/><circle cx="30" cy="28" r="1.3" fill="rgba(255,255,255,0.15)"/><circle cx="8" cy="25" r="0.7" fill="rgba(0,0,0,0.2)"/></svg>') repeat`
            : isBlack
            ? `radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(0, 0, 0, 1) 100%), 
               radial-gradient(ellipse at 70% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 40%), 
               url('data:image/svg+xml;utf8,<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" fill="%23000000"/><circle cx="15" cy="12" r="1.2" fill="white" opacity="0.9"/><circle cx="65" cy="20" r="1.5" fill="%23bfdbfe" opacity="0.8"/><circle cx="25" cy="35" r="0.8" fill="white" opacity="0.7"/><circle cx="55" cy="45" r="1.0" fill="%23e0f2fe" opacity="0.85"/><circle cx="10" cy="55" r="0.6" fill="white" opacity="0.6"/><circle cx="70" cy="60" r="1.1" fill="white" opacity="0.9"/><circle cx="35" cy="65" r="0.7" fill="%23dbeafe" opacity="0.75"/><circle cx="50" cy="15" r="0.5" fill="white" opacity="0.5"/><circle cx="20" cy="75" r="0.8" fill="white" opacity="0.8"/><circle cx="75" cy="35" r="0.4" fill="%23bfdbfe" opacity="0.6"/><circle cx="40" cy="25" r="0.3" fill="white" opacity="0.4"/><circle cx="60" cy="70" r="0.6" fill="white" opacity="0.7"/><circle cx="5" cy="25" r="0.2" fill="white" opacity="0.3"/><circle cx="45" cy="50" r="0.4" fill="%23e0f2fe" opacity="0.5"/><circle cx="30" cy="10" r="0.3" fill="white" opacity="0.4"/><circle cx="75" cy="75" r="0.5" fill="white" opacity="0.6"/></svg>')`
            : selectedColor === "rose"
            ? `linear-gradient(135deg, 
                 rgba(220, 20, 60, 1) 0%,     /* Deep cherry red */
                 rgba(178, 34, 34, 0.95) 25%, /* Fire brick */
                 rgba(139, 0, 0, 0.9) 50%,    /* Dark red */
                 rgba(102, 0, 51, 0.95) 75%,  /* Deep burgundy */
                 rgba(72, 0, 36, 1) 100%      /* Very dark burgundy */
               ),
               radial-gradient(ellipse at 30% 20%, rgba(255, 20, 147, 0.3) 0%, transparent 60%), /* Pink highlight */
               radial-gradient(ellipse at 70% 80%, rgba(220, 20, 60, 0.4) 0%, transparent 50%),  /* Cherry glow */
               radial-gradient(circle at 45% 45%, rgba(178, 34, 34, 0.2) 0%, transparent 40%)`   /* Central warmth */
            : selectedColor === "ocean"
            ? `linear-gradient(135deg, 
                 rgba(59, 130, 246, 1) 0%,     /* Bright blue */
                 rgba(37, 99, 235, 0.9) 25%,   /* Medium blue */
                 rgba(29, 78, 216, 0.8) 50%,   /* Deeper blue */
                 rgba(30, 64, 175, 0.9) 75%,   /* Dark blue */
                 rgba(15, 23, 42, 1) 100%      /* Very dark blue */
               ),
               radial-gradient(ellipse at 20% 30%, rgba(20, 184, 166, 0.4) 0%, transparent 50%), /* Teal highlight */
               radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 40%), /* Purple highlight */
               radial-gradient(ellipse at 60% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 45%)`  /* Cyan glow */
            : `linear-gradient(to bottom right, ${currentTheme.baseColor}, rgba(255,255,255,0.15))`,
          // Always draw the frame via inset box-shadow; avoids hard border edge clipping on mobile
          borderColor: 'transparent',
          borderWidth: 0,
          boxShadow: isRevived
            ? `inset 0 0 0 4px #fbbf24`
            : `inset 0 0 0 4px ${currentTheme.borderColor}`,
          ...(isRevived
            ? {
                animation: 'pulseGlow 2.2s ease-in-out infinite',
                willChange: 'filter, box-shadow'
              }
            : {}),
        }}
      >
        {/* Name */}
        <div className="text-center mb-3">
          <h3
            className="text-base font-bold text-white leading-tight px-3"
            style={{ display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={situationship.name}
          >
            {situationship.name}
          </h3>
        </div>

        {/* Centered skull icon and dates below */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-2 overflow-hidden">
            {situationship.photo ? (
              <img
                src={situationship.photo}
                alt={situationship.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Skull className="h-6 w-6 text-zinc-300" />
            )}
          </div>
          <div className="text-zinc-200 text-xs text-center">
            {formatDate(situationship.dates.start)} - {formatDate(situationship.dates.end)}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-200 hover:text-white hover:bg-black/30 h-8 text-xs px-2 flex-1"
              >
                <MoreVertical className="h-3 w-3 mr-1" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-zinc-900 border-zinc-700">
              <DropdownMenuItem asChild className="py-3 px-4 text-sm">
                <Link href={`/situationship/${situationship.id}`} className="flex items-center w-full">
                  <span className="mr-3 text-lg">👁️</span>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-3 px-4 text-sm">
                <Link href={`/edit/${situationship.id}`} className="flex items-center w-full">
                  <span className="mr-3 text-lg">✏️</span>
                  Edit Grave
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center text-red-400 focus:text-red-300 py-3 px-4 text-sm"
                onClick={handleDelete}
              >
                <span className="mr-3 text-lg">🗑️</span>
                Delete Grave
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        className={`w-full h-2 ${
          isRevived ? "bg-amber-400" : "bg-zinc-600"
        }`}
        style={
          isRevived
            ? { border: 'none' }
            : {}
        }
      ></div>
    </div>
  )
}
