import type { Todo as PrismaTodo } from "@prisma/client";

export type TodoDto = {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export function toTodoDto(row: PrismaTodo): TodoDto {
  return {
    id: row.id,
    description: row.description,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
