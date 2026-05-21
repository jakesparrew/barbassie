// lib/dates.test.ts
import { describe, it, expect } from "vitest"
import { todayBrussels, isWithinRange, toIsoDate } from "./dates"

describe("dates", () => {
  it("todayBrussels returns YYYY-MM-DD string", () => {
    const d = todayBrussels()
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("toIsoDate formats a Date in Europe/Brussels", () => {
    // 2026-05-21T22:00Z is already 2026-05-22 in Brussels (UTC+2)
    expect(toIsoDate(new Date("2026-05-21T22:00:00Z"))).toBe("2026-05-22")
  })

  it("isWithinRange — start <= d <= end", () => {
    expect(isWithinRange("2026-05-15", "2026-05-11", "2026-05-31")).toBe(true)
    expect(isWithinRange("2026-05-11", "2026-05-11", "2026-05-31")).toBe(true) // start inclusive
    expect(isWithinRange("2026-05-31", "2026-05-11", "2026-05-31")).toBe(true) // end inclusive
    expect(isWithinRange("2026-06-01", "2026-05-11", "2026-05-31")).toBe(false)
    expect(isWithinRange("2026-05-10", "2026-05-11", "2026-05-31")).toBe(false)
  })
})
