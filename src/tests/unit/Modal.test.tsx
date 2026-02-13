import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("renderiza quando open=true e fecha com Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Test modal" onClose={onClose}>
        <div>Conteúdo</div>
      </Modal>
    );

    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

