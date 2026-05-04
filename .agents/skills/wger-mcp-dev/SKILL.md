---
name: wger-mcp-dev
description: TypeScript backend development for the Wger MCP server. Use when implementing, modifying, or refactoring TypeScript code for the MCP server, API clients, models, or any backend logic. Enforces SOLID principles, clean architecture, DRY, strict typing with no any or unknown, and explicit type declarations. Triggers for all code tasks in the Wger MCP project.
---

# Wger MCP TypeScript Development

## Architecture

Follow Clean Architecture principles:

- **Core/Domain**: Pure business logic, no external dependencies
- **Application**: Use cases, orchestrates domain objects
- **Infrastructure**: External concerns (HTTP clients, MCP transport, logging)
- Dependencies point inward only

For this project, MCP tool registration is transport code. Keep transport handlers thin: validate input, call an application service or endpoint adapter, then format the MCP response. Do not keep growing large tool files with repeated request/error boilerplate when a shared abstraction would be clearer.

## TypeScript Rules

- **No `any`**: Use `unknown` only as a last resort with immediate type guards
- **No `unknown`**: Prefer explicit types, branded types, or strict unions
- **No inline type declarations**: All types, interfaces, and enums in dedicated `.types.ts` files or top of module
- **Explicit return types**: All functions must declare return types
- **No implicit returns**: Every branch must be explicit
- **Strict mode**: `strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`

## SOLID Enforcement

- **Single Responsibility**: One reason to change per class/module
- **Open/Closed**: Extend behavior via composition/inheritance, don't modify existing code
- **Liskov Substitution**: Subtypes must be substitutable
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

## DRY

- Extract repeated logic into shared utilities
- Reuse type definitions across layers
- Centralize error handling patterns

## MCP Boundary Rules

- Treat every MCP argument as untrusted input.
- Use reusable schema primitives for positive integer IDs, bounded pagination, ISO dates, time strings, bounded text, and bounded payloads.
- Return a consistent tool envelope: `{ ok: true, data }` on success and `{ ok: false, error }` on failure.
- Set MCP error metadata consistently for failures.
- Register mutating tools only when their feature gate allows them.
- Destructive, admin, and raw proxy tools require separate gates and should be absent when disabled, not merely documented as disabled.
- Prefer `PATCH` for partial updates unless Wger requires `PUT`; document intentional full replacements.

## Security Rules

- Never log API tokens.
- Do not log full Wger error bodies by default; they can contain sensitive workout, nutrition, weight, or gallery data.
- Add timeouts to HTTP calls when changing client infrastructure.
- Bound large user-controlled strings, especially images and arbitrary JSON-like config payloads.
- Avoid raw proxy functionality until allowlists, method restrictions, and response redaction are designed.

## Verification Rules

- `npm run build` is mandatory after code changes.
- Run `npm run lint` and `npm test` when available.
- If tests do not exist for changed public behavior, add focused tests or report the gap as unfinished risk.
- For endpoint work, compare paths, methods, request schemas, and response schemas against `wger.yaml`.

## Workflow

1. Read existing code to understand patterns
2. Create/update type definitions first
3. Implement core/domain logic
4. Implement infrastructure adapters
5. Add tests for all public APIs
6. Run TypeScript compiler to verify zero errors
7. Report changed files, verification commands, and remaining risks

## References

- [Architecture Patterns](references/architecture.md)
- [Coding Standards](references/coding-standards.md)
