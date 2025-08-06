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
} from "lucide-react"

// Mock data - in a real app this would come from a database
const stats = {
  totalGraves: 6,
  revived: 2,
  thisMonth: 2,
  thisYear: 6,
  averageDuration: "3.2 months",
  longestSituationship: "6 months",
  shortestSituationship: "1 day",
  mostCommonCause: "Ghosted",
  causeBreakdown: [
    { cause: "Ghosted", count: 2, percentage: 33, icon: Ghost, color: "text-purple-400" },
    { cause: "Situationship", count: 1, percentage: 17, icon: Users, color: "text-blue-400" },
    { cause: "Breadcrumbed", count: 1, percentage: 17, icon: Sandwich, color: "text-orange-400" },
    { cause: "Slow Fade", count: 1, percentage: 17, icon: TrendingDown, color: "text-green-400" },
    { cause: "Benched", count: 1, percentage: 17, icon: UserX, color: "text-pink-400" },
  ],
  monthlyTrend: [
    { month: "Jan", count: 1 },
    { month: "Feb", count: 1 },
    { month: "Mar", count: 2 },
    { month: "Apr", count: 1 },
    { month: "May", count: 1 },
  ],
}

// Emoji mapping for causes
const causeEmojis: Record<string, string> = {
  Ghosted: '👻',
  Breadcrumbed: '🍞',
  Situationship: '💔',
  'Slow Fade': '🌫️',
  Benched: '🪑',
  'Never Started': '❓',
};

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-black">
      <AppHeader title="Your Stats" centered />

      <div className="px-4 py-4 space-y-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1">{stats.totalGraves} <span role="img" aria-label="grave">🪦</span></div>
              <div className="text-sm text-zinc-400">Total Graves</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">{stats.revived} <span role="img" aria-label="lightning">⚡️</span></div>
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

        {/* Cause Breakdown */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Cause of Death
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.causeBreakdown.map((item) => {
              return (
                <div key={item.cause} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{causeEmojis[item.cause as keyof typeof causeEmojis] || '❓'}</span>
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

        {/* Monthly Activity */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
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
                  You've revived {Math.round((stats.revived / stats.totalGraves) * 100)}% of your situationships
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
      </div>
    </div>
  )
}
