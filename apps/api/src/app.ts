import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { registerHealthRoutes } from "./routes/health.js";
import { registerTodoRoutes } from "./routes/todos.js";

export type CreateAppOptions = {
  prisma: PrismaClient;
  webOrigin: string;
  logger?: boolean;
};

export async function createApp(options: CreateAppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  await app.register(cors, {
    origin: options.webOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  app.decorate("prisma", options.prisma);

  registerHealthRoutes(app);
  registerTodoRoutes(app);

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    if (reply.sent) return;
    reply.status(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    });
  });

  return app;
}

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
