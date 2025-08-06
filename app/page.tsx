"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Mock data - in a real app this would come from a database
const stats = {
  totalGraves: 6,
  thisMonth: 2,
  revived: 2,
  longestSituationship: "6 months",
  recentActivity: [
    { name: "Gym Rat Greg", action: "added", time: "2 hours ago" },
    { name: "Tinder Tom", action: "revived", time: "1 day ago" },
    { name: "Coffee Shop Crush", action: "added", time: "3 days ago" },
  ],
}

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to graveyard as the default page
    router.replace("/graveyard")
  }, [router])

  return null
}
