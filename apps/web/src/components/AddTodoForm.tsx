import { FormEvent, useState } from "react";

type Props = {
  onAdd: (description: string) => Promise<void>;
  disabled?: boolean;
};

export function AddTodoForm({ onAdd, disabled }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Enter a task description.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await onAdd(trimmed);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add todo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} style={{ marginBottom: "1.25rem" }}>
      <label htmlFor="new-todo" className="sr-only">
        New todo description
      </label>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          id="new-todo"
          name="description"
          type="text"
          maxLength={500}
          placeholder="What needs doing?"
          value={value}
          disabled={disabled || busy}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          style={{ flex: "1 1 12rem", padding: "0.5rem 0.75rem", fontSize: "1rem" }}
        />
        <button type="submit" disabled={disabled || busy} style={{ padding: "0.5rem 1rem" }}>
          {busy ? "Adding…" : "Add"}
        </button>
      </div>
      {error ? (
        <p role="alert" style={{ color: "#b00020", marginTop: "0.5rem", marginBottom: 0 }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
