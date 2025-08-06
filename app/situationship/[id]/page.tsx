"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, Palette } from "lucide-react"
import { useState, useEffect, use } from "react"
import { useToast } from "@/hooks/use-toast"
import AppHeader from "@/components/app-header"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

interface Situationship {
  id: string;
  name: string;
  cause: string;
  dates: { start: string; end: string };
  epitaph: string;
  details: {
    meetInPerson: boolean;
    dateCount: number;
    kissed: boolean;
    hookup: boolean;
    exclusive: boolean;
    duration: string;
    location: string;
    redFlags: string[];
    lastMessage: string;
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
    details: {
      meetInPerson: true,
      dateCount: 3,
      kissed: true,
      hookup: false,
      exclusive: false,
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
    details: {
      meetInPerson: true,
      dateCount: 2,
      kissed: true,
      hookup: true,
      exclusive: false,
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
      exclusive: true,
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
      exclusive: false,
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
      exclusive: false,
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
      exclusive: false,
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

export default function SituationshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isRevived, setIsRevived] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>("classic")
  const [situationship, setSituationship] = useState<Situationship | null>(null)

  useEffect(() => {
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
      setIsRevived(found.revived)
      // Load saved color theme
      const savedColor = localStorage.getItem(`grave-color-${id}`)
      if (savedColor && colorThemes.find(theme => theme.value === savedColor)) {
        setSelectedColor(savedColor)
      }
    }
  }, [id])

  const handleRevive = () => {
    setIsRevived(true)
    toast({
      title: "Revived!",
      description: `${situationship?.name} has been revived!`,
    })
  }

  const handleBury = () => {
    setIsRevived(false)
    toast({
      title: "Buried!",
      description: `${situationship?.name} has been buried again!`,
    })
  }

  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue)
    localStorage.setItem(`grave-color-${id}`, colorValue)
    toast({
      title: "Color changed",
      description: `Grave color changed to ${colorThemes.find(theme => theme.value === colorValue)?.name}`,
      duration: 2000, // 2 seconds shorter
    })
  }

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
        className="relative shadow-lg w-28 h-32 rounded-t-[40px] border border-zinc-600 flex flex-col items-center justify-center p-3"
        style={{
          backgroundColor: currentTheme.baseColor,
          background: `linear-gradient(to bottom right, ${currentTheme.baseColor}, rgba(39, 39, 42, 0.3))`,
        }}
      >
        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-white">{situationship.name}</div>
          <div className="text-xs text-zinc-200 leading-tight">
            <div className="text-xs">{situationship.dates.start}</div>
            <div className="text-zinc-300 text-xs my-0.5">to</div>
            <div className="text-xs">{situationship.dates.end}</div>
          </div>
          <div className="text-xs text-zinc-300 font-medium">R.I.P.</div>
        </div>
      </div>
      <div className="w-32 h-3 bg-zinc-600 border border-zinc-500 rounded-b-sm"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title={situationship.name} showBack backButtonClassName="text-zinc-200" />

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-red-800">{situationship.cause}</Badge>
          {isRevived && (
            <Badge className="bg-amber-500 text-black">
              <Zap className="h-3 w-3 mr-1" />
              Revived
            </Badge>
          )}
        </div>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="bg-zinc-900 border-b border-zinc-700">
            <CardTitle>Memorial</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-8">
              <SmallTombstone />
              <div className="text-center">
                <div className="text-lg italic mb-4">"{situationship.epitaph}"</div>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <span>Duration: {situationship.details.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Color Picker Section */}
          {showColorPicker && (
            <div className="border-t border-zinc-700 p-4">
              <div className="text-sm font-medium text-zinc-300 mb-3">Choose grave color:</div>
              <div className="grid grid-cols-4 gap-2">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleColorChange(theme.value)}
                    className={`w-full h-8 rounded border-2 transition-all ${
                      selectedColor === theme.value ? "border-white scale-105" : "border-zinc-600 hover:border-zinc-400"
                    }`}
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.baseColor}, rgba(39, 39, 42, 0.3))`,
                    }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>
          )}

          <CardFooter className="border-t border-zinc-700 p-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-500 text-zinc-400 hover:bg-zinc-700 bg-transparent h-10 px-4"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>

            {!isRevived ? (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500 text-amber-400 hover:bg-amber-950 bg-transparent h-10 px-4"
                onClick={handleRevive}
              >
                <Zap className="h-4 w-4 mr-2" />
                Revive
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-500 text-zinc-400 hover:bg-zinc-700 bg-transparent h-10 px-4"
                onClick={handleBury}
              >
                <span className="mr-2">⚰️</span>
                Bury
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle>Situationship Autopsy</CardTitle>
            <CardDescription>The details of what happened between you</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Met in person</div>
                  <div className="font-medium">{situationship.details.meetInPerson ? "Yes" : "No"}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Number of dates</div>
                  <div className="font-medium">{situationship.details.dateCount}</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg">
                  <div className="text-zinc-500 text-sm mb-1">Duration</div>
                  <div className="font-medium">{situationship.details.duration}</div>
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
                  <div className="text-zinc-500 text-sm mb-1">Exclusive</div>
                  <div className="font-medium">{situationship.details.exclusive ? "Yes" : "No"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Where you met</h3>
                  <div className="bg-zinc-900 p-3 rounded-lg text-sm">{location}</div>
                </div>

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

                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-2">Last Message</h3>
                  <div className="bg-zinc-900 p-3 rounded-lg text-sm italic">"{lastMessage}"</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle>Reflection</CardTitle>
            <CardDescription>What you learned from this experience</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-zinc-900 p-4 rounded-lg italic text-zinc-400">
              Add your personal reflection on this situationship and what you learned from it.
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-700 p-4 flex justify-end">
            <Button variant="outline" className="border-zinc-700 bg-transparent">
              Add Reflection
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-4">Delete Grave</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-white !text-white text-center">This will permanently remove this grave from your graveyard. This action cannot be undone.</p>
          <DialogFooter />
          <div className="flex justify-center gap-6 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="text-zinc-200 border-zinc-600 w-40 py-3">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" className="w-40 py-3" onClick={() => {
              if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('situationships')
                let graves = stored ? JSON.parse(stored) : []
                graves = graves.filter((g: any) => g.id !== id)
                localStorage.setItem('situationships', JSON.stringify(graves))
              }
              router.push('/graveyard')
            }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
