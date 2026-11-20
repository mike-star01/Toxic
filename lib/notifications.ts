import { Capacitor } from "@capacitor/core"
import { LocalNotifications } from "@capacitor/local-notifications"

const settingsKey = "rosterrip-notifications"
const reminderTitle = "The gravekeeper has questions 👀"
const reminderBody = "Come back and finish your autopsy."

type Settings = {
  enabled: boolean
  invited: boolean
  pendingInvite: boolean
  reminders: Record<string, { id: number; due: number }>
}
type Grave = {
  id: string
  name?: string
  cause?: string
  photo?: string | null
  epitaph?: string
  reflection?: string
  dates?: { start?: string; end?: string }
  notificationDueAt?: number
  autopsyComplete?: boolean
  details?: { dateCount?: number | null; redFlags?: string[]; flags?: string[] }
}

export const supportsReminders = () => Capacitor.isNativePlatform()

function readSettings(): Settings {
  const saved = JSON.parse(localStorage.getItem(settingsKey) || "{}")
  return { enabled: false, invited: false, pendingInvite: false, reminders: {}, ...saved }
}
function writeSettings(settings: Settings) {
  localStorage.setItem(settingsKey, JSON.stringify(settings))
}
export function remindersEnabled() {
  return readSettings().enabled
}
export function notifyGravesChanged() {
  window.dispatchEvent(new Event("rosterrip-graves-changed"))
}
export function firstGraveSaved(previousCount: number) {
  if (supportsReminders() && previousCount === 0) {
    const settings = readSettings()
    if (!settings.invited) {
      settings.pendingInvite = true
      writeSettings(settings)
    }
  }
  notifyGravesChanged()
}
export function takeInvitation() {
  if (!supportsReminders()) return false
  const settings = readSettings()
  if (!settings.pendingInvite || settings.invited) return false
  settings.pendingInvite = false
  settings.invited = true
  writeSettings(settings)
  return true
}

// Default "No" switches, zero flowers, and the default color are valid answers.
export function formAutopsyComplete(form: {
  name: string; cause: string; startDate: string; endDate: string
  epitaph: string; reflection: string; dateCount: string
  redFlags: string[]; flags: string[]; preciseDuration: string
}, photo: string | null) {
  return [
    form.name, form.cause, form.startDate, form.endDate,
    form.epitaph, form.reflection, form.dateCount, photo,
  ].every(value => Boolean(value?.trim())) &&
    form.redFlags.length > 0 && form.flags.length > 0 &&
    (form.startDate !== form.endDate || Boolean(form.preciseDuration.trim()))
}
function saveReminderState(settings: Settings) {
  const current = readSettings()
  writeSettings({ ...settings, invited: current.invited, pendingInvite: current.pendingInvite })
}
function isComplete(grave: Grave) {
  if (typeof grave.autopsyComplete === "boolean") return grave.autopsyComplete
  return [grave.name, grave.cause, grave.photo, grave.epitaph, grave.reflection,
    grave.dates?.start, grave.dates?.end].every(value => Boolean(value?.trim())) &&
    grave.details?.dateCount !== undefined &&
    Boolean(grave.details?.redFlags?.length && grave.details?.flags?.length)
}

let queue = Promise.resolve()
export function syncReminders() {
  const result = queue.then(reconcile)
  queue = result.catch(() => {})
  return result
}
async function reconcile() {
  if (!supportsReminders()) return
  const settings = readSettings()
  const permission = await LocalNotifications.checkPermissions()
  const enabled = settings.enabled && permission.display === "granted"
  const graves: Grave[] = JSON.parse(localStorage.getItem("situationships") || "[]")
  const incomplete = new Set(graves.filter(grave => !isComplete(grave)).map(grave => grave.id))
  const pending = await LocalNotifications.getPending()
  const pendingIds = new Set(pending.notifications.map(notification => notification.id))
  const toCancel = Object.entries(settings.reminders)
    .filter(([graveId]) => !enabled || !incomplete.has(graveId))
  if (toCancel.length) {
    await LocalNotifications.cancel({ notifications: toCancel.map(([, reminder]) => ({ id: reminder.id })) })
    for (const [graveId] of toCancel) delete settings.reminders[graveId]
  }
  if (enabled) {
    const usedIds = new Set([...pendingIds, ...Object.values(settings.reminders).map(reminder => reminder.id)])
    for (const graveId of incomplete) {
      if (!settings.reminders[graveId]) {
        let id = 1800000000
        while (usedIds.has(id)) id++
        usedIds.add(id)
        settings.reminders[graveId] = { id, due: graves.find(grave => grave.id === graveId)?.notificationDueAt ?? Date.now() + 24 * 60 * 60 * 1000 }
      }
    }
    // Persist the original due time before scheduling, so retries never postpone it.
    saveReminderState(settings)
    for (const [graveId, reminder] of Object.entries(settings.reminders)) {
      if (pendingIds.has(reminder.id) || reminder.due <= Date.now()) continue
      await LocalNotifications.schedule({ notifications: [{
        id: reminder.id, title: reminderTitle, body: reminderBody,
        schedule: { at: new Date(reminder.due) },
        extra: { graveId },
      }] })
    }
  }
  saveReminderState(settings)
}
export async function setRemindersEnabled(enabled: boolean) {
  if (!supportsReminders()) throw new Error("Reminders are available in the installed iPhone app.")
  if (enabled) {
    let permission = await LocalNotifications.checkPermissions()
    if (permission.display === "prompt") permission = await LocalNotifications.requestPermissions()
    if (permission.display !== "granted") {
      throw new Error("Notifications are disabled in iPhone Settings. You can enable them there and try again.")
    }
  }
  const result = queue.then(async () => {
    const settings = readSettings()
    settings.enabled = enabled
    writeSettings(settings)
    await reconcile()
  })
  queue = result.catch(() => {})
  await result
}