"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useState, useEffect, useRef, Suspense } from "react"

import AppHeader from "@/components/app-header"
import { Skull } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

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

interface Situationship {
  id: string;
  name: string;
  cause: string;
  dates: { start: string; end: string };
  epitaph: string;
  reflection?: string;
  photo?: string; // Add optional photo field
  details: {
    meetInPerson: boolean;
    dateCount: number;
    kissed: boolean;
    hookup: boolean;
    love: boolean;
    fight: boolean;
    exclusive: boolean;
    closure: boolean;
    emotionalImpact: number;
    duration: string;
    location: string;
    redFlags: string[];
    lastMessage: string;
    flags?: string[];
  };
  revived: boolean;
  createdAt: string;
}

// Mock data - in a real app this would come from a database
const situationshipsData: Record<string, Situationship> = {
  "1": {
    id: "1",
    name: "Gym Rat Greg",
    cause: "Ghosted",
    dates: { start: "Jan 2023", end: "Mar 2023" },
    epitaph: "Here lies the man who said he wasn't ready for a relationship and got a girlfriend 2 weeks later.",
    reflection: "Learned to trust my gut when someone says they're not ready for a relationship. Also, if they're still on dating apps after we've been seeing each other for weeks, that's a major red flag. I deserve someone who's actually ready to commit.",
    photo: "/placeholder-user.jpg",
          details: {
        meetInPerson: true,
        dateCount: 3,
        kissed: true,
        hookup: false,
        love: false,
        fight: false,
        exclusive: false,
        closure: false,
        emotionalImpact: 5,
        duration: "2 months",
        location: "Coffee shop, his apartment, the park",
        redFlags: ["Always canceled last minute", "Never introduced me to friends", "Still had dating apps"],
        lastMessage: "Hey, I'm not really feeling this anymore. I think we should stop seeing each other.",
      },
    revived: false,
    createdAt: "March 15, 2023",
  },
  "2": {
    id: "2",
    name: "Tinder Tom",
    cause: "Breadcrumbed",
    dates: { start: "Nov 2022", end: "Jan 2023" },
    epitaph: "RIP to the texter who was 'just busy with work' for 8 consecutive weekends.",
    reflection: "Actions speak louder than words. If someone keeps saying they want to meet but always has excuses, they're not actually interested. I learned to stop making excuses for people who don't prioritize spending time with me.",
    photo: "/placeholder-user.jpg",
          details: {
        meetInPerson: true,
        dateCount: 2,
        kissed: true,
        hookup: true,
        love: false,
        fight: false,
        exclusive: false,
        closure: false,
        emotionalImpact: 5,
        duration: "3 months",
        location: "Dating app, local bar",
        redFlags: ["Always texting but never calling", "Cancelled dates frequently", "Vague about future plans"],
        lastMessage: "Sorry, work has been crazy. Let's catch up soon!",
      },
    revived: true,
    createdAt: "January 20, 2023",
  },
  "3": {
    id: "3",
    name: "Hinge Harry",
    cause: "Situationship",
    dates: { start: "May 2022", end: "Nov 2022" },
    epitaph: "We were 'exclusive but not official' until he wasn't exclusive anymore.",
          details: {
        meetInPerson: true,
        dateCount: 12,
        kissed: true,
        hookup: true,
        love: true,
        fight: true,
        exclusive: true,
        closure: false,
        emotionalImpact: 5,
        duration: "6 months",
        location: "Dating app, various restaurants",
        redFlags: ["Avoided relationship talks", "Never posted about us", "Kept dating apps"],
        lastMessage: "I think we want different things right now.",
      },
    revived: false,
    createdAt: "November 10, 2022",
  },
  "4": {
    id: "4",
    name: "Bumble Brad",
    cause: "Slow Fade",
    dates: { start: "Feb 2023", end: "Apr 2023" },
    epitaph: "Texts got shorter until they stopped completely. Classic.",
          details: {
        meetInPerson: true,
        dateCount: 5,
        kissed: true,
        hookup: false,
        love: false,
        fight: false,
        exclusive: false,
        closure: false,
        emotionalImpact: 5,
        duration: "2 months",
        location: "Dating app, coffee shops",
        redFlags: ["Took longer to reply each time", "Stopped initiating conversations", "Became distant"],
        lastMessage: "Yeah",
      },
    revived: false,
    createdAt: "April 5, 2023",
  },
  "5": {
    id: "5",
    name: "Coffee Shop Crush",
    cause: "Never Started",
    dates: { start: "Dec 2022", end: "Dec 2022" },
    epitaph: "We made eye contact for 3 months. I finally got their number. They never texted back.",
          details: {
        meetInPerson: true,
        dateCount: 0,
        kissed: false,
        hookup: false,
        love: false,
        fight: false,
        exclusive: false,
        closure: false,
        emotionalImpact: 5,
        duration: "1 day",
        location: "Local coffee shop",
        redFlags: ["Never responded to text", "Avoided eye contact after", "Changed coffee shop routine"],
        lastMessage: "Hey, it's [name] from the coffee shop!",
      },
    revived: false,
    createdAt: "December 12, 2022",
  },
  "6": {
    id: "6",
    name: "Instagram Influencer",
    cause: "Benched",
    dates: { start: "Mar 2023", end: "May 2023" },
    epitaph: "Kept me on the sidelines while exploring 'options'. I was never the starting player.",
          details: {
        meetInPerson: true,
        dateCount: 4,
        kissed: true,
        hookup: true,
        love: false,
        fight: false,
        exclusive: false,
        closure: false,
        emotionalImpact: 5,
        duration: "3 months",
        location: "Instagram DMs, trendy restaurants",
        redFlags: ["Always talking about other people", "Kept me secret", "Prioritized social media"],
        lastMessage: "You're amazing, but I'm not ready to settle down.",
      },
    revived: true,
    createdAt: "May 18, 2023",
  },
}

