// lib/popup.test.ts
import { describe, it, expect, beforeEach } from "vitest"
import { isPopupActiveNow, shouldAutoOpenToday, markSeen, popupId, type Popup } from "./popup"

const sample: Popup = {
  active: true,
  kind: "poster",
  image: "/popup/bassie-goes-mexico.jpg",
  imageAlt: { en: "x", nl: "x", fr: "x" },
  dateStart: "2026-05-11",
  dateEnd: "2026-05-31",
}

describe("popupId", () => {
  it("derives a stable id from image + dateStart", () => {
    expect(popupId(sample)).toBe(popupId({ ...sample }))
    expect(popupId(sample)).not.toBe(popupId({ ...sample, dateStart: "2026-06-01" }))
  })
})

describe("isPopupActiveNow", () => {
  it("returns false if active=false", () => {
    expect(isPopupActiveNow({ ...sample, active: false }, "2026-05-15")).toBe(false)
  })
  it("returns true inside the range", () => {
    expect(isPopupActiveNow(sample, "2026-05-15")).toBe(true)
  })
  it("returns false outside the range", () => {
    expect(isPopupActiveNow(sample, "2026-06-01")).toBe(false)
  })
})

describe("shouldAutoOpenToday + markSeen", () => {
  beforeEach(() => localStorage.clear())

  it("opens on first visit", () => {
    expect(shouldAutoOpenToday("abc", "2026-05-15")).toBe(true)
  })
  it("does not open after markSeen with same id same day", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("abc", "2026-05-15")).toBe(false)
  })
  it("opens again next day", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("abc", "2026-05-16")).toBe(true)
  })
  it("opens again when popup id changes", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("xyz", "2026-05-15")).toBe(true)
  })
})
