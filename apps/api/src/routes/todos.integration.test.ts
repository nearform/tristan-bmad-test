import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";

const prisma = new PrismaClient();

describe("todo routes", () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp({
      prisma,
      webOrigin: "http://localhost:5173",
      logger: false,
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  it("POST /todos validates body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/todos",
      payload: { description: "" },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /todos creates todo", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/todos",
      payload: { description: "Buy milk" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.todo.description).toBe("Buy milk");
    expect(body.todo.completed).toBe(false);
    expect(body.todo.id).toBeTruthy();
  });

  it("GET /todos returns newest first", async () => {
    await prisma.todo.create({ data: { description: "older" } });
    await new Promise((r) => setTimeout(r, 5));
    await prisma.todo.create({ data: { description: "newer" } });
    const res = await app.inject({ method: "GET", url: "/todos" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.todos.map((t: { description: string }) => t.description)).toEqual(["newer", "older"]);
  });

  it("PATCH /todos/:id toggles completed", async () => {
    const row = await prisma.todo.create({ data: { description: "x" } });
    const res = await app.inject({
      method: "PATCH",
      url: `/todos/${row.id}`,
      payload: { completed: true },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).todo.completed).toBe(true);
  });

  it("PATCH /todos/:id returns 404 when missing", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: "/todos/does-not-exist",
      payload: { completed: true },
    });
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /todos/:id removes todo", async () => {
    const row = await prisma.todo.create({ data: { description: "gone" } });
    const res = await app.inject({ method: "DELETE", url: `/todos/${row.id}` });
    expect(res.statusCode).toBe(204);
    const count = await prisma.todo.count();
    expect(count).toBe(0);
  });

  it("DELETE /todos/:id returns 404 when missing", async () => {
    const res = await app.inject({ method: "DELETE", url: "/todos/nope" });
    expect(res.statusCode).toBe(404);
  });
});
