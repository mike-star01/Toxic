"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import GraveCard from "@/components/grave-card"
import AppHeader from "@/components/app-header"

// Sample data - in a real app this would come from a database
const initialSituationships = [
  {
    id: "1",
    name: "Gym Rat Greg",
    cause: "Ghosted",
    dates: { start: "Jan 2023", end: "Mar 2023" },
    epitaph: "Here lies the man who said he wasn't ready for a relationship and got a girlfriend 2 weeks later.",
    reflection: "Learned to trust my gut when someone says they're not ready for a relationship.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 3,
      kissed: true,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "2 months",
      location: "Coffee shop, his apartment, the park",
      redFlags: ["Always canceled last minute", "Never introduced me to friends", "Still had dating apps"],
      lastMessage: "Hey, I'm not really feeling this anymore.",
    },
    revived: false,
    createdAt: "March 15, 2023",
  },
  {
    id: "2",
    name: "Tinder Tom",
    cause: "Breadcrumbed",
    dates: { start: "Nov 2022", end: "Jan 2023" },
    epitaph: "RIP to the texter who was 'just busy with work' for 8 consecutive weekends.",
    reflection: "Actions speak louder than words. If someone keeps saying they want to meet but always has excuses, they're not actually interested.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 2,
      kissed: true,
      hookup: true,
      love: false,
      fight: false,
      exclusive: false,
      duration: "3 months",
      location: "Dating app, local bar",
      redFlags: ["Always texting but never calling", "Cancelled dates frequently", "Vague about future plans"],
      lastMessage: "Sorry, work has been crazy. Let's catch up soon!",
    },
    revived: true,
    createdAt: "January 20, 2023",
  },
  {
    id: "3",
    name: "Hinge Harry",
    cause: "Situationship",
    dates: { start: "May 2022", end: "Nov 2022" },
    epitaph: "We were 'exclusive but not official' until he wasn't exclusive anymore.",
    reflection: "Learned that 'exclusive but not official' is just a way to keep options open.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 12,
      kissed: true,
      hookup: true,
      love: true,
      fight: true,
      exclusive: true,
      duration: "6 months",
      location: "Dating app, various restaurants",
      redFlags: ["Avoided relationship talks", "Never posted about us", "Kept dating apps"],
      lastMessage: "I think we want different things right now.",
    },
    revived: false,
    createdAt: "November 10, 2022",
  },
  {
    id: "4",
    name: "Bumble Brad",
    cause: "Slow Fade",
    dates: { start: "Feb 2023", end: "Apr 2023" },
    epitaph: "Texts got shorter until they stopped completely. Classic.",
    reflection: "When someone starts becoming distant, it's better to address it directly than wait for them to disappear.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 5,
      kissed: true,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "2 months",
      location: "Dating app, coffee shops",
      redFlags: ["Took longer to reply each time", "Stopped initiating conversations", "Became distant"],
      lastMessage: "Yeah",
    },
    revived: false,
    createdAt: "April 5, 2023",
  },
  {
    id: "5",
    name: "Coffee Shop Crush",
    cause: "Never Started",
    dates: { start: "Dec 2022", end: "Dec 2022" },
    epitaph: "We made eye contact for 3 months. I finally got their number. They never texted back.",
    reflection: "Sometimes the fantasy is better than the reality. Not every connection needs to be pursued.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 0,
      kissed: false,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "1 day",
      location: "Local coffee shop",
      redFlags: ["Never responded to text", "Avoided eye contact after", "Changed coffee shop routine"],
      lastMessage: "Hey, it's [name] from the coffee shop!",
    },
    revived: false,
    createdAt: "December 12, 2022",
  },
  {
    id: "6",
    name: "Instagram Influencer",
    cause: "Benched",
    dates: { start: "Mar 2023", end: "May 2023" },
    epitaph: "Kept me on the sidelines while exploring 'options'. I was never the starting player.",
    reflection: "Being someone's backup option is never worth it. I deserve to be someone's first choice.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 4,
      kissed: true,
      hookup: true,
      love: false,
      fight: false,
      exclusive: false,
      duration: "3 months",
      location: "Instagram DMs, trendy restaurants",
      redFlags: ["Always talking about other people", "Kept me secret", "Prioritized social media"],
      lastMessage: "You're amazing, but I'm not ready to settle down.",
    },
    revived: true,
    createdAt: "May 18, 2023",
  },
]