// Color themes for graves - base colors with gradient overlay
const colorThemes: { name: string; value: string; baseColor: string; borderColor: string }[] = [
  {
    name: "Classic Grey",
    value: "classic",
    baseColor: "#27272a",
    borderColor: "#52525b",
  },
  {
    name: "Rose Wine",
    value: "rose",
    baseColor: "#7f1d1d",
    borderColor: "#b91c1c",
  },
  {
    name: "Ocean Depths",
    value: "ocean",
    baseColor: "#1e3a8a",
    borderColor: "#1d4ed8",
  },
  {
    name: "Forest Night",
    value: "forest",
    baseColor: "#14532d",
    borderColor: "#15803d",
  },
  {
    name: "Sunset Glow",
    value: "sunset",
    baseColor: "#7c2d12",
    borderColor: "#c2410c",
  },
  {
    name: "Royal Purple",
    value: "purple",
    baseColor: "#581c87",
    borderColor: "#7c3aed",
  },
  {
    name: "Pink Blossom",
    value: "pink",
    baseColor: "#db2777", // pink-600
    borderColor: "#be185d", // pink-800
  },
  {
    name: "Midnight Black",
    value: "black",
    baseColor: "#18181b", // zinc-900
    borderColor: "#27272a", // zinc-800
  },
]

function SituationshipDetailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || ""
  const [selectedColor, setSelectedColor] = useState<string>("classic")
  const [situationship, setSituationship] = useState<Situationship | null>(null)

  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Missing grave ID</div>
      </div>
    )
  }

  useEffect(() => {
    if (!id) {
      setSituationship(null)
      return
    }

    // Try to get the situationship from localStorage first
    let found: Situationship | null = null
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      if (stored) {
        const graves: Situationship[] = JSON.parse(stored)
        found = graves.find(g => g.id === id) || null
      }
    }
    // If not found, fall back to example data
    if (!found) {
      found = situationshipsData[id] || null
    }
    if (found) {
      setSituationship(found)
      // Load saved color theme
      const savedColor = localStorage.getItem(`grave-color-${id}`)
      if (savedColor && colorThemes.find(theme => theme.value === savedColor)) {
        setSelectedColor(savedColor)
      }
    }
  }, [id])




  if (!situationship) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Situationship not found</div>
      </div>
    )
  }

  const currentTheme = colorThemes.find((theme) => theme.value === selectedColor) || colorThemes[0]

  const details = situationship.details || {}
  const location = details.location || ''
  const redFlags = details.redFlags || []
  const lastMessage = details.lastMessage || ''

  // Small minimal tombstone for detail view
  const SmallTombstone = () => (
    <div className="flex flex-col items-center">
      <div
        className="relative shadow-lg w-40 h-48 rounded-t-[40px] border-4 border-zinc-600 flex flex-col items-center justify-center p-4"
        style={{
          backgroundColor: currentTheme.baseColor,
          background: selectedColor === "classic" 
            ? `linear-gradient(135deg, ${currentTheme.baseColor} 0%, rgba(82, 82, 91, 0.9) 30%, rgba(52, 52, 59, 0.8) 60%, rgba(39, 39, 42, 1) 100%), 
               url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="${currentTheme.baseColor.replace('#', '%23')}"/><ellipse cx="8" cy="12" rx="4" ry="2.5" fill="rgba(255,255,255,0.15)" transform="rotate(25 8 12)"/><ellipse cx="28" cy="8" rx="4" ry="2" fill="rgba(0,0,0,0.2)" transform="rotate(-15 28 8)"/><ellipse cx="35" cy="25" rx="5" ry="4" fill="rgba(255,255,255,0.1)" transform="rotate(40 35 25)"/><ellipse cx="15" cy="32" rx="3" ry="2" fill="rgba(0,0,0,0.25)" transform="rotate(-30 15 32)"/><ellipse cx="5" cy="35" rx="4" ry="2.5" fill="rgba(255,255,255,0.12)" transform="rotate(60 5 35)"/><ellipse cx="32" cy="35" rx="4.5" ry="2" fill="rgba(0,0,0,0.18)" transform="rotate(-45 32 35)"/><circle cx="12" cy="20" r="1.3" fill="rgba(255,255,255,0.2)"/><circle cx="25" cy="15" r="0.9" fill="rgba(0,0,0,0.3)"/><circle cx="37" cy="19" r="1.2" fill="rgba(255,255,255,0.18)"/><circle cx="20" cy="37" r="0.8" fill="rgba(0,0,0,0.25)"/><circle cx="30" cy="28" r="1.3" fill="rgba(255,255,255,0.15)"/><circle cx="8" cy="25" r="0.7" fill="rgba(0,0,0,0.2)"/></svg>') repeat`
            : selectedColor === "black"
            ? `radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(0, 0, 0, 1) 100%), 
               radial-gradient(ellipse at 70% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 40%), 
               url('data:image/svg+xml;utf8,<svg width="90" height="90" xmlns="http://www.w3.org/2000/svg"><rect width="90" height="90" fill="%23000000"/><circle cx="15" cy="13" r="1.3" fill="white" opacity="0.9"/><circle cx="71" cy="19" r="1.5" fill="%23bfdbfe" opacity="0.8"/><circle cx="26" cy="36" r="0.9" fill="white" opacity="0.7"/><circle cx="58" cy="45" r="1.1" fill="%23e0f2fe" opacity="0.85"/><circle cx="10" cy="58" r="0.6" fill="white" opacity="0.6"/><circle cx="77" cy="65" r="1.2" fill="white" opacity="0.9"/><circle cx="36" cy="68" r="0.8" fill="%23dbeafe" opacity="0.75"/><circle cx="52" cy="15" r="0.4" fill="white" opacity="0.5"/><circle cx="19" cy="80" r="0.9" fill="white" opacity="0.8"/><circle cx="80" cy="36" r="0.4" fill="%23bfdbfe" opacity="0.6"/><circle cx="42" cy="26" r="0.3" fill="white" opacity="0.4"/><circle cx="65" cy="75" r="0.6" fill="white" opacity="0.7"/><circle cx="5" cy="26" r="0.2" fill="white" opacity="0.3"/><circle cx="49" cy="52" r="0.4" fill="%23e0f2fe" opacity="0.5"/><circle cx="23" cy="10" r="0.3" fill="white" opacity="0.4"/><circle cx="84" cy="80" r="0.5" fill="white" opacity="0.6"/></svg>')`
            : selectedColor === "pink"
            ? `linear-gradient(to bottom right, #db2777, rgba(255,255,255,0.65)), url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.2" fill="white" opacity="0.85"/><circle cx="80" cy="30" r="1.7" fill="white" opacity="0.7"/><circle cx="50" cy="70" r="2.1" fill="white" opacity="0.8"/><circle cx="70" cy="90" r="1.5" fill="white" opacity="0.7"/><circle cx="30" cy="50" r="1.8" fill="white" opacity="0.8"/><circle cx="60" cy="20" r="1.2" fill="deepskyblue" opacity="0.5"/><circle cx="90" cy="80" r="1.5" fill="deepskyblue" opacity="0.4"/><circle cx="20" cy="80" r="1.3" fill="white" opacity="0.7"/><circle cx="40" cy="90" r="1.1" fill="deepskyblue" opacity="0.5"/></svg>') repeat`
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
            : selectedColor === "sunset"
            ? `linear-gradient(135deg, 
                 rgba(255, 140, 0, 1) 0%,      /* Bright orange */
                 rgba(255, 165, 0, 0.95) 15%,  /* Golden orange */
                 rgba(255, 69, 0, 0.9) 30%,    /* Red orange */
                 rgba(255, 99, 71, 0.85) 45%,  /* Tomato */
                 rgba(255, 140, 0, 0.8) 60%,   /* Dark orange */
                 rgba(255, 69, 0, 0.9) 75%,    /* Red orange */
                 rgba(255, 165, 0, 1) 90%,     /* Golden orange */
                 rgba(255, 140, 0, 1) 100%     /* Bright orange */
               ),
               radial-gradient(ellipse at 25% 25%, rgba(255, 215, 0, 0.4) 0%, transparent 60%), /* Golden highlight */
               radial-gradient(ellipse at 75% 75%, rgba(255, 69, 0, 0.3) 0%, transparent 50%),  /* Red orange glow */
               radial-gradient(ellipse at 50% 50%, rgba(255, 165, 0, 0.2) 0%, transparent 40%),  /* Central warmth */
               url('data:image/svg+xml;utf8,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="%23ff8c00"/><circle cx="12" cy="15" r="1.5" fill="white" opacity="0.9"/><circle cx="45" cy="20" r="2" fill="%23ffd700" opacity="0.8"/><circle cx="25" cy="35" r="1.2" fill="white" opacity="0.7"/><circle cx="50" cy="45" r="1.8" fill="%23ffa500" opacity="0.9"/><circle cx="15" cy="50" r="1" fill="white" opacity="0.6"/><circle cx="40" cy="55" r="1.5" fill="%23ffd700" opacity="0.8"/><circle cx="30" cy="25" r="0.8" fill="white" opacity="0.5"/><circle cx="55" cy="35" r="1.2" fill="%23ffa500" opacity="0.7"/><circle cx="20" cy="40" r="0.6" fill="white" opacity="0.4"/><circle cx="35" cy="15" r="0.9" fill="%23ffd700" opacity="0.6"/><circle cx="48" cy="25" r="0.7" fill="white" opacity="0.3"/><circle cx="18" cy="30" r="0.5" fill="%23ffa500" opacity="0.5"/><circle cx="42" cy="40" r="0.8" fill="white" opacity="0.4"/><circle cx="28" cy="50" r="0.6" fill="%23ffd700" opacity="0.6"/><circle cx="52" cy="15" r="0.4" fill="white" opacity="0.3"/><circle cx="22" cy="45" r="0.7" fill="%23ffa500" opacity="0.4"/><circle cx="38" cy="30" r="0.5" fill="white" opacity="0.2"/><circle cx="15" cy="25" r="0.3" fill="%23ffd700" opacity="0.5"/><circle cx="45" cy="50" r="0.6" fill="white" opacity="0.3"/><circle cx="32" cy="40" r="0.4" fill="%23ffa500" opacity="0.4"/><circle cx="25" cy="15" r="0.2" fill="white" opacity="0.2"/><circle cx="50" cy="35" r="0.5" fill="%23ffd700" opacity="0.3"/><circle cx="18" cy="35" r="0.3" fill="white" opacity="0.1"/><circle cx="42" cy="20" r="0.4" fill="%23ffa500" opacity="0.3"/><circle cx="35" cy="45" r="0.3" fill="white" opacity="0.1"/><circle cx="48" cy="40" r="0.2" fill="%23ffd700" opacity="0.2"/></svg>') repeat`
           : selectedColor === "purple"
           ? `linear-gradient(135deg,
               #0b021f 0%,   /* near-black indigo */
               #2d0d5a 30%,  /* very dark purple */
               #5b21b6 65%,  /* deep royal purple */
               #000000 100%  /* fade to black */
             )`
            : `linear-gradient(to bottom right, ${currentTheme.baseColor}, rgba(39, 39, 42, 0.3))`,
        }}
      >
        {/* Photo section at the top or default skull */}
        {situationship.photo ? (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
              <img 
                src={situationship.photo} 
                alt={`${situationship.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-black/30 flex items-center justify-center">
              <Skull className="h-6 w-6 text-zinc-300" />
            </div>
          </div>
        )}
        
        {/* Text content - positioned below photo if exists, otherwise centered */}
        <div className={`text-center space-y-1 mt-16`}>
          <div className="text-sm font-bold text-white">{situationship.name}</div>
          <div className="text-xs text-zinc-200 leading-tight">
            <div className="text-xs">{formatDate(situationship.dates.start)}</div>
            <div className="text-zinc-300 text-[11px] my-0.5">to</div>
            <div className="text-xs">{formatDate(situationship.dates.end)}</div>
          </div>
          <div className="text-sm text-zinc-300 font-medium">R.I.P.</div>
        </div>
      </div>
      <div className="w-40 h-4 bg-zinc-600 border border-zinc-500 rounded-b-sm"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-x-hidden">
      <AppHeader title={situationship.name} showBack />

      <div className="px-4 py-4 space-y-4">

        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardHeader className="bg-zinc-900/70 border-b border-zinc-700/70">
            <CardTitle>Memorial 🕯️</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6">
              <SmallTombstone />
              {/* Cause of death label under grave */}
              <div className="text-zinc-200 text-base font-medium">
                {(() => {
                  const emojiMap: Record<string, string> = {
                    Ghosted: '👻',
                    Breadcrumbed: '🍞',
                    Fumbled: '🏀',
                    'Slow Fade': '🌅',
                    Cheated: '💔',
                    Benched: '🪑',
                    'Never Started': '❓',
                    Incompatible: '🧩',
                    'Friendzoned': '🤝',
                    Other: '💀',
                  }
                  const cause = situationship.cause
                  const emoji = emojiMap[cause] || '❓'
                  return <span className="inline-flex items-center gap-2"><span className="text-2xl leading-none">{emoji}</span><span>{cause}</span></span>
                })()}
              </div>
              <div className="text-center">
                <div className="text-lg italic mb-4">
                  "{situationship.epitaph}"
                  {situationship.details.flags && situationship.details.flags.length > 0 && (
                    <span className="ml-3">
                      {situationship.details.flags.map((flag, index) => (
                        <span key={index} className="text-2xl">{flag}</span>
                      ))}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <span>Duration: {situationship.details.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>


        </Card>

        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Autopsy 🔍</CardTitle>
            <CardDescription>The details of what happened between you 💔</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {/* Emotional Impact - Top of Autopsy */}
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="text-zinc-500 text-sm mb-3">Emotional Impact</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(situationship.details.emotionalImpact / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold text-red-400 min-w-[3rem] text-center">
                    {situationship.details.emotionalImpact}/10
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>1 - Barely affected</span>
                  <span>10 - Devastated</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Met in person</div>
                  <div className="font-medium">{situationship.details.meetInPerson ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Kissed</div>
                  <div className="font-medium">{situationship.details.kissed ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Hooked up</div>
                  <div className="font-medium">{situationship.details.hookup ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Fell in love</div>
                  <div className="font-medium">{situationship.details.love ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Had fights</div>
                  <div className="font-medium">{situationship.details.fight ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Were exclusive</div>
                  <div className="font-medium">{situationship.details.exclusive ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Got closure</div>
                  <div className="font-medium">{situationship.details.closure ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Dates went on</div>
                  <div className="font-medium">{situationship.details.dateCount == null ? '?' : situationship.details.dateCount}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Red Flags</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {redFlags.map((flag, index) => (
                      <li key={index} className="text-sm">
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Reflection 💭</CardTitle>
            <CardDescription>What you learned from this experience 🥀</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {situationship.reflection ? (
              <div className="bg-zinc-900 p-4 rounded-lg text-white leading-relaxed">
                "{situationship.reflection}"
              </div>
            ) : (
              <div className="bg-zinc-900 p-4 rounded-lg italic text-zinc-400">
                No reflection added yet. Add your personal thoughts on what you learned from this situationship.
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-zinc-700 p-4 flex justify-end">
            <Button 
              variant="outline" 
              className="border-zinc-700 bg-transparent"
              onClick={() => router.push(`/edit?id=${situationship.id}`)}
            >
              {situationship.reflection ? 'Edit Reflection' : 'Add Reflection'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete removed per request; manage deletion from Edit page */}
    </div>
  )
}

export default function SituationshipDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    }>
      <SituationshipDetailPageContent />
    </Suspense>
  )
}

