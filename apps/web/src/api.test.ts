import { afterEach, describe, expect, it, vi } from "vitest";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";

const sampleTodo = {
  id: "1",
  description: "x",
  completed: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fetchTodos returns list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ todos: [sampleTodo] }),
      }),
    );
    const todos = await fetchTodos();
    expect(todos).toEqual([sampleTodo]);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/todos$/));
  });

  it("fetchTodos throws on error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );
    await expect(fetchTodos()).rejects.toThrow(/500/);
  });

  it("createTodo parses response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ todo: sampleTodo }),
      }),
    );
    const todo = await createTodo("x");
    expect(todo).toEqual(sampleTodo);
  });

  it("createTodo surfaces API message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "bad" } }),
      }),
    );
    await expect(createTodo("x")).rejects.toThrow("bad");
  });

  it("updateTodo returns todo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ todo: { ...sampleTodo, completed: true } }),
      }),
    );
    const t = await updateTodo("1", { completed: true });
    expect(t.completed).toBe(true);
  });

  it("deleteTodo accepts 204", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      }),
    );
    await expect(deleteTodo("1")).resolves.toBeUndefined();
  });
});
