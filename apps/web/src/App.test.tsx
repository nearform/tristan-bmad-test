import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as api from "./api";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads todos on mount", async () => {
    vi.spyOn(api, "fetchTodos").mockResolvedValue([
      {
        id: "a",
        description: "One",
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
    vi.spyOn(api, "createTodo").mockImplementation(async (d) => ({
      id: "b",
      description: d,
      completed: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }));
    vi.spyOn(api, "updateTodo").mockImplementation(async (id, p) => ({
      id,
      description: "One",
      completed: p.completed ?? false,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }));
    vi.spyOn(api, "deleteTodo").mockResolvedValue();

    render(<App />);
    await waitFor(() => expect(screen.getByText("One")).toBeInTheDocument());

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/What needs doing/i), "Two");
    await user.click(screen.getByRole("button", { name: /^Add$/i }));
    await waitFor(() => expect(screen.getByText("Two")).toBeInTheDocument());
  });
});
