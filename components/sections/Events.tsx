// components/sections/Events.tsx
"use client"
import { useState, useMemo, useRef } from "react"
import { useTranslations, useLocale } from "next-intl"
import { todayBrussels } from "@/lib/dates"
import { cn } from "@/lib/cn"
import eventsData from "@/content/events.json"

// Horizontal pixels of drag movement before we consider a gesture a swipe
// (and suppress the click that would otherwise activate the card under the
// pointer). Tuned so a deliberate flick triggers, a tap doesn't.
const SWIPE_THRESHOLD = 70
// Smaller threshold for marking the gesture as a drag (vs. a click) so we
// know to swallow the trailing click event when the user releases.
const DRAG_DETECT_THRESHOLD = 6

type EventStatus = "finished" | "currently" | "upcoming"

type EventItem = {
  id: string
  title: string
  subtitle?: string
  image: string
  dateStart: string
  dateEnd: string
}

const getStatus = (event: EventItem, today: string): EventStatus => {
  if (today > event.dateEnd) return "finished"
  if (today < event.dateStart) return "upcoming"
  return "currently"
}

/**
 * Events — 3D fan carousel of past / current / upcoming Bassie campaigns.
 * Replaces the auto-opening Mexico popup with a section that the Happening
 * pill scrolls to. The center card is the "currently" event; the arrows
 * navigate left (older) and right (newer).
 */
