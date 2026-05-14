import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  it("shows loading skeleton", () => {
    render(<TodoList state={{ status: "loading" }} onRetry={() => {}} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Loading todos/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<TodoList state={{ status: "ready", todos: [] }} onRetry={() => {}} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it("shows error with retry", () => {
    const onRetry = vi.fn();
    render(
      <TodoList
        state={{ status: "error", message: "boom" }}
        onRetry={onRetry}
        onToggle={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText(/boom/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders todos and toggles", () => {
    const onToggle = vi.fn();
    render(
      <TodoList
        state={{
          status: "ready",
          todos: [
            {
              id: "1",
              description: "Task",
              completed: false,
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        }}
        onRetry={() => {}}
        onToggle={onToggle}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("Task")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("1", true);
  });
});
