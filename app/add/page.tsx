"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skull, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AppHeader from "@/components/app-header"
import { Switch } from "@/components/ui/switch"

// Emoji mapping for causes
const causeEmojis: Record<string, string> = {
  ghosted: '👻',
  breadcrumbed: '🍞',
  situationship: '💔',
  friendzoned: '🤝',
  'love bombed': '💣',
  'slow fade': '🌅',
  cheated: '💔',
  other: '💀',
}

const causeLabels: Record<string, string> = {
  ghosted: 'Ghosted',
  breadcrumbed: 'Breadcrumbed',
  situationship: 'Situationship',
  friendzoned: 'Friendzoned',
  'love bombed': 'Love Bombed',
  'slow fade': 'Slow Fade',
  cheated: 'Cheated',
  other: 'Other',
}

const causeOptions = [
  'ghosted',
  'breadcrumbed',
  'situationship',
  'friendzoned',
  'love bombed',
  'slow fade',
  'cheated',
  'other',
]

export default function AddSituationshipPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    cause: "",
    startDate: "",
    endDate: "",
    epitaph: "",
    meetInPerson: false,
    dateCount: "0",
    kissed: false,
    hookup: false,
    love: false,
    fight: false,
    exclusive: false,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.cause) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and cause of death.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (formData.epitaph.length > 85) {
      toast({
        title: "Epitaph too long",
        description: "Please keep your epitaph under 85 characters for the best display.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Build new grave object
    const newGrave = {
      id: Date.now().toString(),
      name: formData.name,
      cause: causeLabels[formData.cause] || formData.cause,
      dates: {
        start: formData.startDate,
        end: formData.endDate,
      },
      epitaph: formData.epitaph,
      details: {
        meetInPerson: formData.meetInPerson,
        dateCount: Number(formData.dateCount),
        kissed: formData.kissed,
        hookup: formData.hookup,
        love: formData.love,
        fight: formData.fight,
        exclusive: formData.exclusive,
        duration: '',
        location: '',
        redFlags: [],
        lastMessage: '',
      },
      revived: false,
    }

    // Save to localStorage
    let graves = []
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      graves = stored ? JSON.parse(stored) : []
      graves.push(newGrave)
      localStorage.setItem('situationships', JSON.stringify(graves))
    }

    setTimeout(() => {
      toast({
        title: "Added to graveyard",
        description: `${formData.name} has been laid to rest.`,
      })
      setIsSubmitting(false)
      router.push("/graveyard")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title="Add to Graveyard" showBack centered />

      <div className="px-4 py-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">New Situationship</CardTitle>
            <CardDescription>Fill out the details about your almost-relationship.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name or Nickname
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g., Gym Rat Greg, Tinder Tom"
                    className="bg-zinc-900 border-zinc-700 h-11"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* Cause of Death - emoji grid */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cause of Death:</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {causeOptions.map((cause) => (
                      <button
                        type="button"
                        key={cause}
                        className={`flex flex-col items-center justify-center rounded-lg p-3 h-20 transition-all
                          ${formData.cause === cause
                            ? 'bg-red-600 text-white border-transparent shadow-md scale-105'
                            : 'bg-zinc-700 text-zinc-200 border border-zinc-600 hover:bg-zinc-600'}
                        `}
                        onClick={() => handleChange('cause', cause)}
                      >
                        <span className="text-3xl mb-1">{causeEmojis[cause]}</span>
                        <span className="text-sm font-semibold">{causeLabels[cause]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium">
                      Started
                    </label>
                    <Input
                      id="start-date"
                      type="month"
                      className="bg-zinc-900 border-zinc-700 h-11"
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="end-date" className="text-sm font-medium">
                      Ended
                    </label>
                    <Input
                      id="end-date"
                      type="month"
                      className="bg-zinc-900 border-zinc-700 h-11"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="epitaph" className="text-sm font-medium">
                    Epitaph <span className="text-zinc-400">({formData.epitaph.length}/85 characters)</span>
                  </label>
                  <Textarea
                    id="epitaph"
                    placeholder="Here lies the person who..."
                    className="bg-zinc-900 border-zinc-700 min-h-[80px] resize-none"
                    value={formData.epitaph}
                    onChange={(e) => handleChange("epitaph", e.target.value)}
                    maxLength={85}
                  />
                  {formData.epitaph.length > 75 && (
                    <p className="text-amber-400 text-xs">{85 - formData.epitaph.length} characters remaining</p>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo (Optional)</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center bg-zinc-900">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                    <Skull className="h-6 w-6 text-zinc-600" />
                  </div>
                  <Button type="button" variant="outline" size="sm" className="border-zinc-700 bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Emotional Logging */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-base font-bold">Emotional Autopsy</h3>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Did you meet in person?</span>
                    <Switch
                      checked={formData.meetInPerson}
                      onCheckedChange={(checked) => handleChange("meetInPerson", checked)}
                      id="meetInPerson"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Kissed?</span>
                    <Switch
                      checked={formData.kissed}
                      onCheckedChange={(checked) => handleChange("kissed", checked)}
                      id="kissed"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Hooked up?</span>
                    <Switch
                      checked={formData.hookup}
                      onCheckedChange={(checked) => handleChange("hookup", checked)}
                      id="hookup"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Fell in love?</span>
                    <Switch
                      checked={formData.love}
                      onCheckedChange={(checked) => handleChange("love", checked)}
                      id="love"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Had fights?</span>
                    <Switch
                      checked={formData.fight}
                      onCheckedChange={(checked) => handleChange("fight", checked)}
                      id="fight"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Were exclusive?</span>
                    <Switch
                      checked={formData.exclusive}
                      onCheckedChange={(checked) => handleChange("exclusive", checked)}
                      id="exclusive"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Talked for (weeks):</span>
                    <Input
                      id="dateCount"
                      type="number"
                      min="0"
                      className="bg-zinc-800 border-zinc-700 h-10 w-20 text-right appearance-none focus:outline-none focus:ring-2 focus:ring-red-700 hide-number-spin"
                      value={formData.dateCount}
                      onChange={(e) => handleChange("dateCount", e.target.value)}
                      placeholder="0"
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-900 h-12"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding to Graveyard..." : "Add to Graveyard"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
