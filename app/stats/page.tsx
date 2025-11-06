"use client"

import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Heart,
  Clock,
  Zap,
  Calendar,
  Target,
  Ghost,
  Sandwich,
  Users,
  TrendingDown,
  UserX,
  Skull,
  Flame,
  CalendarDays,
} from "lucide-react"

interface Situationship {
  id: string
  name: string
  cause: string
  dates: { start: string; end: string }
  epitaph: string
  reflection?: string
  photo?: string
  details: {
    meetInPerson: boolean
    dateCount: number
    kissed: boolean
    hookup: boolean
    love: boolean
    fight: boolean
    exclusive: boolean
    closure: boolean
    emotionalImpact: number
    duration: string
    location: string
    redFlags: string[]
    lastMessage: string
    flags?: string[]
  }
  revived: boolean
  createdAt: string
}

// Emoji mapping for causes (normalized via getCauseEmoji)
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

const getCauseEmoji = (cause: string): string => {
  const key = (cause || '').toLowerCase().trim()
  return causeEmojis[key] ?? '💀'
}

// Utility function to parse duration string and convert to days
const parseDurationToDays = (duration: string): number => {
  if (!duration) return 0
  
  let totalDays = 0
  
  // Handle compound formats like "8 years 2 months" or "2 months 3 weeks"
  const parts = duration.split(" ")
  
  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i])
    const unit = parts[i + 1]
    
    if (isNaN(value)) continue
    
    if (unit?.includes("day")) {
      totalDays += value
    } else if (unit?.includes("week")) {
      totalDays += value * 7
    } else if (unit?.includes("month")) {
      totalDays += Math.round(value * 30.44)
    } else if (unit?.includes("year")) {
      totalDays += Math.round(value * 365.25)
    }
  }
  
  // Fallback for simple formats if no compound format was found
  if (totalDays === 0) {
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
  }
  
  return totalDays
}

