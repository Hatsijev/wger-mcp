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

## Workflow

1. Read existing code to understand patterns
2. Create/update type definitions first
3. Implement core/domain logic
4. Implement infrastructure adapters
5. Add tests for all public APIs
6. Run TypeScript compiler to verify zero errors

## References

- [Architecture Patterns](references/architecture.md)
- [Coding Standards](references/coding-standards.md)
