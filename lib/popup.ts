// lib/popup.ts
import { isWithinRange } from "./dates"

type LocalizedString = { en: string; nl: string; fr: string }

export type Popup = {
  active: boolean
  kind: "poster" | "card"
  image: string
  imageAlt: LocalizedString
  dateStart: string
  dateEnd: string
  title?: LocalizedString
  subtitle?: LocalizedString
  detail?: LocalizedString
}

const KEY_DATE = "barbassie:popup:lastSeenDate"
const KEY_ID   = "barbassie:popup:id"

/** Stable identifier so a swapped pop-up re-shows. */
export const popupId = (p: Popup): string => {
  const raw = `${p.image}|${p.dateStart}|${p.dateEnd}`
  let h = 5381
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h) ^ raw.charCodeAt(i)
  return (h >>> 0).toString(36)
}

export const isPopupActiveNow = (p: Popup, todayIso: string): boolean =>
  p.active && isWithinRange(todayIso, p.dateStart, p.dateEnd)

export const shouldAutoOpenToday = (id: string, todayIso: string): boolean => {
  if (typeof window === "undefined") return false
  const seenDate = localStorage.getItem(KEY_DATE)
  const seenId   = localStorage.getItem(KEY_ID)
  return seenDate !== todayIso || seenId !== id
}

export const markSeen = (id: string, todayIso: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_DATE, todayIso)
  localStorage.setItem(KEY_ID, id)
}
