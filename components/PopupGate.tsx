// components/PopupGate.tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { PopupModal } from "./PopupModal"
import { type Popup, shouldAutoOpenToday, markSeen, popupId } from "@/lib/popup"
import { todayBrussels } from "@/lib/dates"
import eventsData from "@/content/events.json"

type EventItem = {
  id: string
  title: string
  subtitle?: string
  image: string
  video?: string
  dateStart: string
  dateEnd: string
}

const getStatus = (event: EventItem, today: string) => {
  if (today > event.dateEnd) return "finished" as const
  if (today < event.dateStart) return "upcoming" as const
  return "currently" as const
}

/**
 * Convert an events.json entry into the Popup shape PopupModal expects.
 * Title / subtitle / alt are not currently localized in events.json so we
 * mirror the same value across all locales for now; swap to per-locale
 * fields when copy needs to differ per language.
 */
const eventToPopup = (event: EventItem): Popup => {
  const alt = event.subtitle ? `${event.title} — ${event.subtitle}` : event.title
  return {
    active: true,
    kind: "poster",
    image: event.image,
    video: event.video,
    imageAlt: { en: alt, nl: alt, fr: alt },
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    title: { en: event.title, nl: event.title, fr: event.title },
    subtitle: event.subtitle
      ? { en: event.subtitle, nl: event.subtitle, fr: event.subtitle }
      : undefined,
  }
}

/**
 * PopupGate — auto-opens the *currently* running campaign once per day per
 * visitor. Driven by content/events.json (single source of truth shared with
 * the Events carousel). No imperative open() ref anymore; the Happening pill
 * now scrolls to #events instead of opening this modal.
 */
export function PopupGate() {
  const today = todayBrussels()
  const events = eventsData as EventItem[]

  const currentPopup = useMemo<Popup | null>(() => {
    const current = events.find((e) => getStatus(e, today) === "currently")
    return current ? eventToPopup(current) : null
  }, [events, today])

  const id = currentPopup ? popupId(currentPopup) : ""
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (currentPopup && shouldAutoOpenToday(id, today)) setOpen(true)
  }, [currentPopup, id, today])

  const onClose = () => {
    setOpen(false)
    if (currentPopup) markSeen(id, today)
  }

  if (!currentPopup) return null
  return <PopupModal popup={currentPopup} open={open} onClose={onClose} />
}
