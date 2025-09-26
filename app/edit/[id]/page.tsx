"use client"
import React, { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skull, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AppHeader from "@/components/app-header"

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
    love: boolean;
    fight: boolean;
    exclusive: boolean;
    duration: string;
    preciseDuration?: string;
    location: string;
    redFlags: string[];
    lastMessage: string;
  };
  revived: boolean;
  createdAt: string;
}

// Mock data - in a real app this would come from a database
const situationshipsData: Record<string, Situationship> = {
  "1": {
    id: "1",
    name: "Gym Rat Greg",
    cause: "Ghosted",
    dates: { start: "Jan 2023", end: "Mar 2023" },
    epitaph: "Here lies the man who said he wasn't ready for a relationship and got a girlfriend 2 weeks later.",
    reflection: "Learned to trust my gut when someone says they're not ready for a relationship. Also, if they're still on dating apps after we've been seeing each other for weeks, that's a major red flag. I deserve someone who's actually ready to commit.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 3,
      kissed: true,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "2 months",
      location: "Coffee shop, his apartment, the park",
      redFlags: ["Always canceled last minute", "Never introduced me to friends", "Still had dating apps"],
      lastMessage: "Hey, I'm not really feeling this anymore. I think we should stop seeing each other.",
    },
    revived: false,
    createdAt: "March 15, 2023",
  },
  "2": {
    id: "2",
    name: "Tinder Tom",
    cause: "Breadcrumbed",
    dates: { start: "Nov 2022", end: "Jan 2023" },
    epitaph: "RIP to the texter who was 'just busy with work' for 8 consecutive weekends.",
    reflection: "Actions speak louder than words. If someone keeps saying they want to meet but always has excuses, they're not actually interested. I learned to stop making excuses for people who don't prioritize spending time with me.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 2,
      kissed: true,
      hookup: true,
      love: false,
      fight: false,
      exclusive: false,
      duration: "3 months",
      location: "Dating app, local bar",
      redFlags: ["Always texting but never calling", "Cancelled dates frequently", "Vague about future plans"],
      lastMessage: "Sorry, work has been crazy. Let's catch up soon!",
    },
    revived: true,
    createdAt: "January 20, 2023",
  },
  "3": {
    id: "3",
    name: "Hinge Harry",
    cause: "Situationship",
    dates: { start: "May 2022", end: "Nov 2022" },
    epitaph: "We were 'exclusive but not official' until he wasn't exclusive anymore.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 12,
      kissed: true,
      hookup: true,
      love: true,
      fight: true,
      exclusive: true,
      duration: "6 months",
      location: "Dating app, various restaurants",
      redFlags: ["Avoided relationship talks", "Never posted about us", "Kept dating apps"],
      lastMessage: "I think we want different things right now.",
    },
    revived: false,
    createdAt: "November 10, 2022",
  },
  "4": {
    id: "4",
    name: "Bumble Brad",
    cause: "Slow Fade",
    dates: { start: "Feb 2023", end: "Apr 2023" },
    epitaph: "Texts got shorter until they stopped completely. Classic.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 5,
      kissed: true,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "2 months",
      location: "Dating app, coffee shops",
      redFlags: ["Took longer to reply each time", "Stopped initiating conversations", "Became distant"],
      lastMessage: "Yeah",
    },
    revived: false,
    createdAt: "April 5, 2023",
  },
  "5": {
    id: "5",
    name: "Coffee Shop Crush",
    cause: "Never Started",
    dates: { start: "Dec 2022", end: "Dec 2022" },
    epitaph: "We made eye contact for 3 months. I finally got their number. They never texted back.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 0,
      kissed: false,
      hookup: false,
      love: false,
      fight: false,
      exclusive: false,
      duration: "1 day",
      location: "Local coffee shop",
      redFlags: ["Never responded to text", "Avoided eye contact after", "Changed coffee shop routine"],
      lastMessage: "Hey, it's [name] from the coffee shop!",
    },
    revived: false,
    createdAt: "December 12, 2022",
  },
  "6": {
    id: "6",
    name: "Instagram Influencer",
    cause: "Benched",
    dates: { start: "Mar 2023", end: "May 2023" },
    epitaph: "Kept me on the sidelines while exploring 'options'. I was never the starting player.",
    photo: "/placeholder-user.jpg",
    details: {
      meetInPerson: true,
      dateCount: 4,
      kissed: true,
      hookup: true,
      love: false,
      fight: false,
      exclusive: false,
      duration: "3 months",
      location: "Instagram DMs, trendy restaurants",
      redFlags: ["Always talking about other people", "Kept me secret", "Prioritized social media"],
      lastMessage: "You're amazing, but I'm not ready to settle down.",
    },
    revived: true,
    createdAt: "May 18, 2023",
  },
}

