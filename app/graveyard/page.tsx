"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import LazyGraveCard from "@/components/lazy-grave-card"
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
  const [showFireflies, setShowFireflies] = useState(false)
  const [graveColors, setGraveColors] = useState<Record<string, string>>({})

  // Refresh colors when component mounts or when returning from detail page
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey((prev) => prev + 1)
    }

    const handleSituationshipUpdate = (e: any) => {
      const detail = e?.detail
      if (detail?.id) {
        // Update only the specific situationship instead of reloading everything
        setSituationships((prev) => {
          if (!prev) return prev
          const stored = localStorage.getItem('situationships')
          const allGraves: any[] = stored ? JSON.parse(stored) : []
          const updatedGrave = allGraves.find((g: any) => g.id === detail.id)
          
          if (updatedGrave) {
            return prev.map((s) => 
              s.id === detail.id 
                ? { ...s, flowers: detail.flowerCount ?? updatedGrave.flowers, revived: updatedGrave.revived ?? s.revived }
                : s
            )
          }
          return prev
        })
      }
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

      // Batch read all grave colors at once
      const colors: Record<string, string> = {}
      finalGraves.forEach((grave: any) => {
        const savedColor = localStorage.getItem(`grave-color-${grave.id}`)
        if (savedColor) {
          colors[grave.id] = savedColor
        }
      })
      setGraveColors(colors)
    }
  }, [refreshKey])

  // Listen for storage changes to update grave colors when changed in detail page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('grave-color-')) {
        const graveId = e.key.replace('grave-color-', '')
        if (e.newValue) {
          setGraveColors((prev) => ({
            ...prev,
            [graveId]: e.newValue || 'classic'
          }))
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Defer firefly animations until after initial render to improve LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireflies(true)
    }, 200) // Small delay to let content render first
    return () => clearTimeout(timer)
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
    <div
      className="min-h-screen bg-black relative overflow-x-hidden"
      style={{
        backgroundImage:
          'radial-gradient(800px 500px at 0% 0%, rgba(59,130,246,0.18), rgba(59,130,246,0.08) 35%, rgba(0,0,0,0) 70%)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
      }}
    >
      {/* Firefly Background Animation - Deferred for better LCP */}
      {showFireflies && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ contain: 'layout style paint' }}>
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: '10%',
            top: '-10vh',
            animation: 'firefly1 30s linear infinite, fireflyTwinkle 5s ease-in-out infinite',
            animationDelay: '0s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-amber-300"
          style={{
            left: '90%',
            top: '-10vh',
            animation: 'firefly2 34s linear infinite, fireflyTwinkle 4.5s ease-in-out infinite',
            animationDelay: '3.5s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            left: '50%',
            top: '-10vh',
            animation: 'firefly3 36s linear infinite, fireflyTwinkle 5.5s ease-in-out infinite',
            animationDelay: '1.5s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: '30%',
            top: '-10vh',
            animation: 'firefly4 32s linear infinite, fireflyTwinkle 4s ease-in-out infinite',
            animationDelay: '5s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-amber-400"
          style={{
            left: '70%',
            top: '-10vh',
            animation: 'firefly5 38s linear infinite, fireflyTwinkle 6s ease-in-out infinite',
            animationDelay: '2s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            left: '20%',
            top: '-10vh',
            animation: 'firefly6 31s linear infinite, fireflyTwinkle 4.8s ease-in-out infinite',
            animationDelay: '4s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: '80%',
            top: '-10vh',
            animation: 'firefly7 35s linear infinite, fireflyTwinkle 5.2s ease-in-out infinite',
            animationDelay: '6s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-amber-300"
          style={{
            left: '60%',
            top: '-10vh',
            animation: 'firefly8 37s linear infinite, fireflyTwinkle 4.2s ease-in-out infinite',
            animationDelay: '7.5s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        {/* From left entry */}
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            animation: 'fireflyFromLeft 33s linear infinite, fireflyTwinkle 5s ease-in-out infinite',
            animationDelay: '2s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        {/* From right entry diagonally left */}
        <div 
          className="absolute w-2 h-2 rounded-full bg-amber-300"
          style={{
            animation: 'fireflyFromRight 35s linear infinite, fireflyTwinkle 5.2s ease-in-out infinite',
            animationDelay: '4s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        {/* From bottom upward */}
        <div 
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            animation: 'fireflyFromBottom 33s linear infinite, fireflyTwinkle 5s ease-in-out infinite',
            animationDelay: '3s',
            willChange: 'transform, filter, opacity',
            transform: 'translateZ(0)',
            filter: 'blur(3px)',
          }}
        />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="relative z-50">
          <AppHeader title="The Graveyard 🪦" centered />
        </div>

      <div className="px-3 sm:px-4 py-4 space-y-4 relative max-w-full overflow-x-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* Crescent Moon - Top Left (behind search bar) */}
        <div className="absolute top-4 left-7 z-0 pointer-events-none" style={{ width: '100px', height: '100px' }}>
          <div className="crescent-moon"></div>
        </div>
        
        
        {/* Search and Filters - Always visible */}
        <div className="space-y-3 relative z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 z-20 pointer-events-none" />
            <div className="w-full h-11 rounded-md bg-zinc-800/70 pl-9 pr-3 flex items-center border-2 border-zinc-700 backdrop-blur-sm">
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
          <div className="text-sm relative inline-block">
            <span
              className="absolute inset-0 translate-x-[1px] translate-y-[1px] text-black select-none"
              aria-hidden="true"
            >
              {filteredSituationships.length} {filteredSituationships.length === 1 ? "grave" : "graves"} found
            </span>
            <span className="relative text-zinc-400 font-medium">
              {filteredSituationships.length} {filteredSituationships.length === 1 ? "grave" : "graves"} found
            </span>
          </div>
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
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-full" style={{ paddingBottom: '40px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {filteredSituationships.length > 0 ? (
            filteredSituationships.map((situationship) => (
              <LazyGraveCard
                key={situationship.id}
                situationship={situationship}
                initialColor={graveColors[situationship.id] || 'classic'}
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
    </div>
  )
}
