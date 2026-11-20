"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LocalNotifications } from "@capacitor/local-notifications"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { setRemindersEnabled, supportsReminders, syncReminders, takeInvitation } from "@/lib/notifications"

export default function NotificationSetup() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!supportsReminders()) return
    const refresh = () => {
      if (document.visibilityState === "hidden") return
      if (pathname === "/graveyard" && takeInvitation()) setOpen(true)
      void syncReminders().catch(() => {
        setError("Your reminder could not be scheduled. Try enabling it again in Profile.")
      })
    }
    refresh()
    window.addEventListener("rosterrip-graves-changed", refresh)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refresh)
    const listener = LocalNotifications.addListener("localNotificationActionPerformed", action => {
      const graveId = action.notification.extra?.graveId
      const graves = JSON.parse(localStorage.getItem("situationships") || "[]")
      router.push(typeof graveId === "string" && graves.some((grave: { id: string }) => grave.id === graveId)
        ? "/edit?id=" + encodeURIComponent(graveId) : "/graveyard")
    })
    return () => {
      window.removeEventListener("rosterrip-graves-changed", refresh)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refresh)
      void listener.then(handle => handle.remove())
    }
  }, [pathname, router])

  async function enable() {
    setBusy(true)
    try {
      await setRemindersEnabled(true)
      setOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not enable reminders.")
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value) }}>
        <DialogContent className="border-zinc-700 bg-zinc-900 text-zinc-100 [&>button]:hidden"
          onEscapeKeyDown={event => event.preventDefault()}
          onPointerDownOutside={event => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Want reminders with fewer mixed signals?</DialogTitle>
            <DialogDescription className="text-zinc-300">
              Get a reminder after 24 hours if any grave details are still unfinished.
            </DialogDescription>
          </DialogHeader>
          <Button disabled={busy} onClick={enable} className="bg-red-800 text-white hover:bg-red-900">
            {busy ? "Setting up..." : "Continue"}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(error)} onOpenChange={() => setError("")}>
        <DialogContent className="border-zinc-700 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription className="text-zinc-300">{error}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setError("")}>OK</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}