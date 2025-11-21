"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, ArrowLeft } from "lucide-react"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    exclusive: boolean;
    closure: boolean;
    emotionalImpact: number;
    duration: string;
  };
  revived: boolean;
  createdAt: string;
}

// Helper function to parse date strings - handles both "YYYY-MM" and "Month YYYY" formats
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date()
  
  try {
    // Handle "YYYY-MM" format (from localStorage)
    if (dateStr.includes('-')) {
      const [year, month] = dateStr.split('-')
      return new Date(parseInt(year), parseInt(month) - 1, 1)
    }
    
    // Handle "Month YYYY" format
    const months: { [key: string]: number } = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    }
    
    const parts = dateStr.toLowerCase().split(' ')
    const month = months[parts[0]]
    const year = parseInt(parts[1])
    
    return new Date(year, month, 1)
  } catch (error) {
    console.error('Error parsing date:', dateStr, error)
    return new Date()
  }
}

// Helper function to format date back to string
const formatDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

// Color themes for graves - same as grave-card.tsx
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

// Helper function to get cause emoji
const getCauseEmoji = (cause: string): string => {
  const causeEmojis: Record<string, string> = {
    'ghosted': '👻',
    'breadcrumbed': '🍞',
    'bread crumbed': '🍞',
    'fumbled': '🏀',
    'friendzoned': '🤝',
    'friend-zoned': '🤝',
    'incompatible': '🧩',
    'slow fade': '🌅',
    'slow-fade': '🌅',
    'cheated': '💔',
    'situationship': '👥',
    'benched': '🪑',
    'other': '💀',
    'never started': '❌',
    'never-started': '❌',
  }
  
  const key = (cause || '').toLowerCase().trim()
  return causeEmojis[key] ?? '💀'
}

// Helper function to get grave color
const getGraveColor = (situationshipId: string): { baseColor: string; borderColor: string } => {
  if (typeof window !== 'undefined') {
    const savedColor = localStorage.getItem(`grave-color-${situationshipId}`)
    if (savedColor && colorThemes[savedColor]) {
      return colorThemes[savedColor]
    }
  }
  return colorThemes.classic
}

