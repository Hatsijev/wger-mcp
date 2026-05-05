# Wger MCP Server — Agent Guide

## Project Overview

This is a **Model Context Protocol (MCP) server** written in TypeScript (Node.js) that acts as a bridge between AI clients (Claude, Cursor, etc.) and a self-hosted [Wger](https://wger.de) workout and nutrition tracker. It exposes Wger API data as MCP tools and resources, allowing AI assistants to query exercises, routines, nutrition plans, ingredients, workout logs, and more.

**Key characteristics:**

- Runtime: Node.js 20+ (ES modules)
- Transport: MCP over stdio
- API target: Wger REST API v2 (authenticated with Bearer token)
- Architecture: Clean Architecture with strict inward dependencies
- Type safety: TypeScript strict mode, zero `any` / `unknown` policy in application/domain code

## Technology Stack

| Layer         | Technology                                                       |
| ------------- | ---------------------------------------------------------------- |
| Language      | TypeScript 6.x                                                   |
| Runtime       | Node.js 20+                                                      |
| Module system | ESM (`"type": "module"`)                                         |
| MCP SDK       | `@modelcontextprotocol/sdk` ^1.29.0 (high-level `McpServer` API) |
| Validation    | Zod ^4.4.3                                                       |
| Config / env  | `dotenv` ^17.4.2                                                 |
| HTTP client   | Native `fetch` (Node.js built-in)                                |
| Testing       | **None configured yet**                                          |

## Project Structure

```
src/
├── index.ts                           # Entry point: wires config, logger, client, server
├── domain/                            # Pure business logic (no external deps)
│   ├── errors/
│   │   └── WgerError.ts               # WgerError, WgerValidationError, WgerAuthError
│   └── models/
│       ├── Config.types.ts            # Config interface, LogLevel type
│       ├── Exercise.types.ts          # Exercise, Muscle, Equipment, ExerciseInfo, etc.
│       ├── Nutrition.types.ts         # Ingredient, Meal, NutritionPlan, etc.
│       ├── Routine.types.ts           # Routine, Day, Slot, SlotEntry, WorkoutLog, etc.
│       └── Json.types.ts              # JsonValue, JsonObject, JsonArray
├── application/                       # Use cases and ports
│   └── ports/
│       └── Logger.ts                  # Logger interface + LogMeta type
└── infrastructure/                    # External concerns
    ├── ConsoleLogger.ts               # Logger implementation
    ├── config.ts                      # Env var loading + Zod validation
    ├── mcp/
    │   ├── server.ts                  # Creates McpServer, registers all tools/resources
    │   ├── tools/
    │   │   ├── exercises.ts           # Exercise read tools
    │   │   ├── routines.ts            # Routine/workout read + write tools
    │   │   └── nutrition.ts           # Nutrition read + write tools
    │   └── resources/
    │       ├── exercises.ts           # Exercise read resources
    │       ├── routines.ts            # Routine/workout read resources
    │       └── nutrition.ts           # Nutrition read resources
    └── wger/
        ├── WgerClient.ts              # Typed HTTP client for Wger API
        └── types.ts                   # WgerPaginatedResponse, WgerStatusResponse
```

Additional files:

- `wger.yaml` — Wger OpenAPI 3.0.3 spec (~438KB, 16K+ lines). Reference for endpoint paths, request/response schemas, and parameter names.
  **CRITICAL: This file is too large to read entirely (~438KB, exceeds the 200KB view limit). You MUST read it piece by piece using `sed -n 'START,ENDp'` via bash or `grep -n` to find line numbers first, then view specific ranges. Never rely on agent summaries or assumptions — always verify endpoint paths, HTTP methods, request schemas, response schemas, and field constraints directly from the spec.**
- `docs/` — Human-readable API docs (`api/workouts.md`, `api/nutrition.md`), architecture docs, and ADRs.
- `.agents/` — Agent orchestration configs, prompts, and skills for this project.

## Build and Run Commands

```bash
# Install dependencies
npm install

# Build (compile src/ → dist/)
npm run build

# Watch mode for development
npm run dev

# Type check without emitting
npm run lint

# Run the built server
npm start
```

## Environment Variables

| Variable                   | Required | Default | Description                         |
| -------------------------- | -------- | ------- | ----------------------------------- |
| `WGER_BASE_URL`            | Yes      | —       | URL of the Wger instance            |
| `WGER_API_TOKEN`           | Yes      | —       | API auth token                      |
| `WGER_LANGUAGE`            | No       | —       | Default language code               |
| `LOG_LEVEL`                | No       | `info`  | `debug` / `info` / `warn` / `error` |
| `ENABLE_DESTRUCTIVE_TOOLS` | No       | `false` | Enable delete operations            |
| `ENABLE_ADMIN_TOOLS`       | No       | `false` | Enable auth/admin operations        |
| `ENABLE_RAW_WGER_PROXY`    | No       | `false` | Enable raw HTTP proxy tool          |

Create a `.env` file or export variables directly. Config is validated with Zod on startup; missing required vars cause immediate failure with a descriptive message.

## Code Style Guidelines

### TypeScript Rules

- `strict: true`, `exactOptionalPropertyTypes: true`, `noImplicitAny: true`
- **Zero `any`** in application and domain code. Use `unknown` only as a last resort with immediate type guards.
- **Explicit return types** on all functions, ports, and public APIs.
- **No implicit returns**: every branch must be explicit.
- All types/interfaces/enums live in dedicated `.types.ts` files (or at the top of a module).
- Prefer branded types for IDs when values cross application boundaries.

### Naming

- `PascalCase` for types, interfaces, classes, enums
- `camelCase` for variables, functions, methods
- `SCREAMING_SNAKE_CASE` for constants

### Imports

Order: external → internal (domain → application → infrastructure). Group with newlines.

### Zod Schemas

Prefer shared primitives for common validations:

```typescript
const positiveIntegerIdSchema = z.number().int().positive();
const paginationLimitSchema = z.number().int().min(1).max(100);
```

Use `.min(1)` for required non-empty text. Add `.max(...)` for user-controlled strings.

### MCP Tool/Resource Patterns

- Tool handlers should be small: validate input → call service/adapter → return envelope.
- Success envelope: `{ ok: true, data }`
- Failure envelope: `{ ok: false, error: message }` with `isError: true`
- Register mutating tools only when their feature gate allows them.
- Destructive/admin/proxy tools must be **absent when disabled**, not merely documented as disabled.
- Prefer `PATCH` for partial updates unless Wger requires `PUT`; document intentional full replacements.

## Architecture Principles

**Clean Architecture** — dependencies point inward only:

1. **Domain** (inner): pure models and errors. Knows nothing about MCP or HTTP.
2. **Application** (middle): ports (e.g., `Logger`) and use-case orchestration.
3. **Infrastructure** (outer): MCP server, HTTP client, config loader, console logger.

**Key boundary rules:**

- Treat every MCP argument as untrusted input. Validate with Zod before entering the domain.
- Infrastructure maps HTTP errors to `WgerError` hierarchy. Domain code deals only with domain errors.
- Do not let infrastructure details (e.g., `fetch`, MCP SDK types) leak into domain or application layers.

## Error Handling

The `WgerClient` catches network errors and maps HTTP failures:

- `401` → `WgerAuthError`
- Other HTTP errors → `WgerError` with `statusCode`
- Network failures → `WgerError` with original cause
- JSON parse failures → `WgerError`

**Current inconsistency to be aware of:**

- `src/infrastructure/mcp/tools/exercises.ts` lets errors bubble up to the MCP SDK (no per-handler try/catch).
- `src/infrastructure/mcp/tools/routines.ts` and `nutrition.ts` wrap each handler in inline try/catch blocks.
- The project goal is to use shared async wrappers so success/failure envelopes do not drift between domains.

## Security Considerations

- **Never log API tokens.** `WgerClient` logs method, URL, and status only.
- **Do not log full Wger error bodies by default** — they may contain sensitive health or workout data.
- **Feature gates** protect destructive operations:
  - `ENABLE_DESTRUCTIVE_TOOLS` — delete operations
  - `ENABLE_ADMIN_TOOLS` — auth/admin operations
  - `ENABLE_RAW_WGER_PROXY` — raw HTTP proxy
- All external inputs are validated with Zod before use.
- Bound large user-controlled strings (images, descriptions, config payloads).

## Testing

**Status: no test framework is currently configured.** There are no `.test.ts` or `.spec.ts` files in the project.

When adding tests, the expected approach is:

- Add a test runner (e.g., Vitest or Node.js built-in test runner).
- Write focused tests for all public tool handlers and `WgerClient` methods.
- Mock the Wger API at the `fetch` boundary.
- Run `npm run build` and `npm run lint` (and tests when available) after changes.

## Development Workflow

1. Read existing code to understand patterns.
2. Create/update type definitions first (`.types.ts`).
3. Implement core/domain logic.
4. Implement infrastructure adapters (tools, resources, client methods).
5. Register new tools/resources in `src/infrastructure/mcp/server.ts`.
6. Run `npm run build` to verify zero compiler errors.
7. Compare paths, methods, request schemas, and response schemas against `wger.yaml`.
8. Update docs in `docs/api/` if adding new endpoints.

## Key Files for Reference

| File                                                         | Purpose                                             |
| ------------------------------------------------------------ | --------------------------------------------------- |
| `wger.yaml`                                                  | Source of truth for Wger API endpoints and schemas  |
| `tsconfig.json`                                              | Strict compiler options                             |
| `package.json`                                               | Scripts and dependencies                            |
| `src/infrastructure/mcp/server.ts`                           | Central registration point for all MCP capabilities |
| `src/infrastructure/wger/WgerClient.ts`                      | All HTTP calls go through here                      |
| `src/domain/errors/WgerError.ts`                             | Error hierarchy used across the codebase            |
| `.agents/skills/wger-mcp-dev/SKILL.md`                       | Detailed dev skill with SOLID/DRY/MCP rules         |
| `.agents/skills/wger-mcp-dev/references/coding-standards.md` | Naming, types, async, Zod, logging standards        |
| `docs/architecture.md`                                       | C4 diagrams and layer diagrams                      |
| `docs/decisions/`                                            | ADRs for TypeScript strict mode and MCP SDK choice  |

## MCP Client Configuration Example

```json
{
  "mcpServers": {
    "wger": {
      "command": "node",
      "args": ["/path/to/wger-mcp/dist/index.js"],
      "env": {
        "WGER_BASE_URL": "https://your-wger-instance.com",
        "WGER_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Roadmap Context

The project is organized around milestones:

1. **Bootstrap + Config + Read-Only Reference Data** — largely complete (exercises, muscles, equipment, categories)
2. **Workout / Routine / Body Weight** — largely complete (routines, days, slots, slot entries, logs, sessions, weight entries, gallery)
3. **Nutrition** — largely complete (ingredients, meals, meal items, nutrition plans, nutrition diary)
4. **Remaining Coverage + Safe Writes** — not yet started (measurements, exercise translations/aliases/comments/images/videos, templates, trophies, config endpoints, languages, licenses, units)
5. **Gated + Admin + Polish** — not yet started (delete tools, admin tools, raw proxy, tests)

When implementing new domains, follow the existing file organization: create domain types, then add tool/resource files under `src/infrastructure/mcp/tools/` and `src/infrastructure/mcp/resources/`, and register them in `src/infrastructure/mcp/server.ts`.