export default function EditSituationshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [situationship, setSituationship] = useState<Situationship | null>(null)
  const [selectedColor, setSelectedColor] = useState("classic")
  const [formData, setFormData] = useState({
    name: "",
    cause: "",
    startDate: "",
    endDate: "",
    preciseDuration: "", // For days/weeks when same month
    preciseDurationType: "days", // days or weeks
    epitaph: "",
    reflection: "",
    meetInPerson: false,
    dateCount: "0",
    kissed: false,
    hookup: false,
    love: false,
    fight: false,
    exclusive: false,
    redFlags: [] as string[],
  })
  const [photo, setPhoto] = useState<string | null>(null)
  const [redFlagInput, setRedFlagInput] = useState("")
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

  // Emoji mapping for causes
  const causeEmojis: Record<string, string> = {
    ghosted: '👻',
    breadcrumbed: '🍞',
    situationship: '🥀',
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


  useEffect(() => {
    // Try to get the situationship from localStorage first
    let found: Situationship | null = null
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      if (stored) {
        const graves: Situationship[] = JSON.parse(stored)
        found = graves.find(g => g.id === id) || null
      }
    }
    // If not found, fall back to example data
    if (!found) {
      found = situationshipsData[id] || null
    }
    if (found) {
      setSituationship(found)
      // Parse precise duration if it exists
      const preciseDuration = found.details.preciseDuration || ''
      const preciseDurationParts = preciseDuration.split(' ')
      const preciseDurationValue = preciseDurationParts[0] || ''
      const preciseDurationType = preciseDurationParts[1] || 'days'
      
      setFormData({
        name: found.name,
        cause: Object.keys(causeLabels).find(key => causeLabels[key] === found.cause) || '',
        startDate: found.dates.start,
        endDate: found.dates.end,
        preciseDuration: preciseDurationValue,
        preciseDurationType: preciseDurationType,
        epitaph: found.epitaph,
        reflection: found.reflection || '',
        meetInPerson: found.details.meetInPerson,
        dateCount: found.details.dateCount.toString(),
        kissed: found.details.kissed,
        hookup: found.details.hookup,
        love: found.details.love || false,
        fight: found.details.fight || false,
        exclusive: found.details.exclusive,
        redFlags: found.details.redFlags || [],
      })
      setPhoto(found.photo || null)
      
      // Load saved color theme
      const savedColor = localStorage.getItem(`grave-color-${id}`)
      if (savedColor && colorThemes.find(theme => theme.value === savedColor)) {
        setSelectedColor(savedColor)
      }
    }
  }, [id])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const calculateDuration = (startDate: string, endDate: string, preciseDuration?: string) => {
    if (!startDate || !endDate) return ''
    
    // If same month and precise duration is provided, use that
    if (startDate === endDate && preciseDuration) {
      return preciseDuration
    }
    
    try {
      // Handle month format (YYYY-MM) by adding day 1 to make it a valid date
      const start = new Date(startDate + '-01')
      const end = new Date(endDate + '-01')
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return ''
      }
      
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
      } else if (diffDays < 365) {
        const months = Math.round(diffDays / 30.44)
        return `${months} month${months !== 1 ? 's' : ''}`
      } else {
        const years = Math.round(diffDays / 365.25)
        return `${years} year${years !== 1 ? 's' : ''}`
      }
    } catch (error) {
      console.error('Error calculating duration:', error)
      return ''
    }
  }

  if (!situationship) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Situationship not found</div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.cause || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing information",
        description: "Please provide a name, cause of death, start date, and end date.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    if (formData.epitaph.length > 100) {
      toast({
        title: "Epitaph too long",
        description: "Please keep your epitaph under 100 characters for the best display.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    // Calculate final duration (with precise duration if same month)
    const finalDuration = calculateDuration(
      formData.startDate, 
      formData.endDate, 
      formData.preciseDuration ? `${formData.preciseDuration} ${formData.preciseDurationType}` : undefined
    )
    
    // Update the situationship
    const updatedSituationship = {
      ...situationship!,
      name: formData.name,
      cause: causeLabels[formData.cause] || formData.cause,
      dates: {
        start: formData.startDate,
        end: formData.endDate,
      },
      epitaph: formData.epitaph,
      reflection: formData.reflection,
      photo: photo,
      details: {
        ...situationship!.details,
        meetInPerson: formData.meetInPerson,
        dateCount: Number(formData.dateCount),
        kissed: formData.kissed,
        hookup: formData.hookup,
        love: formData.love,
        fight: formData.fight,
        exclusive: formData.exclusive,
        redFlags: formData.redFlags,
        duration: finalDuration,
        preciseDuration: formData.preciseDuration ? `${formData.preciseDuration} ${formData.preciseDurationType}` : '',
      },
    }

    // Update localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('situationships')
      let graves = stored ? JSON.parse(stored) : []
      const index = graves.findIndex((g: any) => g.id === id)
      if (index !== -1) {
        // Replace in place to maintain order
        graves[index] = updatedSituationship
      } else {
        // Only add if not found (shouldn't happen for existing graves)
        graves.push(updatedSituationship)
      }
      localStorage.setItem('situationships', JSON.stringify(graves))
      
      // Save color theme
      localStorage.setItem(`grave-color-${id}`, selectedColor)
    }

    toast({
      title: "Updated!",
      description: "Situationship details have been updated.",
      duration: 4000,
    })
    router.back()
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <AppHeader title={`Edit ${situationship.name}`} showBack />

      <div className="px-4 py-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Edit Situationship</CardTitle>
            <CardDescription>Update the details of this situationship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name or Nickname <span className="text-zinc-400">(max 30)</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g., Gym Rat Greg, Tinder Tom"
                    className="bg-zinc-900 border-zinc-700 h-11"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={30}
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 gap-y-4">
                  <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium">
                      Started
                    </label>
                    <Input
                      id="start-date"
                      type="month"
                      className="bg-zinc-900 border-zinc-700 h-11"
                      value={formData.startDate}
                      onChange={(e) => {
                        handleChange("startDate", e.target.value)
                        // Clear precise duration if months are different
                        if (formData.endDate && e.target.value !== formData.endDate) {
                          handleChange("preciseDuration", "")
                        }
                      }}
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
                      value={formData.endDate || ""}
                      onChange={(e) => {
                        handleChange("endDate", e.target.value)
                        // Clear precise duration if months are different
                        if (formData.startDate && e.target.value !== formData.startDate) {
                          handleChange("preciseDuration", "")
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Precise Duration - Only show when same month */}
                {formData.startDate && formData.endDate && formData.startDate === formData.endDate && (
                  <div className="space-y-2">
                    <label htmlFor="precise-duration" className="text-sm font-medium">
                      Precise Duration <span className="text-zinc-400">(Optional - for same month)</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="precise-duration"
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Days"
                        className="bg-zinc-900 border-zinc-700 h-11"
                        value={formData.preciseDuration || ""}
                        onChange={(e) => handleChange("preciseDuration", e.target.value)}
                      />
                      <Select
                        value={formData.preciseDurationType || "days"}
                        onValueChange={(value) => handleChange("preciseDurationType", value)}
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-700 h-11 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                

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

              {/* Reflection Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">💭</span>
                  <h3 className="text-base font-bold">Personal Reflection</h3>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reflection" className="text-sm font-medium">
                      What did you learn from this situationship? <span className="text-zinc-400">(Optional)</span>
                    </label>
                    <Textarea
                      id="reflection"
                      placeholder="Reflect on what you learned, red flags you noticed, or how you grew from this experience..."
                      className="bg-zinc-800 border-zinc-700 min-h-[100px] resize-none"
                      value={formData.reflection}
                      onChange={(e) => handleChange("reflection", e.target.value)}
                      maxLength={300}
                    />
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>Share your thoughts, lessons learned, or personal growth</span>
                      <span>{formData.reflection.length}/300</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🚩</span>
                  <h3 className="text-base font-bold">Red Flags</h3>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Add red flags you noticed <span className="text-zinc-400">(Optional)</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Always canceled last minute"
                        className="bg-zinc-800 border-zinc-700 h-10 flex-1"
                        value={redFlagInput}
                        onChange={(e) => setRedFlagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            if (redFlagInput.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                redFlags: [...(prev.redFlags || []), redFlagInput.trim()]
                              }))
                              setRedFlagInput('')
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-zinc-700 bg-transparent px-3"
                        onClick={() => {
                          if (redFlagInput.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              redFlags: [...(prev.redFlags || []), redFlagInput.trim()]
                            }))
                            setRedFlagInput('')
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.redFlags && formData.redFlags.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-400">Red flags:</div>
                        <div className="flex flex-wrap gap-2">
                          {formData.redFlags.map((flag, index) => (
                            <div key={index} className="flex items-center gap-1 bg-red-900/20 border border-red-700/30 rounded-full px-3 py-1">
                              <span className="text-xs text-red-300">{flag}</span>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  redFlags: prev.redFlags?.filter((_, i) => i !== index) || []
                                }))}
                                className="text-red-400 hover:text-red-300 text-xs ml-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo <span className="text-zinc-400">(Optional)</span></label>
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
                      className={`w-full h-12 rounded border-2 transition-all ${
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
                          : theme.value === "sunset"
                          ? `linear-gradient(135deg, #ff8c00 0%, #ffa500 35%, #ff6347 65%, #ff4500 100%)`
                          : theme.value === "purple"
                          ? `linear-gradient(135deg, #0b021f 0%, #2d0d5a 30%, #5b21b6 65%, #000000 100%)`
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
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                    <span className="text-sm font-medium">Dates went on</span>
                    <Input
                      id="date-count"
                      type="number"
                      min="0"
                      className="bg-zinc-800 border-zinc-700 h-9 w-28 text-right"
                      value={formData.dateCount}
                      onChange={(e) => handleChange("dateCount", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-900 h-12 text-white"
                >
                  Save Changes
                </Button>
                <div className="pt-1">
                  <Button
                    type="button"
                    className="w-full bg-red-800 hover:bg-red-900 h-12 text-white"
                    onClick={() => {
                      // Confirm delete
                      if (confirm('Delete this grave? This cannot be undone.')) {
                        if (typeof window !== 'undefined') {
                          const stored = localStorage.getItem('situationships')
                          let graves = stored ? JSON.parse(stored) : []
                          graves = graves.filter((g: any) => g.id !== id)
                          localStorage.setItem('situationships', JSON.stringify(graves))
                        }
                        router.push('/graveyard')
                      }
                    }}
                  >
                    Delete Grave
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 