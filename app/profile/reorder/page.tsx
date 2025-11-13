"use client"

import { useEffect, useState } from "react"
import AppHeader from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Situationship {
  id: string
  name: string
  order?: number
}

export default function ReorderGravesPage() {
  const [graves, setGraves] = useState<Situationship[]>([])
  const [dirty, setDirty] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [isTouchDragging, setIsTouchDragging] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('situationships')
    const saved: any[] = raw ? JSON.parse(raw) : []

    let changed = false
    const withOrder = saved.map((g, i) => {
      if (typeof g.order !== 'number') {
        changed = true
        return { ...g, order: i }
      }
      return g
    })

    if (changed) {
      localStorage.setItem('situationships', JSON.stringify(withOrder))
    }

    setGraves([...withOrder].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
  }, [])

  // Drag & Drop helpers
  const handleDragStart = (idx: number) => {
    setDragIndex(idx)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { (navigator as any).vibrate(10) } catch (_) {}
    }
  }

  const handleDragEnter = (overIdx: number) => {
    if (dragIndex === null || dragIndex === overIdx) return
    setGraves(prev => {
      const list = [...prev]
      const item = list[dragIndex]
      list.splice(dragIndex, 1)
      list.splice(overIdx, 0, item)
      setDragIndex(overIdx)
      return list
    })
    setDirty(true)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  // Touch DnD (mobile)
  const handleTouchStart = (idx: number, e?: React.TouchEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setDragIndex(idx)
    setIsTouchDragging(true)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { (navigator as any).vibrate(10) } catch (_) {}
    }
  }

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (dragIndex === null) return
    const touch = e.touches[0]
    if (!touch) return
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
    const container = el?.closest('[data-reorder-item]') as HTMLElement | null
    if (!container) {
      e.preventDefault()
      return
    }
    const overAttr = container.getAttribute('data-idx')
    const overIdx = overAttr ? parseInt(overAttr, 10) : NaN
    if (!Number.isFinite(overIdx) || overIdx === dragIndex) {
      e.preventDefault()
      return
    }
    setGraves(prev => {
      const list = [...prev]
      const item = list[dragIndex]
      list.splice(dragIndex, 1)
      list.splice(overIdx, 0, item)
      setDragIndex(overIdx)
      return list
    })
    setDirty(true)
    e.preventDefault()
  }

  const handleTouchEnd = () => {
    setIsTouchDragging(false)
    setDragIndex(null)
  }

  const swap = (idx: number, dir: 'up' | 'down') => {
    const arr = [...graves].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= arr.length) return

    const a = arr[idx]
    const b = arr[swapIdx]
    const tmp = a.order ?? idx
    a.order = b.order ?? swapIdx
    b.order = tmp

    setGraves(arr.sort((x, y) => (x.order ?? 0) - (y.order ?? 0)))
    setDirty(true)
  }

  const save = () => {
    const raw = localStorage.getItem('situationships')
    const saved: any[] = raw ? JSON.parse(raw) : []
    const byId: Record<string, any> = Object.fromEntries(saved.map(g => [g.id, g]))
    // Recompute order by current visual index
    graves.forEach((g, idx) => {
      if (byId[g.id]) byId[g.id].order = idx
    })
    const updated = Object.values(byId) as any[]
    localStorage.setItem('situationships', JSON.stringify(updated))
    setDirty(false)
    // Navigate back to graveyard after saving
    if (typeof window !== 'undefined') {
      window.location.href = '/graveyard'
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-x-hidden">
      <AppHeader title="Reorder Graves" />
      <div className="px-4 py-4 space-y-4">
        <Card className="bg-zinc-900/70 border-zinc-700/70 backdrop-blur">
          <CardContent
            className="p-4 space-y-2 select-none"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
          >
            {graves.map((g, idx) => {
              const isActive = dragIndex === idx || (isTouchDragging && dragIndex === idx)
              return (
                <div
                  key={g.id}
                  className={`flex items-center justify-between rounded px-4 py-4 select-none ${isActive ? 'bg-red-800' : 'bg-zinc-950/85 border border-zinc-800/70 backdrop-blur'}`}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  data-reorder-item
                  data-idx={idx}
                  style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                >
                  <div className="text-base touch-auto">
                    <span className="text-zinc-500 mr-3" style={{ WebkitUserSelect: 'none' }}>{idx + 1}.</span>
                    <span className="mr-3" style={{ WebkitUserSelect: 'none' }}>{g.name || `Grave ${idx + 1}`}</span>
                  </div>
                  <div
                    className="flex items-center justify-center w-12 h-12 text-2xl text-zinc-300 cursor-grab active:cursor-grabbing"
                    draggable
                    data-drag-handle
                    onDragStart={() => handleDragStart(idx)}
                    onTouchStart={(e) => handleTouchStart(idx, e)}
                    style={{ touchAction: 'none' }}
                  >
                    ☰
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            size="lg"
            className="h-12 text-base bg-red-800 hover:bg-red-900 text-white w-full"
            onClick={save}
            disabled={!dirty}
          >
            Save Order
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 text-base w-full"
            onClick={() => (window.location.href = '/profile')}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}


