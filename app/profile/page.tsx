"use client"

import AppHeader from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Settings, Share2, Heart, Download, HelpCircle, Clock, Zap, Plus, Palette } from "lucide-react"

// Mock data for recent activity
const recentActivity = [
  { name: "Gym Rat Greg", action: "added", time: "2 hours ago" },
  { name: "Tinder Tom", action: "revived", time: "1 day ago" },
  { name: "Coffee Shop Crush", action: "added", time: "3 days ago" },
  { name: "Bumble Brad", action: "added", time: "1 week ago" },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Profile" showProfile={false} />

      <div className="px-4 py-4 space-y-4">
        {/* Profile Header */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="text-xl font-bold mb-1">Heartbreak Collector</h2>
            <p className="text-zinc-400 text-sm">Member since March 2023</p>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-zinc-700">
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">6</div>
                <div className="text-xs text-zinc-400">Graves</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">2</div>
                <div className="text-xs text-zinc-400">Revived</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-zinc-400">3.2</div>
                <div className="text-xs text-zinc-400">Avg Months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {activity.action === "revived" ? (
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-amber-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-red-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-sm text-zinc-400">
                      {activity.action === "revived" ? "Revived from the dead" : "Added to graveyard"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">{activity.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>



        {/* Settings */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start h-12">
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start h-12">
              Theme Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12"
              onClick={() => window.open('mailto:toxicos@gmail.com', '_blank')}
            >
              Contact Support
            </Button>
            <Button variant="ghost" className="w-full justify-start h-12">
              Rate the App
            </Button>
          </CardContent>
        </Card>

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
