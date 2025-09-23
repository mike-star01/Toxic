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
    duration: string
    location: string
    redFlags: string[]
    lastMessage: string
  }
  revived: boolean
  createdAt: string
}

// Emoji mapping for causes
const causeEmojis: Record<string, string> = {
  'Ghosted': '👻',
  'Breadcrumbed': '🍞',
  'Situationship': '🥀',
  'Friendzoned': '🤝',
  'Love Bombed': '💣',
  'Slow Fade': '🌅',
  'Cheated': '💔',
  'Other': '💀',
  'Benched': '🪑',
  'Never Started': '❓',
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
    monthlyTrend: [] as Array<{ month: string; count: number }>,
    emotionalStats: {
      meetInPerson: 0,
      kissed: 0,
      hookup: 0,
      love: 0,
      fight: 0,
      exclusive: 0,
    },
    totalDates: 0,
    averageDates: 0,
    reflectionStats: {
      totalReflections: 0,
      reflectionRate: 0,
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
          monthlyTrend: [],
          emotionalStats: {
            meetInPerson: 0,
            kissed: 0,
            hookup: 0,
            love: 0,
            fight: 0,
            exclusive: 0,
          },
          totalDates: 0,
          averageDates: 0,
          reflectionStats: {
            totalReflections: 0,
            reflectionRate: 0,
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
        if (!s.dates.end) return false
        const endDate = new Date(s.dates.end)
        return endDate.getMonth() === now.getMonth() && endDate.getFullYear() === now.getFullYear()
      }).length
      
      const thisYear = situationships.filter(s => {
        if (!s.dates.end) return false
        const endDate = new Date(s.dates.end)
        return endDate.getFullYear() === now.getFullYear()
      }).length

      // Calculate durations
      const durations = situationships
        .filter(s => s.dates.start && s.dates.end)
        .map(s => {
          const start = new Date(s.dates.start)
          const end = new Date(s.dates.end)
          const diffTime = Math.abs(end.getTime() - start.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays
        })
        .filter(d => d > 0)

      const formatDuration = (days: number) => {
        const months = days / 30.44
        if (months < 1) {
          const weeks = Math.round(days / 7)
          return `${weeks} week${weeks !== 1 ? 's' : ''}`
        } else if (months >= 12) {
          const years = Math.round(months / 12)
          return `${years} year${years !== 1 ? 's' : ''}`
        } else {
          const roundedMonths = Math.round(months)
          return `${roundedMonths} month${roundedMonths !== 1 ? 's' : ''}`
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

      // Calculate monthly trend (last 6 months)
      const monthlyTrend = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })
        const monthCount = situationships.filter(s => {
          if (!s.dates.end) return false
          const endDate = new Date(s.dates.end)
          return endDate.getMonth() === date.getMonth() && endDate.getFullYear() === date.getFullYear()
        }).length
        monthlyTrend.push({ month: monthName, count: monthCount })
      }

      // Calculate emotional stats
      const emotionalStats = {
        meetInPerson: situationships.filter(s => s.details.meetInPerson).length,
        kissed: situationships.filter(s => s.details.kissed).length,
        hookup: situationships.filter(s => s.details.hookup).length,
        love: situationships.filter(s => s.details.love).length,
        fight: situationships.filter(s => s.details.fight).length,
        exclusive: situationships.filter(s => s.details.exclusive).length,
      }

      // Calculate date stats
      const totalDates = situationships.reduce((sum, s) => sum + (s.details.dateCount || 0), 0)
      const averageDates = totalGraves > 0 ? Math.round(totalDates / totalGraves) : 0

      // Calculate reflection stats
      const totalReflections = situationships.filter(s => s.reflection && s.reflection.trim().length > 0).length
      const reflectionRate = totalGraves > 0 ? Math.round((totalReflections / totalGraves) * 100) : 0

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
        monthlyTrend,
        emotionalStats,
        totalDates,
        averageDates,
        reflectionStats: {
          totalReflections,
          reflectionRate,
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

        {/* Date Stats */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Date Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total Dates</span>
              <span className="font-medium">{stats.totalDates}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Average Dates per Grave</span>
              <span className="font-medium">{stats.averageDates}</span>
            </div>
          </CardContent>
        </Card>

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
                        <span className="text-2xl">{causeEmojis[item.cause] || '❓'}</span>
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

        {/* Monthly Activity */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {stats.monthlyTrend.map((month) => (
                <div key={month.month} className="text-center">
                  <div className="bg-zinc-900 rounded p-2 mb-1">
                    <div className="text-lg font-bold text-yellow-400">{month.count}</div>
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
