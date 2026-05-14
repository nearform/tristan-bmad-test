import { useCallback, useEffect, useState } from "react";
import type { TodoDto } from "./api";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";
import { AddTodoForm } from "./components/AddTodoForm";
import { TodoList } from "./components/TodoList";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; todos: TodoDto[] };

export default function App() {
  const [state, setState] = useState<LoadState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const todos = await fetchTodos();
      setState({ status: "ready", todos });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async (description: string) => {
    const todo = await createTodo(description);
    setState((s) => {
      if (s.status !== "ready") return { status: "ready", todos: [todo] };
      return { status: "ready", todos: [todo, ...s.todos] };
    });
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const updated = await updateTodo(id, { completed });
    setState((s) => {
      if (s.status !== "ready") return s;
      return {
        status: "ready",
        todos: s.todos.map((t) => (t.id === updated.id ? updated : t)),
      };
    });
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setState((s) => {
      if (s.status !== "ready") return s;
      return { status: "ready", todos: s.todos.filter((t) => t.id !== id) };
    });
  };

  return (
    <main style={{ maxWidth: "36rem", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Todos</h1>
      <p style={{ color: "#555", marginTop: 0 }}>Personal tasks — simple and fast.</p>
      <AddTodoForm onAdd={handleAdd} disabled={state.status === "loading"} />
      <TodoList
        state={state}
        onRetry={() => void load()}
        onToggle={(id, completed) => void handleToggle(id, completed)}
        onDelete={(id) => void handleDelete(id)}
      />
    </main>
  );
}
