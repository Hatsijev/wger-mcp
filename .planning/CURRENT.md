# Current Plan — Wger MCP Server

## Objective

Build a complete TypeScript MCP server for the self-hosted Wger workout/fitness tracker API.

## Context

- `wger.yaml` (OpenAPI 3.0.3, 255 endpoints, 60 groups, 210 schemas) is in the project root.
- `docs/ENDPOINT_INVENTORY.md` contains the full endpoint analysis + MCP mapping.
- `ROADMAP.md` contains the 5-milestone roadmap.

## Architecture

AI client → Wger MCP Server → Wger API

Clean Architecture: `domain/` → `application/` → `infrastructure/`

## Quality Rules

- TypeScript `strict: true`, zero `any`, zero `unknown`, zero inline types
- SOLID principles, DRY
- All types in dedicated `.types.ts` files
- Explicit return types on every function
- Zod for all input validation

## Environment Variables

- `WGER_BASE_URL`
- `WGER_API_TOKEN`
- `WGER_LANGUAGE` (optional)
- `LOG_LEVEL` (optional, default `info`)
- `ENABLE_DESTRUCTIVE_TOOLS=false`
- `ENABLE_ADMIN_TOOLS=false`
- `ENABLE_RAW_WGER_PROXY=false`

## Milestones

### Milestone 1: Bootstrap + Config + Read-Only Reference Data

#### Task 1.1 — Project Bootstrap

**Assignee:** dev

- Create `package.json` (type: module, ES2022, Node16 resolution)
- Create `tsconfig.json` with `strict: true`, `exactOptionalPropertyTypes: true`, `noImplicitReturns: true`
- Install deps: `@modelcontextprotocol/sdk`, `zod`, `dotenv`
- Install devDeps: `typescript`, `@types/node`
- Create directory structure: `src/domain/`, `src/application/`, `src/infrastructure/`

#### Task 1.2 — Domain Layer

**Assignee:** dev

- `src/domain/errors/WgerError.ts` — error hierarchy with typed codes
- `src/domain/models/Config.types.ts` — `Config` interface
- `src/application/ports/Logger.ts` — `Logger` port interface

#### Task 1.3 — Infrastructure Layer

**Assignee:** dev

- `src/infrastructure/config.ts` — parse env vars with Zod, return `Config`
- `src/infrastructure/wger/WgerClient.ts` — authenticated HTTP client with typed methods
- `src/infrastructure/wger/types.ts` — generic Wger API response types (paginated, single, error)

#### Task 1.4 — MCP Server Wiring

**Assignee:** dev

- `src/infrastructure/mcp/server.ts` — create `McpServer`, register capabilities
- `src/index.ts` — bootstrap: load config, create WgerClient, start MCP server via stdio

#### Task 1.5 — Read-Only Exercise Domain Tools

**Assignee:** dev

- `list_exercises` — list with pagination, filtering by category/equipment/muscle/language
- `get_exercise` — get single exercise by ID
- `search_exercises` — search by name/description
- `list_muscles` — list all muscles
- `list_equipment` — list all equipment
- `list_exercise_categories` — list all categories
- `get_wger_status` — verify connectivity to Wger instance
- Register corresponding MCP resources: `wger://exercises`, `wger://exercises/{id}`, `wger://muscles`, `wger://equipment`, `wger://categories`

#### Task 1.6 — Build Verification

**Assignee:** dev

- Run `npm run build` (tsc)
- Verify zero TypeScript errors
- Verify zero `any` or `unknown` usage in output

#### Task D.1 — Documentation Update

**Assignee:** docs

- Update `docs/architecture.md` with Mermaid C4/flow diagrams
- Create `docs/decisions/ADR-001-typescript-strict.md`
- Update `docs/development.md` with setup and build instructions

### Milestone 2: Workout / Routine / Body Weight / Gallery ✅

#### Task 2.1 — Routine Domain Types and Read Tools

**Assignee:** dev

- Read `wger.yaml` schemas for Routine, Day, Slot, SlotEntry, WorkoutLog, WorkoutSession, WeightEntry, Gallery
- Create `src/domain/models/Routine.types.ts` with all relevant interfaces
- Implement read-only tools: `list_routines`, `get_routine`, `list_days`, `get_day`, `list_slots`, `get_slot`, `list_slot_entries`, `get_slot_entry`
- Implement read-only tools: `list_workout_logs`, `get_workout_log`, `list_workout_sessions`, `get_workout_session`
- Implement read-only tools: `list_weight_entries`, `get_weight_entry`, `list_gallery_images`, `get_gallery_image`
- Register corresponding MCP resources

#### Task 2.2 — Routine Special Endpoints

**Assignee:** dev

- Implement read-only tools for routine special endpoints:
  - `get_routine_structure`
  - `get_routine_logs`
  - `get_routine_stats`
  - `get_routine_date_sequence_display`
  - `get_routine_date_sequence_gym`

#### Task 2.3 — Safe Write Tools (Create/Update)

**Assignee:** dev

- Implement create/update tools (NOT delete):
  - `create_routine`, `update_routine`
  - `create_day`, `update_day`
  - `create_slot`, `update_slot`
  - `create_slot_entry`, `update_slot_entry`
  - `create_workout_log`, `update_workout_log`
  - `create_workout_session`, `update_workout_session`
  - `create_weight_entry`, `update_weight_entry`
  - `create_gallery_image`, `update_gallery_image`
- All write tools must validate inputs with Zod
- Return structured `{ ok: true, data }` or `{ ok: false, error }`

#### Task 2.4 — Build Verification

**Assignee:** dev

- Run `npm run build`
- Verify zero TypeScript errors
- Verify zero `any` or `unknown`

#### Task D.2 — Documentation Update

**Assignee:** docs

- Update `docs/api/` with workout/routine/weight/gallery endpoint docs
- Create `docs/decisions/ADR-002-mcp-server-api.md` documenting the choice of McpServer over Server

### Milestone 3: Nutrition

_(Pending Milestone 2 completion)_

### Milestone 4: Remaining Coverage + Safe Writes

_(Pending Milestone 3 completion)_

### Milestone 5: Gated + Admin + Polish

_(Pending Milestone 4 completion)_

## Orchestrator Instructions

1. Read this file before every request.
2. Delegate each numbered task to the appropriate subagent (`dev` or `docs`).
3. Milestone 1 is complete. Execute Milestone 2 tasks in order: 2.1 → 2.2 → 2.3 → 2.4 → D.2
4. Wait for each task to complete before delegating the next.
5. Report a concise summary to the user after each task.
6. If a task fails, stop and ask the user for direction before continuing.
