import { describe, it, expect } from "vitest"
import { cn } from "./cn"

describe("cn", () => {
  it("joins string classes", () => {
    expect(cn("a", "b")).toBe("a b")
  })
  it("filters falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b")
  })
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
