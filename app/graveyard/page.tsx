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
    details: {
      meetInPerson: true,
      dateCount: 3,
      kissed: true,
      hookup: false,
      exclusive: false,
      duration: "2 months",
    },
    revived: false,
  },
  {
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
    },
    revived: true,
  },
  {
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
    },
    revived: false,
  },
  {
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
    },
    revived: false,
  },
  {
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
    },
    revived: false,
  },
  {
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
    },
    revived: true,
  },
]

// Add Situationship type
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
  };
  revived: boolean;
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
      
      setSituationships([...merged, ...additionalUserGraves])
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
    setSituationships((prev) =>
      (prev ?? []).map((situationship: Situationship) =>
        situationship.id === id ? { ...situationship, revived: true } : situationship
      )
    )
  }

  if (situationships === null) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black">
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
