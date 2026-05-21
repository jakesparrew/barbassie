// components/ui/SectionLabel.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionLabel } from "./SectionLabel"

describe("SectionLabel", () => {
  it("renders as an h2 with accent color", () => {
    render(<SectionLabel>MENU</SectionLabel>)
    const h2 = screen.getByRole("heading", { level: 2, name: "MENU" })
    expect(h2).toHaveClass("text-accent")
  })
})
