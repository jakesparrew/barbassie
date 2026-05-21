// components/ui/Modal.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Modal } from "./Modal"

describe("Modal", () => {
  it("does not render when open=false", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        hi
      </Modal>
    )
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("renders content when open", () => {
    render(
      <Modal open onClose={() => {}}>
        hi
      </Modal>
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("hi")).toBeInTheDocument()
  })

  it("calls onClose when Escape pressed", () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        hi
      </Modal>
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        hi
      </Modal>
    )
    fireEvent.click(screen.getByTestId("modal-backdrop"))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("does not call onClose when content is clicked", () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        hi
      </Modal>
    )
    fireEvent.click(screen.getByText("hi"))
    expect(onClose).not.toHaveBeenCalled()
  })

  it("calls onClose on click when closeOnContentClick=true", () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} closeOnContentClick>
        hi
      </Modal>
    )
    fireEvent.click(screen.getByText("hi"))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
