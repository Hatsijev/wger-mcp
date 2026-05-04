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
- **Runtime validation**: Zod schemas validate MCP inputs and any external response shape that affects control flow or public guarantees.
- **Security by default**: Read-only tools are default-safe; write, delete, admin, and raw proxy behavior require explicit config gates.
- **Consistent MCP contracts**: Tool handlers must return a consistent `{ ok: true, data }` or `{ ok: false, error }` shape and set MCP error metadata consistently.

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

### Implementation Rules

- Do not add another large hand-written handler block when a shared helper or endpoint descriptor would remove repeated MCP response/error logic.
- Prefer `PATCH` for partial update semantics. Use `PUT` only when full replacement is intentional and documented.
- Validate numeric IDs as positive integers. Validate pagination with sane bounds. Validate dates/times with explicit formats.
- Never log full Wger error bodies by default. Redact or summarize sensitive data.
- Add request timeouts for network calls when touching HTTP infrastructure.
- Keep application behavior out of MCP transport registration where practical. MCP handlers should adapt inputs/outputs; use application services for use cases.

### Verification Gate

Before reporting success, run the strongest available checks:

- `npm run build`
- `npm run lint` when present
- `npm test` when present
- targeted tests for changed behavior

If a required check cannot run or does not exist, state that explicitly and treat it as remaining risk.