export function Events() {
  const t = useTranslations("events")
  const locale = useLocale()
  const today = todayBrussels()

  // Auto-center on the currently-running event; fallback to middle of list.
  const events = eventsData as EventItem[]
  const initialIndex = useMemo(() => {
    const idx = events.findIndex((e) => getStatus(e, today) === "currently")
    return idx >= 0 ? idx : Math.floor(events.length / 2)
  }, [events, today])

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1))
  const next = () => setActiveIndex((i) => Math.min(events.length - 1, i + 1))

  // Drag-to-swipe state. We use a ref for "was dragging" so card onClick
  // handlers can read it synchronously after pointerup without the React
  // re-render race.
  const dragStartXRef = useRef<number | null>(null)
  const wasDraggingRef = useRef(false)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = e.clientX
    wasDraggingRef.current = false
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) return
    const delta = e.clientX - dragStartXRef.current
    if (Math.abs(delta) > DRAG_DETECT_THRESHOLD) wasDraggingRef.current = true
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartXRef.current
    dragStartXRef.current = null
    if (start === null) return
    const delta = e.clientX - start
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      // Swipe left -> show the next (newer) event; swipe right -> previous.
      if (delta < 0) next()
      else prev()
    }
    // Clear the wasDragging flag on the next tick so the card click
    // handler that fires immediately after pointerup can still see it.
    queueMicrotask(() => {
      wasDraggingRef.current = false
    })
  }

  const onCardClick = (i: number) => {
    if (wasDraggingRef.current) return
    setActiveIndex(i)
  }

  const activeEvent = events[activeIndex]
  const activeStatus = activeEvent ? getStatus(activeEvent, today) : "currently"

  // Format dates per locale for the meta line below the carousel.
  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00")
    return d.toLocaleDateString(locale === "en" ? "en-GB" : locale, {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section
      id="events"
      className="bg-ink text-bg relative overflow-hidden py-14 md:py-24"
      aria-labelledby="events-heading"
    >
      {/* Status labels — the one matching the active card's status is held at
          full opacity while the other two fade back, so the carousel
          position is always visually anchored to a category. */}
      <div className="relative mx-auto mb-8 max-w-6xl px-4 md:mb-14 md:px-8">
        <div
          id="events-heading"
          className="font-subtitle text-accent grid grid-cols-3 items-baseline gap-2 text-[10px] tracking-[0.22em] uppercase md:text-sm"
        >
          {(["finished", "currently", "upcoming"] as const).map((status, idx) => (
            <span
              key={status}
              className={cn(
                "transition-opacity duration-300",
                idx === 0 && "text-left",
                idx === 1 && "text-center",
                idx === 2 && "text-right",
                activeStatus === status ? "opacity-100" : "opacity-25"
              )}
            >
              {t(status)}
            </span>
          ))}
        </div>
      </div>

      {/* 3D carousel — drag/swipe with mouse or finger, click cards to focus.
          touch-action: pan-y lets the browser keep handling vertical
          page-scroll while we capture horizontal gestures for the carousel.
          Card height is the single sizing knob; everything else (width,
          spread, button hit area) follows from it. */}
      <div
        className="relative h-[320px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[640px]"
        style={{ perspective: "1400px", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {events.map((event, i) => {
          const offset = i - activeIndex
          const abs = Math.abs(offset)
          // Skip very far cards to keep DOM light
          if (abs > 3) return null

          // Smooth fan effect: scale, rotateY, translateX, opacity all driven by
          // distance from the active index.
          const scale = abs === 0 ? 1 : 1 - Math.min(abs * 0.18, 0.6)
          const rotate = offset * -16
          // Spread out more on larger screens by feeding viewport-aware units
          const translateXVw = offset * 14
          const opacity = abs === 0 ? 1 : Math.max(0.18, 1 - abs * 0.3)
          const zIndex = 100 - abs

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onCardClick(i)}
              aria-label={`${event.title} — ${getStatus(event, today)}`}
              aria-current={abs === 0 ? "true" : undefined}
              className={cn(
                "absolute top-1/2 left-1/2",
                "transition-all duration-500 ease-out",
                "focus-visible:ring-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none"
              )}
              style={{
                transform: `translate(-50%, -50%) translateX(${translateXVw}vw) scale(${scale}) rotateY(${rotate}deg)`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- aspect-aware carousel item */}
              <img
                src={event.image}
                alt={event.title}
                className="block h-[280px] w-auto rounded-md shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] md:h-[560px]"
                draggable={false}
              />
            </button>
          )
        })}

        {/* Prev / Next arrows */}
        <button
          type="button"
          onClick={prev}
          disabled={activeIndex === 0}
          aria-label={t("prev")}
          className={cn(
            "absolute top-1/2 left-2 z-[200] -translate-y-1/2 md:left-6",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-bg/10 text-bg backdrop-blur transition",
            "hover:bg-bg/20",
            "disabled:cursor-not-allowed disabled:opacity-30",
            "focus-visible:ring-bg focus-visible:ring-2 focus-visible:outline-none"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          disabled={activeIndex === events.length - 1}
          aria-label={t("next")}
          className={cn(
            "absolute top-1/2 right-2 z-[200] -translate-y-1/2 md:right-6",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-bg/10 text-bg backdrop-blur transition",
            "hover:bg-bg/20",
            "disabled:cursor-not-allowed disabled:opacity-30",
            "focus-visible:ring-bg focus-visible:ring-2 focus-visible:outline-none"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Meta line for the active card */}
      {activeEvent && (
        <div className="mx-auto mt-6 max-w-2xl px-4 text-center md:mt-14">
          <p className="font-subtitle text-accent text-[10px] tracking-[0.3em] uppercase md:text-xs">
            {t(activeStatus)}
          </p>
          <h3 className="font-subtitle text-bg mt-2 text-xl tracking-tight uppercase md:text-3xl">
            {activeEvent.title}
          </h3>
          {activeEvent.subtitle && (
            <p className="font-body text-bg/80 mt-1 text-xs tracking-wide uppercase md:text-sm">
              {activeEvent.subtitle}
            </p>
          )}
          <p className="font-body text-bg/60 mt-2 text-[10px] tracking-[0.2em] uppercase md:mt-3 md:text-xs">
            {formatDate(activeEvent.dateStart)} → {formatDate(activeEvent.dateEnd)}
          </p>
        </div>
      )}
    </section>
  )
}
