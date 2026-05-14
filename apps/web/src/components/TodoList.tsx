import type { TodoDto } from "../api";

export type ListState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; todos: TodoDto[] };

type Props = {
  state: ListState;
  onRetry: () => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function TodoList({ state, onRetry, onToggle, onDelete }: Props) {
  if (state.status === "loading" || state.status === "idle") {
    return (
      <section aria-busy="true" aria-label="Loading todos">
        <p>Loading todos…</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[0, 1, 2].map((i) => (
            <li key={i} style={{ height: "3rem", background: "#f2f2f2", marginBottom: "0.5rem", borderRadius: "4px" }} />
          ))}
        </ul>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section role="alert" style={{ padding: "1rem", border: "1px solid #c62828", borderRadius: "6px" }}>
        <p style={{ marginTop: 0 }}>Could not load todos.</p>
        <p style={{ color: "#555" }}>{state.message}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  if (state.todos.length === 0) {
    return (
      <section aria-label="Todo list empty">
        <h2 style={{ fontSize: "1.1rem" }}>No todos yet</h2>
        <p style={{ color: "#555" }}>Add your first task above.</p>
      </section>
    );
  }

  return (
    <section aria-label="Todo list">
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {state.todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 0",
              borderBottom: "1px solid #eee",
              minHeight: "44px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              aria-label={`Mark "${todo.description}" complete`}
              onChange={(e) => onToggle(todo.id, e.target.checked)}
            />
            <div style={{ flex: 1 }}>
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#777" : "#111",
                }}
              >
                {todo.description}
              </span>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>Created {formatDate(todo.createdAt)}</div>
            </div>
            <button type="button" aria-label={`Delete ${todo.description}`} onClick={() => onDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
