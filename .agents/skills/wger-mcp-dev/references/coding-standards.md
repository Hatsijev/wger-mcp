# Coding Standards

## Naming

- `PascalCase` for types, interfaces, classes, enums
- `camelCase` for variables, functions, methods
- `SCREAMING_SNAKE_CASE` for constants
- Suffix interfaces with meaningful descriptors (e.g., `Repository`, `Config`)

## Types

All types in dedicated files:

```typescript
// user.types.ts
export interface User {
  readonly id: UserId;
  readonly username: string;
}

export type UserId = string & { __brand: "UserId" };
```

Branded types for IDs to prevent mixing up different string IDs.

For Wger numeric IDs, prefer a branded positive integer type when values cross application boundaries. At MCP boundaries, parse with Zod before branding.

Avoid generic type assertions for external data. If a response shape matters to public behavior, validate it.

## Functions

Always explicit:

```typescript
// Good
export function parseUser(data: unknown): Result<User, ParseError> {
  // ...
}

// Bad
export function parseUser(data) { ... }
```

## Async

Use `Result<T, E>` pattern or explicit try/catch at boundaries. Never let errors leak implicitly.

Use shared async wrappers for MCP tools so success and failure envelopes do not drift between domains.

Network calls must have a timeout strategy when touching HTTP client code.

## Imports

Order: external → internal (domain → application → infrastructure). Group with newlines.

## Zod Schemas

Prefer shared schema primitives:

```typescript
const positiveIntegerIdSchema = z.number().int().positive();
const paginationLimitSchema = z.number().int().min(1).max(100);
const paginationOffsetSchema = z.number().int().min(0);
```

Use `.min(1)` for required non-empty text. Add `.max(...)` for user-controlled strings. Use explicit date/time validation instead of plain `z.string()` for fields expected to be dates or times.

Avoid `z.custom<T>()` unless it includes a real predicate. For JSON values, use a recursive JSON schema helper.

## MCP Tool Handlers

Handlers should be small and regular:

1. Validate input through the registered schema.
2. Call one service or endpoint adapter.
3. Return the shared success envelope.
4. Let the shared wrapper convert errors.

Do not repeat large try/catch blocks in every handler.

## Logging

Logs should help diagnose method, path, status, and operation. They should not include API tokens, request bodies, full response bodies, or sensitive user health data unless explicitly redacted and justified.
