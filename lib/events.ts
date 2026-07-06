// lib/events.ts
import eventsData from "@/content/events.json"
import type { Popup } from "./popup"

export type EventStatus = "finished" | "upcoming"

export type EventItem = {
  id: string
  title: string
  subtitle?: string
  image: string
  video?: string
  dateStart: string
  dateEnd: string
}

export const allEvents = eventsData as EventItem[]

/**
 * Two states only: an event is "finished" once today is past its end date,
 * otherwise it is "upcoming". This means an event automatically moves to
 * "finished" the day after it ends — no manual flag to flip.
 */
export const getStatus = (event: EventItem, today: string): EventStatus =>
  today > event.dateEnd ? "finished" : "upcoming"

/**
 * Index of the event to feature: the upcoming event that starts soonest.
 * When nothing is upcoming (everything has finished) we fall back to the most
 * recently finished event so the section is never empty. Returns -1 only for
 * an empty list.
 */
export const featuredEventIndex = (events: EventItem[], today: string): number => {
  let nextIdx = -1
  let nextStart = ""
  let finishedIdx = -1
  let finishedEnd = ""
  events.forEach((event, i) => {
    if (getStatus(event, today) === "upcoming") {
      if (nextIdx === -1 || event.dateStart < nextStart) {
        nextIdx = i
        nextStart = event.dateStart
      }
    } else if (finishedIdx === -1 || event.dateEnd > finishedEnd) {
      finishedIdx = i
      finishedEnd = event.dateEnd
    }
  })
  if (nextIdx !== -1) return nextIdx
  return finishedIdx
}

/** Build the Popup shape PopupModal expects from a carousel event. */
export const eventToPopup = (event: EventItem): Popup => {
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