export default function TimelinePage() {
  const [situationships, setSituationships] = useState<Situationship[] | null>(null)
  const [timelineData, setTimelineData] = useState<Array<{
    situationship: Situationship;
    startDate: Date;
    endDate: Date;
    duration: number;
    lane: number;
  }> | null>(null)

  // Load situationships from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      const loadedSituationships = stored ? JSON.parse(stored) : []
      setSituationships(loadedSituationships)
    }
  }, [])

  // Process timeline data when situationships change
  useEffect(() => {
    if (!situationships || situationships.length === 0) {
      setTimelineData([])
      return
    }

    // Parse dates and sort by start date
    const parsedSituationships = situationships
      .map(s => ({
        situationship: s,
        startDate: parseDate(s.dates.start),
        endDate: parseDate(s.dates.end),
        duration: parseDate(s.dates.end).getTime() - parseDate(s.dates.start).getTime(),
        lane: 0 // Will be assigned later
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    // Assign lanes to handle overlaps
    const lanes: Array<Array<typeof parsedSituationships[0]>> = []
    
    parsedSituationships.forEach(item => {
      // Find the first lane where this item doesn't overlap with existing items
      let assignedLane = 0
      while (assignedLane < lanes.length) {
        const laneItems = lanes[assignedLane]
        const hasOverlap = laneItems.some(existingItem => 
          item.startDate < existingItem.endDate && item.endDate > existingItem.startDate
        )
        if (!hasOverlap) break
        assignedLane++
      }
      
      // Create new lane if needed
      if (assignedLane >= lanes.length) {
        lanes.push([])
      }
      
      lanes[assignedLane].push(item)
      item.lane = assignedLane
    })

    setTimelineData(parsedSituationships)
  }, [situationships])

  if (situationships === null) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-400 text-lg mb-2">Loading timeline...</div>
          <div className="text-zinc-500 text-sm">Organizing your relationship history</div>
        </div>
      </div>
    )
  }

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <AppHeader title="Timeline" centered />
        <div className="px-4 py-8">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">No Timeline Yet</h3>
              <p className="text-zinc-400 mb-4">
                Add some situationships to see your relationship timeline!
              </p>
              <Button 
                onClick={() => window.location.href = '/graveyard'}
                className="bg-red-800 hover:bg-red-900 text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Graveyard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate timeline bounds
  const allDates = timelineData.flatMap(item => [item.startDate, item.endDate])
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
  
  // Add some padding
  minDate.setMonth(minDate.getMonth() - 2)
  maxDate.setMonth(maxDate.getMonth() + 2)
  
  const totalDuration = maxDate.getTime() - minDate.getTime()
  const maxLanes = Math.max(...timelineData.map(item => item.lane)) + 1

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Timeline" centered />
      
      <div className="px-4 py-4">
        {/* Timeline Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Relationship Timeline
            </h2>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/graveyard'}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          
          <div className="text-sm text-zinc-400">
            {timelineData.length} relationships • {formatDate(minDate)} to {formatDate(maxDate)}
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative bg-zinc-800 rounded-lg p-6 overflow-x-auto">
          <div 
            className="relative"
            style={{ 
              minWidth: '800px',
              height: `${Math.max(200, maxLanes * 80 + 60)}px`
            }}
          >
            {/* Timeline items */}
            {timelineData.map((item, index) => {
              const startPosition = ((item.startDate.getTime() - minDate.getTime()) / totalDuration) * 100
              const width = ((item.endDate.getTime() - item.startDate.getTime()) / totalDuration) * 100
              const topPosition = item.lane * 80 + 20
              const graveColor = getGraveColor(item.situationship.id)
              
              return (
                <div
                  key={item.situationship.id}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${startPosition}%`,
                    width: `${Math.max(width, 2)}%`,
                    top: `${topPosition}px`,
                    height: '60px'
                  }}
                >
                  <div 
                    className="rounded-lg p-3 h-full border transition-all duration-200 hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: graveColor.baseColor,
                      borderColor: graveColor.borderColor,
                    }}
                    onClick={() => window.location.href = `/situationship?id=${item.situationship.id}`}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">{getCauseEmoji(item.situationship.cause)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white truncate">
                            {item.situationship.name}
                          </div>
                          <div className="text-xs text-white/80 truncate">
                            {formatDate(item.startDate)} - {formatDate(item.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-white/70 ml-2">
                        {item.situationship.cause}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Timeline axis */}
            <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-zinc-600">
              {/* Generate month markers */}
              {(() => {
                const markers = []
                const current = new Date(minDate)
                while (current <= maxDate) {
                  const position = ((current.getTime() - minDate.getTime()) / totalDuration) * 100
                  const monthName = current.toLocaleDateString('en-US', { month: 'short' })
                  const year = current.getFullYear()
                  
                  markers.push(
                    <div
                      key={current.getTime()}
                      className="absolute top-0 h-full flex flex-col items-center"
                      style={{ left: `${position}%` }}
                    >
                      <div className="w-px h-4 bg-zinc-600"></div>
                      <div className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
                        {monthName} {year}
                      </div>
                    </div>
                  )
                  
                  current.setMonth(current.getMonth() + 1)
                }
                return markers
              })()}
            </div>
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="mt-6">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-300">Timeline Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span>👻</span>
                  <span className="text-zinc-400">Ghosted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🍞</span>
                  <span className="text-zinc-400">Breadcrumbed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏀</span>
                  <span className="text-zinc-400">Fumbled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🤝</span>
                  <span className="text-zinc-400">Friendzoned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🧩</span>
                  <span className="text-zinc-400">Incompatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span className="text-zinc-400">Slow Fade</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💔</span>
                  <span className="text-zinc-400">Cheated</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="text-zinc-400">Situationship</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🪑</span>
                  <span className="text-zinc-400">Benched</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span className="text-zinc-400">Never Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💀</span>
                  <span className="text-zinc-400">Other</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overlapping Relationships Info */}
        {maxLanes > 1 && (
          <div className="mt-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-400 text-lg">⚠️</div>
                  <div>
                    <div className="font-medium text-zinc-200 text-sm mb-1">
                      Overlapping Relationships Detected
                    </div>
                    <div className="text-xs text-zinc-400">
                      Some relationships overlapped in time and are shown on different lanes. 
                      This helps visualize when you were seeing multiple people simultaneously.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
