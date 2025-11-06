"use client"

import { useState, useEffect, useRef } from "react"
import GraveCard from "./grave-card"

interface LazyGraveCardProps {
  situationship: any
  initialColor?: string
  onRevive?: (id: string) => void
  onBury?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function LazyGraveCard({
  situationship,
  initialColor,
  onRevive,
  onBury,
  onDelete,
}: LazyGraveCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Only render after a small delay to avoid rendering all at once
            setTimeout(() => {
              setShouldRender(true)
            }, 50)
          } else {
            setIsVisible(false)
            // Keep rendered but mark as not visible for animations
          }
        })
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0.1,
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} style={{ minHeight: "275px" }}>
      {shouldRender ? (
        <GraveCard
          situationship={situationship}
          initialColor={initialColor}
          onRevive={onRevive}
          onBury={onBury}
          onDelete={onDelete}
          isVisible={isVisible}
        />
      ) : (
        <div className="h-[275px] bg-zinc-800 rounded-t-[40px] animate-pulse" />
      )}
    </div>
  )
}

