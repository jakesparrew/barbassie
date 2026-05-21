// components/ui/LocaleSwitcher.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const push = vi.fn()
vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
  useRouter: () => ({ push, replace: push, refresh: vi.fn() }),
}))
vi.mock("next-intl", () => ({
  useLocale: () => "en",
}))

import { LocaleSwitcher } from "./LocaleSwitcher"

describe("LocaleSwitcher", () => {
  beforeEach(() => push.mockReset())

  it("renders all locales", () => {
    render(<LocaleSwitcher />)
    expect(screen.getByRole("button", { name: /english/i })).toBeInTheDocument()
  })

  it("navigates to /nl when Dutch picked", async () => {
    const user = userEvent.setup()
    render(<LocaleSwitcher />)
    await user.click(screen.getByRole("button", { name: /english/i }))
    await user.click(screen.getByRole("menuitem", { name: /nederlands/i }))
    expect(push).toHaveBeenCalledWith("/nl/about")
  })
})
