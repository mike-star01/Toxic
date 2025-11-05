"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import GraveCard from "@/components/grave-card"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"


// Add Situationship type
interface Situationship {
  id: string;
  name: string;
  cause: string;
  dates: { start: string; end: string };
  epitaph: string;
  reflection?: string;
  photo?: string;
  flowers?: number;
  details: {
    meetInPerson: boolean;
    dateCount: number;
    kissed: boolean;
    hookup: boolean;
    exclusive: boolean;
    closure: boolean;
    emotionalImpact: number;
    duration: string;
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

    const handleSituationshipUpdate = () => {
      setRefreshKey((prev) => prev + 1)
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("situationshipUpdated", handleSituationshipUpdate)
    
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("situationshipUpdated", handleSituationshipUpdate)
    }
  }, [])

  // Load graves from localStorage only (no bundled examples)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      let finalGraves: any[] = stored ? JSON.parse(stored) : []

      // Ensure each grave has an order and sort by it
      let changed = false
      finalGraves = finalGraves.map((g: any, i: number) => {
        if (typeof g.order !== 'number') {
          changed = true
          return { ...g, order: i }
        }
        return g
      })
      if (changed) {
        localStorage.setItem('situationships', JSON.stringify(finalGraves))
      }
      finalGraves = [...finalGraves].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      setSituationships(finalGraves as any)
    }
  }, [refreshKey])

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
      <AppHeader title="The Graveyard 🪦" centered />

      <div className="px-4 py-4 space-y-4">
        {/* Search and Filters - Always visible */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            <div className="w-full h-11 rounded-md bg-zinc-800 pl-9 pr-3 flex items-center border-2 border-zinc-700">
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full bg-transparent border-0 outline-none ring-0 shadow-none text-white placeholder-zinc-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                <SelectItem value="fumbled">Fumbled</SelectItem>
                <SelectItem value="friendzoned">Friendzoned</SelectItem>
                <SelectItem value="incompatible">Incompatible</SelectItem>
                <SelectItem value="slow fade">Slow Fade</SelectItem>
                <SelectItem value="cheated">Cheated</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Results Count and Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {filteredSituationships.length} {filteredSituationships.length === 1 ? "grave" : "graves"} found
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-zinc-400 hover:text-zinc-100 text-sm flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>
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
