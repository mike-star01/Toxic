"use client"

import { useEffect, useState, useMemo } from "react"
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
    insights: {
      recoveryTime: null as string | null,
      patternAlert: null as string | null,
      closureImpact: null as string | null,
      loveDuration: null as string | null,
      highestImpactFlag: null as string | null,
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
          insights: {
            recoveryTime: null,
            patternAlert: null,
            closureImpact: null,
            loveDuration: null,
            highestImpactFlag: null,
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

      // Calculate insights
      // Recovery Time - average time between situationships ending and new ones starting
      const sortedByEnd = situationships
        .filter(s => s.dates.end)
        .map(s => {
          const endParts = s.dates.end.split('-')
          return { endYear: parseInt(endParts[0]), endMonth: parseInt(endParts[1]), id: s.id }
        })
        .sort((a, b) => {
          if (a.endYear !== b.endYear) return a.endYear - b.endYear
          return a.endMonth - b.endMonth
        })

      const sortedByStart = situationships
        .filter(s => s.dates.start)
        .map(s => {
          const startParts = s.dates.start.split('-')
          return { startYear: parseInt(startParts[0]), startMonth: parseInt(startParts[1]), id: s.id }
        })
        .sort((a, b) => {
          if (a.startYear !== b.startYear) return a.startYear - b.startYear
          return a.startMonth - b.startMonth
        })

      let recoveryDays: number[] = []
      for (let i = 0; i < sortedByEnd.length - 1; i++) {
        const end = sortedByEnd[i]
        const nextStart = sortedByStart.find(s => 
          s.startYear > end.endYear || (s.startYear === end.endYear && s.startMonth > end.endMonth)
        )
        if (nextStart) {
          const monthsDiff = (nextStart.startYear - end.endYear) * 12 + (nextStart.startMonth - end.endMonth)
          if (monthsDiff > 0) {
            recoveryDays.push(monthsDiff * 30.44)
          }
        }
      }

      const recoveryTime = recoveryDays.length > 0
        ? formatDuration(recoveryDays.reduce((a, b) => a + b, 0) / recoveryDays.length)
        : null

      // Pattern Alert - if one cause dominates (>50% or significantly higher)
      const patternAlert = (() => {
        if (causeBreakdown.length === 0) return null
        const topCause = causeBreakdown[0]
        const secondCause = causeBreakdown[1]
        
        if (topCause.percentage >= 50) {
          return `${topCause.cause} accounts for ${topCause.percentage}% of your endings`
        }
        if (secondCause && topCause.percentage >= secondCause.percentage * 2) {
          return `${topCause.cause} is ${Math.round(topCause.percentage / secondCause.percentage)}x more common than ${secondCause.cause}`
        }
        return null
      })()

      // Closure Impact - avg emotional impact with vs without closure
      const closureImpact = (() => {
        const withClosure = situationships
          .filter(s => s.details.closure && typeof s.details.emotionalImpact === 'number')
          .map(s => s.details.emotionalImpact)
        const withoutClosure = situationships
          .filter(s => !s.details.closure && typeof s.details.emotionalImpact === 'number')
          .map(s => s.details.emotionalImpact)
        
        if (withClosure.length === 0 || withoutClosure.length === 0) return null
        
        const avgWith = withClosure.reduce((a, b) => a + b, 0) / withClosure.length
        const avgWithout = withoutClosure.reduce((a, b) => a + b, 0) / withoutClosure.length
        const diff = avgWith - avgWithout
        
        if (Math.abs(diff) < 0.5) return null // Not significant enough
        
        if (diff < 0) {
          return `Closure reduces emotional impact by ${Math.abs(diff).toFixed(1)} points`
        } else {
          return `Closure increases emotional impact by ${diff.toFixed(1)} points`
        }
      })()

      // Love & Duration - avg duration with vs without love
      const loveDuration = (() => {
        const withLove = situationships
          .filter(s => s.details.love)
          .map(s => {
            if (s.details?.duration) return parseDurationToDays(s.details.duration)
            if (s.dates.start && s.dates.end) {
              const startParts = s.dates.start.split('-')
              const endParts = s.dates.end.split('-')
              if (startParts.length === 2 && endParts.length === 2) {
                const monthsDiff = (parseInt(endParts[0]) - parseInt(startParts[0])) * 12 + 
                                  (parseInt(endParts[1]) - parseInt(startParts[1]))
                return monthsDiff * 30.44
              }
            }
            return 0
          })
          .filter(d => d > 0)
        
        const withoutLove = situationships
          .filter(s => !s.details.love)
          .map(s => {
            if (s.details?.duration) return parseDurationToDays(s.details.duration)
            if (s.dates.start && s.dates.end) {
              const startParts = s.dates.start.split('-')
              const endParts = s.dates.end.split('-')
              if (startParts.length === 2 && endParts.length === 2) {
                const monthsDiff = (parseInt(endParts[0]) - parseInt(startParts[0])) * 12 + 
                                  (parseInt(endParts[1]) - parseInt(startParts[1]))
                return monthsDiff * 30.44
              }
            }
            return 0
          })
          .filter(d => d > 0)
        
        if (withLove.length === 0 || withoutLove.length === 0) return null
        
        const avgWith = withLove.reduce((a, b) => a + b, 0) / withLove.length
        const avgWithout = withoutLove.reduce((a, b) => a + b, 0) / withoutLove.length
        
        if (avgWith > avgWithout * 1.2) {
          return `Love situationships last ${formatDuration(avgWith)} on average (${formatDuration(avgWithout)} without)`
        } else if (avgWithout > avgWith * 1.2) {
          return `Non-love situationships last ${formatDuration(avgWithout)} on average`
        }
        return null
      })()

      // Flag with highest avg emotional impact
      const highestImpactFlag = (() => {
        const flagImpacts: Record<string, number[]> = {}
        
        situationships.forEach(s => {
          if (s.details.flags && s.details.flags.length > 0 && typeof s.details.emotionalImpact === 'number') {
            s.details.flags.forEach(flag => {
              if (!flagImpacts[flag]) flagImpacts[flag] = []
              flagImpacts[flag].push(s.details.emotionalImpact)
            })
          }
        })
        
        const flagAverages = Object.entries(flagImpacts)
          .map(([flag, impacts]) => ({
            flag,
            avg: impacts.reduce((a, b) => a + b, 0) / impacts.length,
            count: impacts.length
          }))
          .filter(f => f.count >= 2) // Only flags that appear at least twice
        
        if (flagAverages.length === 0) return null
        
        const highest = flagAverages.sort((a, b) => b.avg - a.avg)[0]
        return `${highest.flag} has the highest avg emotional impact (${highest.avg.toFixed(1)})`
      })()

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
        insights: {
          recoveryTime,
          patternAlert,
          closureImpact,
          loveDuration,
          highestImpactFlag,
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

  // Select top 3 insights based on Option 3 priority:
  // 1. Pattern Alert (if exists) - most actionable
  // 2. Recovery Time (if available) - always useful
  // 3. Most significant correlation (Closure Impact, Love & Duration, or Flag Impact)
  const getTopInsights = () => {
    const selected: Array<{ type: string; value: string; icon: any; color: string; title: string }> = []
    
    // Priority 1: Pattern Alert (if exists)
    if (stats.insights.patternAlert) {
      selected.push({
        type: 'patternAlert',
        value: stats.insights.patternAlert,
        icon: Target,
        color: 'text-orange-400',
        title: 'Pattern Alert'
      })
    }
    
    // Priority 2: Recovery Time (if available)
    if (stats.insights.recoveryTime) {
      selected.push({
        type: 'recoveryTime',
        value: stats.insights.recoveryTime,
        icon: Clock,
        color: 'text-blue-400',
        title: 'Recovery Time'
      })
    }
    
    // Priority 3: Most significant correlation
    // Rank correlations by significance (all have similar priority, pick first available)
    const correlations = [
      {
        type: 'closureImpact',
        value: stats.insights.closureImpact,
        icon: Heart,
        color: 'text-purple-400',
        title: 'Closure Impact'
      },
      {
        type: 'loveDuration',
        value: stats.insights.loveDuration,
        icon: Heart,
        color: 'text-pink-400',
        title: 'Love & Duration'
      },
      {
        type: 'highestImpactFlag',
        value: stats.insights.highestImpactFlag,
        icon: null, // Will use emoji
        color: 'text-blue-400',
        title: 'Flag Impact'
      }
    ]
    
    // Add first available correlation until we have 3 total
    for (const correlation of correlations) {
      if (selected.length >= 3) break
      if (correlation.value) {
        selected.push({
          type: correlation.type,
          value: correlation.value,
          icon: correlation.icon,
          color: correlation.color,
          title: correlation.title
        })
      }
    }
    
    return selected
  }

  return (
    <div
      className="min-h-screen bg-black relative overflow-x-hidden"
      style={{
        backgroundImage:
          'radial-gradient(800px 500px at 0% 0%, rgba(147,51,234,0.25), rgba(147,51,234,0.12) 35%, rgba(0,0,0,0) 70%)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000'
      }}
    >
      {/* Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {useMemo(() => {
          return Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8
            const isLarge = size > 1.5; // Stars larger than 1.5px get glow
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  opacity: opacity,
                  filter: isLarge ? 'blur(0.5px)' : 'blur(0.3px)',
                  boxShadow: isLarge ? '0 0 2px rgba(255,255,255,0.4), 0 0 4px rgba(255,255,255,0.2)' : 'none',
                }}
              />
            );
          });
        }, [])}
      </div>

      <AppHeader title="Your Stats" centered />

      <div className="px-4 py-4 space-y-4 relative z-10">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 8px rgba(248,113,113,0.3), 0 0 15px rgba(248,113,113,0.2), inset 0 0 10px rgba(248,113,113,0.15)',
              borderColor: 'rgba(248,113,113,0.3)'
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">
                <span 
                  style={{
                    textShadow: '0 0 6px rgba(248,113,113,0.6), 0 0 12px rgba(248,113,113,0.4)'
                  }}
                >
                  {stats.totalGraves}
                </span>
                <span role="img" aria-label="grave">🪦</span>
              </div>
              <div className="text-sm text-zinc-400">Total Graves</div>
            </CardContent>
          </Card>
          <Card 
            className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 8px rgba(251,191,36,0.3), 0 0 15px rgba(251,191,36,0.2), inset 0 0 10px rgba(251,191,36,0.15)',
              borderColor: 'rgba(251,191,36,0.3)'
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
                <span 
                  style={{
                    textShadow: '0 0 6px rgba(251,191,36,0.6), 0 0 12px rgba(251,191,36,0.4)'
                  }}
                >
                  {stats.revived}
                </span>
                <span role="img" aria-label="lightning">⚡️</span>
              </div>
              <div className="text-sm text-zinc-400">Revived</div>
            </CardContent>
          </Card>
        </div>

        {/* Duration Stats */}
        <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
        <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Emotional Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(52,211,153,0.45)',
                  boxShadow: '0 0 6px rgba(52,211,153,0.25), 0 0 12px rgba(52,211,153,0.14)'
                }}
              >
                <div className="text-lg font-bold text-green-400">{stats.emotionalStats.meetInPerson}</div>
                <div className="text-xs text-zinc-400">Met in Person</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(244,114,182,0.45)',
                  boxShadow: '0 0 6px rgba(244,114,182,0.25), 0 0 12px rgba(244,114,182,0.14)'
                }}
              >
                <div className="text-lg font-bold text-pink-400">{stats.emotionalStats.kissed}</div>
                <div className="text-xs text-zinc-400">Kissed</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(168,85,247,0.45)',
                  boxShadow: '0 0 6px rgba(168,85,247,0.25), 0 0 12px rgba(168,85,247,0.14)'
                }}
              >
                <div className="text-lg font-bold text-purple-400">{stats.emotionalStats.hookup}</div>
                <div className="text-xs text-zinc-400">Hooked Up</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(248,113,113,0.45)',
                  boxShadow: '0 0 6px rgba(248,113,113,0.25), 0 0 12px rgba(248,113,113,0.14)'
                }}
              >
                <div className="text-lg font-bold text-red-400">{stats.emotionalStats.love}</div>
                <div className="text-xs text-zinc-400">Fell in Love</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(250,204,21,0.45)',
                  boxShadow: '0 0 6px rgba(250,204,21,0.25), 0 0 12px rgba(250,204,21,0.14)'
                }}
              >
                <div className="text-lg font-bold text-yellow-400">{stats.emotionalStats.fight}</div>
                <div className="text-xs text-zinc-400">Had Fights</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(96,165,250,0.45)',
                  boxShadow: '0 0 6px rgba(96,165,250,0.25), 0 0 12px rgba(96,165,250,0.14)'
                }}
              >
                <div className="text-lg font-bold text-blue-400">{stats.emotionalStats.exclusive}</div>
                <div className="text-xs text-zinc-400">Exclusive</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(45,212,191,0.45)',
                  boxShadow: '0 0 6px rgba(45,212,191,0.25), 0 0 12px rgba(45,212,191,0.14)'
                }}
              >
                <div className="text-lg font-bold text-teal-400">{stats.emotionalStats.closure}</div>
                <div className="text-xs text-zinc-400">Got Closure</div>
              </div>
              <div className="text-center p-2 rounded border border-zinc-800/60 bg-black/80 backdrop-blur-sm"
                style={{
                  borderColor: 'rgba(251,146,60,0.45)',
                  boxShadow: '0 0 6px rgba(251,146,60,0.25), 0 0 12px rgba(251,146,60,0.14)'
                }}
              >
                <div className="text-lg font-bold text-orange-400">{stats.emotionalStats.avgEmotionalImpact}</div>
                <div className="text-xs text-zinc-400">Avg Emotional Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cause Breakdown */}
        {stats.causeBreakdown.length > 0 && (
          <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
        <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
          <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
        <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
                  <div className="rounded p-2 mb-1 border border-zinc-800/60 bg-black/80 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-400">{month.count}</div>
                  </div>
                  <div className="text-xs text-zinc-400">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* When They End */}
        <Card className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm">
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
                  <div className="rounded p-2 mb-1 border border-zinc-800/60 bg-black/80 backdrop-blur-sm">
                    <div className="text-lg font-bold text-red-400">{month.count}</div>
                  </div>
                  <div className="text-xs text-zinc-400">{month.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card 
          className="bg-zinc-900/35 border-zinc-800/50 backdrop-blur-sm relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(39, 39, 42, 0.4) 0%, rgba(24, 24, 27, 0.35) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {(() => {
              const topInsights = getTopInsights()
              if (topInsights.length === 0) {
                return (
                  <div className="text-sm text-zinc-400 text-center py-4">
                    Add more situationships to unlock insights
                  </div>
                )
              }
              return topInsights.map((insight, index) => {
                // Get glow color based on insight type
                const getGlowStyle = () => {
                  switch (insight.type) {
                    case 'patternAlert':
                      return { filter: 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6)) drop-shadow(0 0 12px rgba(251, 146, 60, 0.4))' }
                    case 'recoveryTime':
                      return { filter: 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.6)) drop-shadow(0 0 12px rgba(96, 165, 250, 0.4))' }
                    case 'closureImpact':
                      return { filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))' }
                    case 'loveDuration':
                      return { filter: 'drop-shadow(0 0 6px rgba(244, 114, 182, 0.6)) drop-shadow(0 0 12px rgba(244, 114, 182, 0.4))' }
                    case 'highestImpactFlag':
                      return { filter: 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.6)) drop-shadow(0 0 12px rgba(96, 165, 250, 0.4))', textShadow: '0 0 6px rgba(96, 165, 250, 0.6), 0 0 12px rgba(96, 165, 250, 0.4)' }
                    default:
                      return {}
                  }
                }
                
                return (
                <div key={insight.type || index} className="flex items-start gap-3">
                  {insight.icon ? (
                    <insight.icon className={`h-5 w-5 ${insight.color} mt-0.5 flex-shrink-0`} style={getGlowStyle()} />
                  ) : (
                    <span className="text-2xl mt-0.5 flex-shrink-0" style={getGlowStyle()}>🏴</span>
                  )}
                  <div>
                    <div className="font-medium">{insight.title}</div>
                    <div className="text-sm text-zinc-300">
                      {insight.type === 'recoveryTime' 
                        ? `Average ${insight.value} between situationships`
                        : insight.value
                      }
                    </div>
                  </div>
                </div>
              )})
            })()}
          </CardContent>
        </Card>

        {/* Coming Soon Section */}
        <Card
          className="backdrop-blur-sm mt-6 border border-yellow-300/40"
          style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.15) 0%, rgba(250,204,21,0.05) 100%)',
            boxShadow: '0 0 18px rgba(250,204,21,0.25), inset 0 0 12px rgba(250,204,21,0.15)',
          }}
        >
          <CardContent className="p-4">
            <div className="text-sm text-yellow-50 text-center">
              Coming soon: Gravekeeper, graveyard timeline, advanced insights, new grave colors, backgrounds, skins, and more+ ❗🤫
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}