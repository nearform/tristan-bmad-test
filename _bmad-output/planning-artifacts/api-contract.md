# REST API Contract: Todos Service

Base URL: `/` (no version prefix for v1). All bodies JSON; charset UTF-8.

## Health

### `GET /health`

Liveness: does not require database.

**200 OK**

```json
{ "status": "ok" }
```

### `GET /ready`

Readiness: verifies database connectivity.

**200 OK**

```json
{ "status": "ready" }
```

**503 Service Unavailable**

```json
{ "error": { "code": "SERVICE_UNAVAILABLE", "message": "Database not reachable" } }
```

## Todos

### `GET /todos`

List all todos, newest first (`createdAt` descending).

**200 OK**

```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "description": "Buy milk",
      "completed": false,
      "createdAt": "2026-05-14T12:00:00.000Z",
      "updatedAt": "2026-05-14T12:00:00.000Z"
    }
  ]
}
```

### `POST /todos`

Create todo.

**Request body**

```json
{ "description": "string, 1-500 chars after trim" }
```

**201 Created**

```json
{
  "todo": {
    "id": "...",
    "description": "...",
    "completed": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**400 Bad Request** — validation failure

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": { "fieldErrors": { "description": ["..."] } } } }
```

### `PATCH /todos/:id`

Partial update. v1 supports toggling completion via `{ "completed": true }` or updating description via `{ "description": "..." }`.

**Request body** (at least one field)

```json
{ "completed": true }
```

**200 OK** — `{ "todo": { ... } }`

**400** — invalid body  
**404** — `{ "error": { "code": "NOT_FOUND", "message": "Todo not found" } }`

### `DELETE /todos/:id`

**204 No Content** on success.

**404** — not found.

## Error envelope (common)

| HTTP | code (examples) |
|------|-----------------|
| 400 | VALIDATION_ERROR |
| 404 | NOT_FOUND |
| 500 | INTERNAL_ERROR |

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## CORS

- Allowed methods: `GET`, `POST`, `PATCH`, `DELETE`, `OPTIONS`
- Allowed headers: `Content-Type`
- `Access-Control-Allow-Origin`: single origin from `WEB_ORIGIN` env
