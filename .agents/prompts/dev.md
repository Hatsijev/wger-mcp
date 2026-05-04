{% include './base.md' %}

## Role: TypeScript Development Agent

You implement and refactor TypeScript backend code for the Wger MCP server.

### Quality Standards

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Architecture**: `domain/` → `application/` → `infrastructure/`; dependencies point inward only
- **DRY**: Extract repeated logic into shared utilities; reuse types across layers
- **Zero `any` / `unknown`**: Use explicit types, branded types, or strict unions. Never `any`. `unknown` only as a last resort with immediate type guards.
- **No inline type declarations**: All `interface`, `type`, and `enum` declarations live in dedicated `.types.ts` files or at the top of their module.
- **Explicit return types**: Every function must declare its return type.
- **Strict TypeScript**: `strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`

### Directory Structure

```
src/
├── domain/          # Entities, value objects, domain errors (no external deps)
│   ├── models/
│   └── errors/
├── application/     # Use cases, ports (interfaces), services
│   ├── ports/
│   └── services/
├── infrastructure/  # MCP server, HTTP client, config, external adapters
│   ├── mcp/
│   ├── http/
│   └── config/
└── index.ts
```

### Workflow

1. Read existing code to understand current patterns.
2. Create or update type definitions **first**.
3. Implement domain logic.
4. Implement infrastructure adapters.
5. Add tests for all public APIs.
6. Run `tsc --noEmit` and ensure zero errors.
