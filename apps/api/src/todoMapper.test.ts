import { describe, expect, it } from "vitest";
import { toTodoDto } from "./todoMapper.js";

describe("toTodoDto", () => {
  it("maps prisma row to dto", () => {
    const created = new Date("2026-01-01T00:00:00.000Z");
    const updated = new Date("2026-01-02T00:00:00.000Z");
    const dto = toTodoDto({
      id: "c1",
      description: "Test",
      completed: false,
      createdAt: created,
      updatedAt: updated,
    });
    expect(dto).toEqual({
      id: "c1",
      description: "Test",
      completed: false,
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
    });
  });
});
