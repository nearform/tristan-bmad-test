import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { toTodoDto } from "../todoMapper.js";

const createBody = z.object({
  description: z.string().trim().min(1).max(500),
});

const patchBody = z
  .object({
    description: z.string().trim().min(1).max(500).optional(),
    completed: z.boolean().optional(),
  })
  .refine((b) => b.description !== undefined || b.completed !== undefined, {
    message: "At least one of description or completed is required",
  });

export function registerTodoRoutes(app: FastifyInstance): void {
  app.get("/todos", async () => {
    const rows = await app.prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { todos: rows.map(toTodoDto) };
  });

  app.post<{ Body: unknown }>("/todos", async (request, reply) => {
    const parsed = createBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: { fieldErrors: parsed.error.flatten().fieldErrors },
        },
      });
    }
    const row = await app.prisma.todo.create({
      data: { description: parsed.data.description },
    });
    return reply.status(201).send({ todo: toTodoDto(row) });
  });

  app.patch<{ Params: { id: string }; Body: unknown }>("/todos/:id", async (request, reply) => {
    const parsed = patchBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: { fieldErrors: parsed.error.flatten().fieldErrors },
        },
      });
    }
    const existing = await app.prisma.todo.findUnique({ where: { id: request.params.id } });
    if (!existing) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Todo not found" },
      });
    }
    const row = await app.prisma.todo.update({
      where: { id: request.params.id },
      data: {
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.completed !== undefined ? { completed: parsed.data.completed } : {}),
      },
    });
    return { todo: toTodoDto(row) };
  });

  app.delete<{ Params: { id: string } }>("/todos/:id", async (request, reply) => {
    const result = await app.prisma.todo.deleteMany({ where: { id: request.params.id } });
    if (result.count === 0) {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Todo not found" },
      });
    }
    return reply.status(204).send();
  });
}
