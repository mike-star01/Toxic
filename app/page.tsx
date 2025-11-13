"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to graveyard as the default page
    router.replace("/graveyard")
  }, [router])

  return null
}
