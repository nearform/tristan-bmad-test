export type TodoDto = {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

function getBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv !== undefined && fromEnv !== "") return fromEnv.replace(/\/$/, "");
  return "/api";
}

export async function fetchTodos(): Promise<TodoDto[]> {
  const res = await fetch(`${getBaseUrl()}/todos`);
  if (!res.ok) throw new Error(`Failed to load todos (${res.status})`);
  const data = (await res.json()) as { todos: TodoDto[] };
  return data.todos;
}

export async function createTodo(description: string): Promise<TodoDto> {
  const res = await fetch(`${getBaseUrl()}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? "Could not create todo");
  }
  const data = (await res.json()) as { todo: TodoDto };
  return data.todo;
}

export async function updateTodo(id: string, patch: { completed?: boolean; description?: string }): Promise<TodoDto> {
  const res = await fetch(`${getBaseUrl()}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Could not update todo");
  const data = (await res.json()) as { todo: TodoDto };
  return data.todo;
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Could not delete todo");
}
