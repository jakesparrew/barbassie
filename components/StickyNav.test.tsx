// components/StickyNav.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => "en",
}))
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}))

import { StickyNav } from "./StickyNav"

describe("StickyNav", () => {
  it("renders three pills (menu, reservation, happening) and locale switcher", () => {
    render(<StickyNav />)
    expect(screen.getByText("menu")).toBeInTheDocument()
    expect(screen.getByText("reservation")).toBeInTheDocument()
    expect(screen.getByText("happening")).toBeInTheDocument()
  })

  it("the happening pill anchors to the #events section", () => {
    render(<StickyNav />)
    const happening = screen.getByText("happening").closest("a")
    expect(happening).toHaveAttribute("href", "#events")
  })
})