// Safely parse a YYYY-MM string to a month index (0-11). Returns null if invalid
const getMonthIndexFromYYYYMM = (value?: string): number | null => {
  if (!value || typeof value !== 'string') return null
  const parts = value.split('-')
  if (parts.length < 2) return null
  const month = parseInt(parts[1], 10)
  if (isNaN(month) || month < 1 || month > 12) return null
  return month - 1
}

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalGraves: 0,
    revived: 0,
    thisMonth: 0,
    thisYear: 0,
    averageDuration: "0 months",
    longestSituationship: "0 months",
    shortestSituationship: "0 months",
    mostCommonCause: "None",
    causeBreakdown: [] as Array<{ cause: string; count: number; percentage: number; icon: any; color: string }>,
    startMonths: [] as Array<{ month: string; count: number }>,
    endMonths: [] as Array<{ month: string; count: number }>,
    emotionalStats: {
      meetInPerson: 0,
      kissed: 0,
      hookup: 0,
      love: 0,
      fight: 0,
      exclusive: 0,
      closure: 0,
      avgEmotionalImpact: 0,
    },
    totalDates: 0,
    averageDates: 0,
    reflectionStats: {
      totalReflections: 0,
      reflectionRate: 0,
    },
    flagsStats: {
      totalFlags: 0,
      uniqueFlags: [] as string[],
      flagBreakdown: [] as Array<{ flag: string; count: number }>,
    },
  })

  useEffect(() => {
    calculateStats()
    
    // Refresh stats when the page comes into focus (e.g., when navigating back from other pages)
    const handleFocus = () => {
      calculateStats()
    }
    
    // Refresh stats when localStorage changes (e.g., from other tabs or components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'situationships') {
        calculateStats()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const calculateStats = () => {
    if (typeof window === 'undefined') return

    try {
      // Load situationships from localStorage
      const stored = localStorage.getItem('situationships')
      const situationships: Situationship[] = stored ? JSON.parse(stored) : []

      if (situationships.length === 0) {
        setStats({
          totalGraves: 0,
          revived: 0,
          thisMonth: 0,
          thisYear: 0,
          averageDuration: "0 months",
          longestSituationship: "0 months",
          shortestSituationship: "0 months",
          mostCommonCause: "None",
          causeBreakdown: [],
          startMonths: [],
          endMonths: [],
          emotionalStats: {
            meetInPerson: 0,
            kissed: 0,
            hookup: 0,
            love: 0,
            fight: 0,
            exclusive: 0,
            closure: 0,
            avgEmotionalImpact: 0,
          },
          totalDates: 0,
          averageDates: 0,
          reflectionStats: {
            totalReflections: 0,
            reflectionRate: 0,
          },
          flagsStats: {
            totalFlags: 0,
            uniqueFlags: [],
            flagBreakdown: [],
          },
        })
        return
      }

      // Calculate basic stats
      const totalGraves = situationships.length
      const revived = situationships.filter(s => s.revived).length
      
      // Calculate monthly and yearly stats
      const now = new Date()
      const thisMonth = situationships.filter(s => {
        if (!s.createdAt) return false
        const createdDate = new Date(s.createdAt)
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
      }).length
      
      const thisYear = situationships.filter(s => {
        if (!s.dates.end) return false
        const endDate = new Date(s.dates.end)
        return endDate.getFullYear() === now.getFullYear()
      }).length

      // Calculate durations
      const durations = situationships
        .filter(s => s.dates.start && (s.dates.end || s.details?.duration))
        .map(s => {
          // First try to use the duration string if available
          if (s.details?.duration) {
            const days = parseDurationToDays(s.details.duration)
            return days
          }
          
          // Fallback to date calculation for older entries
          if (s.dates.start && s.dates.end) {
            // Parse YYYY-MM format safely
            const startParts = s.dates.start.split('-')
            const endParts = s.dates.end.split('-')
            
            if (startParts.length === 2 && endParts.length === 2) {
              const startYear = parseInt(startParts[0])
              const startMonth = parseInt(startParts[1])
              const endYear = parseInt(endParts[0])
              const endMonth = parseInt(endParts[1])
              
              // Calculate months difference
              const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth)
              
              // Also consider the "talked for" duration (dateCount is in weeks)
              const talkedForDays = (s.details?.dateCount != null ? s.details.dateCount : 0) * 7
              
              // For same month, use the talked for duration if available, otherwise 1 month
              if (monthsDiff === 0) {
                return talkedForDays > 0 ? talkedForDays : 30.44
              }
              
              // For different months, use the actual date difference
              const diffDays = monthsDiff * 30.44
              return diffDays
            }
          }
          
          return 0
        })
        .filter(d => d > 0)

      const formatDuration = (days: number) => {
        if (days < 7) {
          return `${days} day${days !== 1 ? 's' : ''}`
        } else if (days < 30) {
          const weeks = Math.round(days / 7)
          return `${weeks} week${weeks !== 1 ? 's' : ''}`
        } else {
          // Use more precise calculation to avoid rounding issues
          const totalMonths = Math.round(days / 30.44)
          const years = Math.floor(totalMonths / 12)
          const months = totalMonths % 12
          
          if (years > 0) {
            if (months === 0) {
              return `${years} year${years !== 1 ? 's' : ''}`
            } else {
              return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`
            }
          } else {
            return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`
          }
        }
      }

      const averageDuration = durations.length > 0 
        ? formatDuration(durations.reduce((a, b) => a + b, 0) / durations.length)
        : "0 months"
      
      const longestSituationship = durations.length > 0
        ? formatDuration(Math.max(...durations))
        : "0 months"
      
      const shortestSituationship = durations.length > 0
        ? formatDuration(Math.min(...durations))
        : "0 months"

      // Calculate cause breakdown
      const causeCounts: Record<string, number> = {}
      situationships.forEach(s => {
        causeCounts[s.cause] = (causeCounts[s.cause] || 0) + 1
      })

      const mostCommonCause = Object.entries(causeCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "None"

      const causeBreakdown = Object.entries(causeCounts)
        .map(([cause, count]) => ({
          cause,
          count,
          percentage: Math.round((count / totalGraves) * 100),
          icon: getCauseIcon(cause),
          color: getCauseColor(cause),
        }))
        .sort((a, b) => b.count - a.count)

      // Calculate monthly start and end patterns (all 12 months)
      const startMonths = []
      const endMonths = []
      
      for (let i = 0; i < 12; i++) {
        const monthName = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
        
        // Count situationships that started in this month
        const startCount = situationships.filter(s => {
          const idx = getMonthIndexFromYYYYMM(s.dates.start)
          return idx === i
        }).length
        
        // Count situationships that ended in this month
        const endCount = situationships.filter(s => {
          const idx = getMonthIndexFromYYYYMM(s.dates.end)
          return idx === i
        }).length
        
        startMonths.push({ month: monthName, count: startCount })
        endMonths.push({ month: monthName, count: endCount })
      }

      // Calculate emotional stats
      const emotionalStats = {
        meetInPerson: situationships.filter(s => s.details.meetInPerson).length,
        kissed: situationships.filter(s => s.details.kissed).length,
        hookup: situationships.filter(s => s.details.hookup).length,
        love: situationships.filter(s => s.details.love).length,
        fight: situationships.filter(s => s.details.fight).length,
        exclusive: situationships.filter(s => s.details.exclusive).length,
        closure: situationships.filter(s => s.details.closure).length,
        avgEmotionalImpact: (() => {
          const impacts = situationships.map(s => s.details?.emotionalImpact).filter((n) => typeof n === 'number') as number[]
          if (impacts.length === 0) return 0
          const avg = impacts.reduce((a, b) => a + b, 0) / impacts.length
          return Math.round(avg * 10) / 10
        })(),
      }

      // Calculate date stats
      const totalDates = situationships.reduce((sum, s) => sum + (s.details.dateCount || 0), 0)
      const averageDates = totalGraves > 0 ? Math.round(totalDates / totalGraves) : 0

      // Calculate reflection stats
      const totalReflections = situationships.filter(s => s.reflection && s.reflection.trim().length > 0).length
      const reflectionRate = totalGraves > 0 ? Math.round((totalReflections / totalGraves) * 100) : 0

      // Calculate flags stats
      const allFlags: string[] = []
      situationships.forEach(s => {
        if (s.details.flags && s.details.flags.length > 0) {
          allFlags.push(...s.details.flags)
        }
      })
      
      const flagCounts: Record<string, number> = {}
      allFlags.forEach(flag => {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1
      })
      
      const flagBreakdown = Object.entries(flagCounts)
        .map(([flag, count]) => ({ flag, count }))
        .sort((a, b) => b.count - a.count)
      
      const uniqueFlags = Object.keys(flagCounts)

      setStats({
        totalGraves,
        revived,
        thisMonth,
        thisYear,
        averageDuration,
        longestSituationship,
        shortestSituationship,
        mostCommonCause,
        causeBreakdown,
        startMonths,
        endMonths,
        emotionalStats,
        totalDates,
        averageDates,
        reflectionStats: {
          totalReflections,
          reflectionRate,
        },
        flagsStats: {
          totalFlags: allFlags.length,
          uniqueFlags,
          flagBreakdown,
        },
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  const getCauseIcon = (cause: string) => {
    switch (cause.toLowerCase()) {
      case 'ghosted': return Ghost
      case 'breadcrumbed': return Sandwich
      case 'situationship': return Users
      case 'slow fade': return TrendingDown
      case 'benched': return UserX
      case 'never started': return Skull
      default: return Skull
    }
  }

  const getCauseColor = (cause: string) => {
    switch (cause.toLowerCase()) {
      case 'ghosted': return 'text-purple-400'
      case 'breadcrumbed': return 'text-orange-400'
      case 'situationship': return 'text-blue-400'
      case 'slow fade': return 'text-green-400'
      case 'benched': return 'text-pink-400'
      case 'never started': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRevivalRate = () => {
    if (stats.totalGraves === 0) return 0
    return Math.round((stats.revived / stats.totalGraves) * 100)
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Your Stats" centered />

      <div className="px-4 py-4 space-y-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                {stats.totalGraves} <span role="img" aria-label="grave">🪦</span>
              </div>
              <div className="text-sm text-zinc-400">Total Graves</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                {stats.revived} <span role="img" aria-label="lightning">⚡️</span>
              </div>
              <div className="text-sm text-zinc-400">Revived</div>
            </CardContent>
          </Card>
        </div>

        {/* Duration Stats */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Duration Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Average Duration</span>
              <span className="font-medium">{stats.averageDuration}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Longest</span>
              <span className="font-medium">{stats.longestSituationship}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Shortest</span>
              <span className="font-medium">{stats.shortestSituationship}</span>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Stats */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Emotional Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-green-400">{stats.emotionalStats.meetInPerson}</div>
                <div className="text-xs text-zinc-400">Met in Person</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-pink-400">{stats.emotionalStats.kissed}</div>
                <div className="text-xs text-zinc-400">Kissed</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-purple-400">{stats.emotionalStats.hookup}</div>
                <div className="text-xs text-zinc-400">Hooked Up</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-red-400">{stats.emotionalStats.love}</div>
                <div className="text-xs text-zinc-400">Fell in Love</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-yellow-400">{stats.emotionalStats.fight}</div>
                <div className="text-xs text-zinc-400">Had Fights</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-blue-400">{stats.emotionalStats.exclusive}</div>
                <div className="text-xs text-zinc-400">Exclusive</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-teal-400">{stats.emotionalStats.closure}</div>
                <div className="text-xs text-zinc-400">Got Closure</div>
              </div>
              <div className="text-center p-2 bg-zinc-900 rounded">
                <div className="text-lg font-bold text-orange-400">{stats.emotionalStats.avgEmotionalImpact}</div>
                <div className="text-xs text-zinc-400">Avg Emotional Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cause Breakdown */}
        {stats.causeBreakdown.length > 0 && (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Cause of Death
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.causeBreakdown.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.cause} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCauseEmoji(item.cause)}</span>
                        <span className="text-sm">{item.cause}</span>
                      </div>
                      <span className="text-sm text-zinc-400">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Reflection Stats */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">💭</span>
              Reflection Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Reflections</span>
              <span className="font-medium">{stats.reflectionStats.totalReflections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Reflection Rate</span>
              <span className="font-medium">{stats.reflectionStats.reflectionRate}%</span>
            </div>
            <div className="pt-2">
              <Progress value={stats.reflectionStats.reflectionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Flags Collected Stats */}
        {stats.flagsStats.totalFlags > 0 && (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🏴</span>
                Flags Collected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-6">
                <span className="text-sm text-zinc-400">Total Flags: <span className="text-white font-medium">{stats.flagsStats.totalFlags}</span></span>
                <span className="text-sm text-zinc-400">Unique Flags: <span className="text-white font-medium">{stats.flagsStats.uniqueFlags.length}</span></span>
              </div>
              {stats.flagsStats.flagBreakdown.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {stats.flagsStats.flagBreakdown.map((item) => (
                      <div key={item.flag} className="flex items-center gap-1 bg-blue-900/20 border border-blue-700/30 rounded-full px-3 py-1">
                        <span className="text-xl text-blue-300">{item.flag}</span>
                        <span className="text-lg text-blue-400 ml-1 font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* When You Start */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              When You Begin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {stats.startMonths.map((month) => (
                <div key={month.month} className="text-center">
                  <div className="bg-zinc-900 rounded p-2 mb-1">
                    <div className="text-lg font-bold text-green-400">{month.count}</div>
                  </div>
                  <div className="text-xs text-zinc-400">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* When They End */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              When You End
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {stats.endMonths.map((month) => (
                <div key={month.month} className="text-center">
                  <div className="bg-zinc-900 rounded p-2 mb-1">
                    <div className="text-lg font-bold text-red-400">{month.count}</div>
                  </div>
                  <div className="text-xs text-zinc-400">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-r from-zinc-800 to-zinc-700 border-zinc-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Most Common Ending</div>
                <div className="text-sm text-zinc-300">
                  {stats.mostCommonCause} is your most frequent cause of death
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Revival Rate</div>
                <div className="text-sm text-zinc-300">
                  You've revived {getRevivalRate()}% of your situationships
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">This Month</div>
                <div className="text-sm text-zinc-300">
                  You've added {stats.thisMonth} new graves to your collection
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual refresh button removed per request */}
      </div>
    </div>
  )
}