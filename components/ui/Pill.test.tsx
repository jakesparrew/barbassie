import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pill } from "./Pill"

describe("Pill", () => {
  it("renders as <a> when href is provided", () => {
    render(<Pill href="#menu">Menu</Pill>)
    const el = screen.getByRole("link", { name: "Menu" })
    expect(el.tagName).toBe("A")
    expect(el).toHaveAttribute("href", "#menu")
  })

  it("renders as <button> when no href", () => {
    render(<Pill onClick={() => {}}>Happening</Pill>)
    const el = screen.getByRole("button", { name: "Happening" })
    expect(el.tagName).toBe("BUTTON")
  })

  it("applies the magenta accent class", () => {
    render(<Pill href="#x">X</Pill>)
    expect(screen.getByRole("link")).toHaveClass("bg-accent")
  })
})
