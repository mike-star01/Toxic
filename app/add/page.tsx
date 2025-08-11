"use client"

import React, { useState } from "react"
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
  const [photo, setPhoto] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("classic")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Color themes for graves
  const colorThemes = [
    { name: "Classic Grey", value: "classic", baseColor: "#27272a", borderColor: "#52525b" },
    { name: "Rose Wine", value: "rose", baseColor: "#7f1d1d", borderColor: "#b91c1c" },
    { name: "Ocean Depths", value: "ocean", baseColor: "#1e3a8a", borderColor: "#1d4ed8" },
    { name: "Forest Night", value: "forest", baseColor: "#14532d", borderColor: "#15803d" },
    { name: "Sunset Glow", value: "sunset", baseColor: "#7c2d12", borderColor: "#c2410c" },
    { name: "Royal Purple", value: "purple", baseColor: "#581c87", borderColor: "#7c3aed" },
    { name: "Pink Blossom", value: "pink", baseColor: "#db2777", borderColor: "#be185d" },
    { name: "Midnight Black", value: "black", baseColor: "#18181b", borderColor: "#27272a" },
  ]

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

    if (formData.epitaph.length > 100) {
      toast({
        title: "Epitaph too long",
        description: "Please keep your epitaph under 100 characters for the best display.",
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
      photo: photo, // Add photo to the grave object
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

    // Save color theme to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`grave-color-${newGrave.id}`, selectedColor)
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
                    Epitaph <span className="text-zinc-400">({formData.epitaph.length}/100 characters)</span>
                  </label>
                  <Textarea
                    id="epitaph"
                    placeholder="Here lies the person who..."
                    className="bg-zinc-900 border-zinc-700 min-h-[80px] resize-none"
                    value={formData.epitaph}
                    onChange={(e) => handleChange("epitaph", e.target.value)}
                    maxLength={100}
                  />
                  {formData.epitaph.length > 90 && (
                    <p className="text-amber-400 text-xs">{100 - formData.epitaph.length} characters remaining</p>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo (Optional)</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center bg-zinc-900">
                  {/* Image preview */}
                  {photo ? (
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-full mb-2 border border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                      <Skull className="h-6 w-6 text-zinc-600" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => {
                          const img = new Image()
                          img.onload = () => {
                            const canvas = document.createElement('canvas')
                            const ctx = canvas.getContext('2d')
                            const size = Math.min(img.width, img.height)
                            
                            canvas.width = size
                            canvas.height = size
                            
                            if (ctx) {
                              // Create circular clipping path
                              ctx.beginPath()
                              ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
                              ctx.closePath()
                              ctx.clip()
                              
                              // Calculate crop position to center the image
                              const offsetX = (img.width - size) / 2
                              const offsetY = (img.height - size) / 2
                              
                              // Draw the cropped image
                              ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)
                              
                              setPhoto(canvas.toDataURL('image/jpeg', 0.8))
                            }
                          }
                          img.src = ev.target?.result as string
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Grave Color Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Grave Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setSelectedColor(theme.value)}
                      className={`w-full h-8 rounded border-2 transition-all ${
                        selectedColor === theme.value ? "border-white scale-105" : "border-zinc-600 hover:border-zinc-400"
                      }`}
                      style={{
                                              background: theme.value === "classic"
                        ? `linear-gradient(135deg, ${theme.baseColor} 0%, rgba(82, 82, 91, 0.9) 40%, rgba(39, 39, 42, 1) 100%), 
                           url('data:image/svg+xml;utf8,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" fill="${theme.baseColor.replace('#', '%23')}"/><ellipse cx="4" cy="6" rx="2" ry="1" fill="rgba(255,255,255,0.15)" transform="rotate(25 4 6)"/><ellipse cx="14" cy="4" rx="2" ry="1" fill="rgba(0,0,0,0.2)" transform="rotate(-15 14 4)"/><ellipse cx="17" cy="13" rx="2.5" ry="2" fill="rgba(255,255,255,0.1)" transform="rotate(40 17 13)"/><ellipse cx="7" cy="16" rx="1.5" ry="1" fill="rgba(0,0,0,0.25)" transform="rotate(-30 7 16)"/><ellipse cx="2" cy="17" rx="2" ry="1.5" fill="rgba(255,255,255,0.12)" transform="rotate(60 2 17)"/><ellipse cx="16" cy="17" rx="2" ry="1" fill="rgba(0,0,0,0.18)" transform="rotate(-45 16 17)"/><circle cx="6" cy="10" r="0.7" fill="rgba(255,255,255,0.2)"/><circle cx="13" cy="7" r="0.5" fill="rgba(0,0,0,0.3)"/><circle cx="19" cy="9" r="0.6" fill="rgba(255,255,255,0.18)"/><circle cx="10" cy="19" r="0.4" fill="rgba(0,0,0,0.25)"/><circle cx="15" cy="14" r="0.7" fill="rgba(255,255,255,0.15)"/><circle cx="4" cy="13" r="0.3" fill="rgba(0,0,0,0.2)"/></svg>') repeat`
                          : theme.value === "pink"
                          ? `linear-gradient(to bottom right, #db2777, rgba(255,255,255,0.65)), url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="0.9" fill="white" opacity="0.85"/><circle cx="32" cy="12" r="0.7" fill="white" opacity="0.7"/><circle cx="20" cy="28" r="0.8" fill="white" opacity="0.8"/><circle cx="28" cy="36" r="0.6" fill="white" opacity="0.7"/><circle cx="12" cy="20" r="0.7" fill="white" opacity="0.8"/><circle cx="24" cy="8" r="0.5" fill="deepskyblue" opacity="0.5"/><circle cx="36" cy="32" r="0.6" fill="deepskyblue" opacity="0.4"/><circle cx="8" cy="32" r="0.5" fill="white" opacity="0.7"/><circle cx="16" cy="36" r="0.4" fill="deepskyblue" opacity="0.5"/></svg>')`
                          : theme.value === "black"
                          ? `radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(0, 0, 0, 1) 100%), radial-gradient(ellipse at 70% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 40%), url('data:image/svg+xml;utf8,<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="%23000000"/><circle cx="10" cy="8" r="0.8" fill="white" opacity="0.9"/><circle cx="38" cy="12" r="1.0" fill="%23bfdbfe" opacity="0.8"/><circle cx="15" cy="22" r="0.6" fill="white" opacity="0.7"/><circle cx="32" cy="28" r="0.7" fill="%23e0f2fe" opacity="0.85"/><circle cx="6" cy="35" r="0.4" fill="white" opacity="0.6"/><circle cx="42" cy="38" r="0.8" fill="white" opacity="0.9"/><circle cx="20" cy="42" r="0.5" fill="%23dbeafe" opacity="0.75"/><circle cx="28" cy="10" r="0.3" fill="white" opacity="0.5"/><circle cx="12" cy="48" r="0.6" fill="white" opacity="0.8"/><circle cx="45" cy="22" r="0.25" fill="%23bfdbfe" opacity="0.6"/><circle cx="22" cy="16" r="0.2" fill="white" opacity="0.4"/><circle cx="35" cy="45" r="0.4" fill="white" opacity="0.7"/><circle cx="3" cy="16" r="0.12" fill="white" opacity="0.3"/><circle cx="26" cy="32" r="0.25" fill="%23e0f2fe" opacity="0.5"/><circle cx="18" cy="6" r="0.2" fill="white" opacity="0.4"/><circle cx="47" cy="48" r="0.3" fill="white" opacity="0.6"/></svg>')`
                          : theme.value === "rose"
                        ? `linear-gradient(135deg, 
                           rgba(220, 20, 60, 1) 0%,     /* Deep cherry red */
                           rgba(178, 34, 34, 0.95) 30%, /* Fire brick */
                           rgba(139, 0, 0, 0.9) 60%,    /* Dark red */
                           rgba(72, 0, 36, 1) 100%      /* Very dark burgundy */
                         ),
                         radial-gradient(ellipse at 30% 20%, rgba(255, 20, 147, 0.3) 0%, transparent 60%),
                         radial-gradient(circle at 70% 70%, rgba(220, 20, 60, 0.4) 0%, transparent 50%)`
                        : theme.value === "ocean"
                        ? `linear-gradient(135deg, 
                             rgba(59, 130, 246, 1) 0%,     /* Bright blue */
                             rgba(37, 99, 235, 0.9) 30%,   /* Medium blue */
                             rgba(29, 78, 216, 0.8) 60%,   /* Deeper blue */
                             rgba(15, 23, 42, 1) 100%      /* Very dark blue */
                           ),
                           radial-gradient(ellipse at 20% 30%, rgba(20, 184, 166, 0.4) 0%, transparent 50%),
                           radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)`
                        : `linear-gradient(to bottom right, ${theme.baseColor}, rgba(255,255,255,0.15))`,
                      }}
                      title={theme.name}
                    />
                  ))}
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
                  className="w-full bg-red-800 hover:bg-red-900 h-12 text-white"
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
