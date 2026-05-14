import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddTodoForm } from "./AddTodoForm";

describe("AddTodoForm", () => {
  it("shows validation when empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/Enter a task description/i);
    expect(onAdd).not.toHaveBeenCalled();
  });
});
