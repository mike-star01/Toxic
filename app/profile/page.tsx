"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Share2, Heart, Download, HelpCircle, Clock, Zap, Plus, Palette } from "lucide-react"

interface Situationship {
  id: string
  name: string
  cause: string
  dates: {
    start: string
    end: string
  }
  epitaph: string
  reflection?: string
  photo?: string
  details: {
    closure: boolean
    emotionalImpact: number
    redFlags: string[]
    meetInPerson: boolean
    dateCount: number
    kissed: boolean
    hookup: boolean
    love: boolean
    fight: boolean
    exclusive: boolean
    duration: string
    location: string
    lastMessage: string
  }
  revived: boolean
  createdAt: string
}

// Helper: parse a human-readable duration string into days
function parseDurationToDays(duration: string): number {
  if (!duration) return 0
  if (duration.includes("day")) {
    const days = parseInt(duration.split(" ")[0])
    return days
  } else if (duration.includes("week")) {
    const weeks = parseInt(duration.split(" ")[0])
    return weeks * 7
  } else if (duration.includes("month")) {
    const months = parseInt(duration.split(" ")[0])
    return Math.round(months * 30.44)
  } else if (duration.includes("year")) {
    const years = parseInt(duration.split(" ")[0])
    return Math.round(years * 365.25)
  } else if (duration === "3+ years") {
    return Math.round(3 * 365.25)
  }
  return 0
}

export default function ProfilePage() {
  const [stats, setStats] = useState({
    totalGraves: 0,
    revived: 0,
    avgMonths: 0,
    earliestStartDate: null as string | null
  })

  useEffect(() => {
    const calculateStats = () => {
      const saved = localStorage.getItem('situationships')
      if (!saved) return

      const situationships: Situationship[] = JSON.parse(saved)
      
      const totalGraves = situationships.length
      
      // Count revived (where revived is true)
      const revived = situationships.filter(s => s.revived).length
      
      // Calculate average months using same logic as stats page
      const durations = situationships
        .filter(s => s.dates.start && (s.dates.end || s.details?.duration))
        .map(s => {
          // First try to use the duration string if available
          if (s.details?.duration) {
            return parseDurationToDays(s.details.duration)
          }
          
          // Fallback to date calculation
          if (s.dates.start && s.dates.end) {
            const start = new Date(s.dates.start + "-01")
            const end = new Date(s.dates.end + "-01")
            const diffTime = Math.abs(end.getTime() - start.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            
            // Also consider the "talked for" duration (dateCount is in weeks)
            const talkedForDays = (s.details?.dateCount || 0) * 7
            
            // Use the maximum of date difference or talked for duration
            return Math.max(diffDays, talkedForDays)
          }
          
          return 0
        })
        .filter(d => d > 0)

      const avgMonthsRaw = durations.length > 0 
        ? (durations.reduce((a, b) => a + b, 0) / durations.length) / 30.44 // Convert days to months
        : 0
      const avgMonths = Math.round(avgMonthsRaw * 10) / 10
      
      // Find earliest start date
      const startDates = situationships
        .filter(s => s.dates.start)
        .map(s => s.dates.start)
        .sort()
      
      const earliestStartDate = startDates.length > 0 ? startDates[0] : null
      
      setStats({
        totalGraves,
        revived,
        avgMonths: Number.isFinite(avgMonths) ? avgMonths : 0,
        earliestStartDate
      })
    }

    calculateStats()
    
    // Listen for storage changes to update stats when graves are added/edited
    const handleStorageChange = () => calculateStats()
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-x-hidden">
      <AppHeader title="Profile" showProfile={false} />

      <div className="px-4 py-4 space-y-4">
        {/* Profile Header */}
        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-black/70 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💔</span>
            </div>
            <h2 className="text-xl font-bold mb-1">Heartbreak Collector</h2>
            <p className="text-zinc-400 text-sm">
              {stats.earliestStartDate 
                ? (() => {
                    const [year, month] = stats.earliestStartDate.split('-')
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    return `since ${monthNames[parseInt(month) - 1]} ${year}`
                  })()
                : 'No graves yet'}
            </p>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-zinc-800/60">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{stats.totalGraves}</div>
                <div className="text-xs text-zinc-400">Graves</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">{stats.revived}</div>
                <div className="text-xs text-zinc-400">Revived</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-zinc-400">{stats.avgMonths}</div>
                <div className="text-xs text-zinc-400">Avg Months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity removed per request */}



        {/* Settings */}
        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 active:bg-zinc-800/70 text-base"
              onClick={() => alert('Coming soon 🦦')}
            >
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-12 active:bg-zinc-800/70 text-base"
              onClick={() => alert('Coming soon 🦦')}
            >
              Theme Preferences
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-12 active:bg-zinc-800/70 text-base"
              onClick={() => { window.location.href = '/profile/reorder' }}
            >
              Reorder Graves
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-base"
              onClick={() => window.open('mailto:toxicos@gmail.com', '_blank')}
            >
              Contact Support
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 active:bg-zinc-800/70 text-base"
              asChild
            >
              <Link href="/privacy">
                Privacy Policy
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 active:bg-zinc-800/70 text-base"
              onClick={() => alert('Coming soon 🦦')}
            >
              Rate the App
            </Button>
          </CardContent>
        </Card>

      {/* Danger zone */}
      <div className="px-4 pb-2">
        <Button
          className="w-full bg-red-800 hover:bg-red-900 h-11 text-white"
          onClick={() => {
            if (confirm('Delete ALL local data? This cannot be undone.')) {
              try {
                // Clear all app data in localStorage
                localStorage.clear()
              } catch (e) {}
              alert('All data deleted')
              window.location.reload()
            }
          }}
        >
          Delete All Data
        </Button>
      </div>

      {/* App Info */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-zinc-500 mb-2">
          <Heart className="h-4 w-4" />
          <span className="text-sm">Situationship Graveyard</span>
        </div>
        <p className="text-xs text-zinc-600">Version 1.0.0</p>
      </div>
      </div>
    </div>
  )
}
