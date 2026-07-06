// components/PopupGate.tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { PopupModal } from "./PopupModal"
import { shouldAutoOpenToday, markSeen, popupId, type Popup } from "@/lib/popup"
import { todayBrussels } from "@/lib/dates"
import { allEvents, featuredEventIndex, eventToPopup } from "@/lib/events"

/**
 * PopupGate — auto-opens the next upcoming campaign once per day per visitor.
 * Driven by content/events.json (single source of truth shared with the Events
 * carousel). Events move to "finished" automatically once their end date has
 * passed, so this always surfaces the soonest event still ahead. No imperative
 * open() ref; the Happening pill scrolls to #events instead.
 */
export function PopupGate() {
  const today = todayBrussels()

  const featuredPopup = useMemo<Popup | null>(() => {
    const idx = featuredEventIndex(allEvents, today)
    const event = idx >= 0 ? allEvents[idx] : undefined
    // Only auto-open for something still ahead — never re-surface a finished event.
    if (!event || today > event.dateEnd) return null
    return eventToPopup(event)
  }, [today])

  const id = featuredPopup ? popupId(featuredPopup) : ""
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (featuredPopup && shouldAutoOpenToday(id, today)) setOpen(true)
  }, [featuredPopup, id, today])

  const onClose = () => {
    setOpen(false)
    if (featuredPopup) markSeen(id, today)
  }

  if (!featuredPopup) return null
  return <PopupModal popup={featuredPopup} open={open} onClose={onClose} />
}
