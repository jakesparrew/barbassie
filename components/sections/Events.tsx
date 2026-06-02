// components/sections/Events.tsx
"use client"
import { useState, useMemo } from "react"
import { useTranslations, useLocale } from "next-intl"
import { todayBrussels } from "@/lib/dates"
import { cn } from "@/lib/cn"
import eventsData from "@/content/events.json"

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
      className="bg-ink text-bg relative overflow-hidden py-20 md:py-24"
      aria-labelledby="events-heading"
    >
      {/* Status labels row */}
      <div className="relative mx-auto mb-10 max-w-6xl px-4 md:mb-14 md:px-8">
        <div
          id="events-heading"
          className="font-subtitle text-accent grid grid-cols-3 items-baseline gap-2 text-xs tracking-[0.25em] uppercase md:text-sm"
        >
          <span className="text-left">{t("finished")}</span>
          <span className="text-center">{t("currently")}</span>
          <span className="text-right">{t("upcoming")}</span>
        </div>
      </div>

      {/* 3D carousel */}
      <div className="relative h-[440px] md:h-[640px]" style={{ perspective: "1400px" }}>
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
              onClick={() => setActiveIndex(i)}
              aria-label={`${event.title} — ${getStatus(event, today)}`}
              aria-current={abs === 0 ? "true" : undefined}
              className={cn(
                "absolute top-1/2 left-1/2",
                "transition-all duration-500 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
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
                className="block h-[380px] w-auto rounded-md shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] md:h-[560px]"
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Meta line for the active card */}
      {activeEvent && (
        <div className="mx-auto mt-10 max-w-2xl px-4 text-center md:mt-14">
          <p className="font-subtitle text-accent text-xs tracking-[0.3em] uppercase">
            {t(activeStatus)}
          </p>
          <h3 className="font-subtitle text-bg mt-2 text-2xl tracking-tight uppercase md:text-3xl">
            {activeEvent.title}
          </h3>
          {activeEvent.subtitle && (
            <p className="font-body text-bg/80 mt-1 text-sm tracking-wide uppercase">
              {activeEvent.subtitle}
            </p>
          )}
          <p className="font-body text-bg/60 mt-3 text-xs tracking-[0.2em] uppercase">
            {formatDate(activeEvent.dateStart)} → {formatDate(activeEvent.dateEnd)}
          </p>
        </div>
      )}
    </section>
  )
}
