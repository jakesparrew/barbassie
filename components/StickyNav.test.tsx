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
    render(<StickyNav onHappeningClick={() => {}} />)
    expect(screen.getByText("menu")).toBeInTheDocument()
    expect(screen.getByText("reservation")).toBeInTheDocument()
    expect(screen.getByText("happening")).toBeInTheDocument()
  })
})
