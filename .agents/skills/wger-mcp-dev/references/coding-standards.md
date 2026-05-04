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

## Imports

Order: external → internal (domain → application → infrastructure). Group with newlines.