// Add Situationship type
interface Situationship {
  id: string;
  name: string;
  cause: string;
  dates: { start: string; end: string };
  epitaph: string;
  reflection?: string;
  photo?: string;
  details: {
    meetInPerson: boolean;
    dateCount: number;
    kissed: boolean;
    hookup: boolean;
    love: boolean;
    fight: boolean;
    exclusive: boolean;
    duration: string;
    location: string;
    redFlags: string[];
    lastMessage: string;
  };
  revived: boolean;
  createdAt: string;
}

export default function GraveyardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [causeFilter, setCauseFilter] = useState("all")
  const [situationships, setSituationships] = useState<Situationship[] | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Refresh colors when component mounts or when returning from detail page
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  // Load from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let stored = localStorage.getItem('situationships')
      let localGraves: Situationship[] = stored ? JSON.parse(stored) : []
      
      // Create a map of user-modified graves for quick lookup
      const userGravesMap = new Map(localGraves.map(grave => [grave.id, grave]))
      
      // Merge example and localStorage graves by unique ID, preserving order
      const merged: Situationship[] = initialSituationships.map(exampleGrave => {
        // If user has modified this example grave, use the user version
        return userGravesMap.get(exampleGrave.id) || exampleGrave
      })
      
      // Add any additional user graves that aren't in the examples
      const additionalUserGraves = localGraves.filter(grave => 
        !initialSituationships.some(example => example.id === grave.id)
      )
      
      const finalGraves = [...merged, ...additionalUserGraves]
      console.log('Graveyard data loaded:', finalGraves.length, 'graves')
      setSituationships(finalGraves)
    }
  }, [])

  // Filter situationships based on search term and cause filter
  const filteredSituationships = situationships
    ? situationships.filter((situationship: Situationship) => {
        const matchesSearch = situationship.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCause = causeFilter === "all" || situationship.cause.toLowerCase() === causeFilter
        return matchesSearch && matchesCause
      })
    : []

  // Handle revive functionality
  const handleRevive = (id: string) => {
    setSituationships((prev) => {
      const updated = (prev ?? []).map((situationship: Situationship) =>
        situationship.id === id ? { ...situationship, revived: true } : situationship
      )
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('situationships', JSON.stringify(updated))
      }
      
      return updated
    })
  }

  // Handle bury functionality (reverse of revive)
  const handleBury = (id: string) => {
    setSituationships((prev) => {
      const updated = (prev ?? []).map((situationship: Situationship) =>
        situationship.id === id ? { ...situationship, revived: false } : situationship
      )
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('situationships', JSON.stringify(updated))
      }
      
      return updated
    })
  }

  // Handle delete functionality
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this grave? This action cannot be undone.')) {
      setSituationships((prev) => {
        const updated = (prev ?? []).filter((situationship: Situationship) => situationship.id !== id)
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('situationships', JSON.stringify(updated))
        }
        
        return updated
      })
    }
  }

  if (situationships === null) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-400 text-lg mb-2">Loading graveyard...</div>
          <div className="text-zinc-500 text-sm">Gathering your situationships</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Graveyard 🪦" centered />

      <div className="px-4 py-4 space-y-4">
        {/* Search and Filters - Always visible */}
        <div className="bg-zinc-800 p-4 rounded-lg space-y-3 outline outline-1 outline-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 text-white placeholder-zinc-500 rounded-md h-11 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {showFilters && (
            <Select value={causeFilter} onValueChange={setCauseFilter}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 h-11 text-white">
                <SelectValue placeholder="All Causes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Causes</SelectItem>
                <SelectItem value="ghosted">Ghosted</SelectItem>
                <SelectItem value="breadcrumbed">Breadcrumbed</SelectItem>
                <SelectItem value="situationship">Situationship</SelectItem>
                <SelectItem value="slow fade">Slow Fade</SelectItem>
                <SelectItem value="benched">Benched</SelectItem>
                <SelectItem value="never started">Never Started</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Results Count and Show Filters */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {filteredSituationships.length} {filteredSituationships.length === 1 ? "grave" : "graves"} found
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-zinc-400 hover:text-zinc-100 text-sm flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>

        {/* Graveyard Grid - 2 Columns */}
        <div className="grid grid-cols-2 gap-4">
          {filteredSituationships.length > 0 ? (
            filteredSituationships.map((situationship) => (
              <GraveCard
                key={`${situationship.id}-${refreshKey}`}
                situationship={situationship}
                onRevive={() => handleRevive(situationship.id)}
                onBury={() => handleBury(situationship.id)}
                onDelete={() => handleDelete(situationship.id)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-zinc-400 text-lg">No situationships found</p>
              <p className="text-zinc-500 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
