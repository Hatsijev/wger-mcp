# Wger MCP Implementation Audit

Date: 2026-05-05

## Scope

Review of the current TypeScript MCP server implementation after the Milestone 1-3 fixes. Scope covers `.planning/CURRENT.md`, `AGENTS.md`, current source code, `wger.yaml`, package scripts, and verification commands.

Archived previous audit snapshot:

- `.archive/AUDIT-2026-05-05-before-current-review.md`
- `.archive/AUDIT-2026-05-04-before-app-review.md`

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm audit --omit=dev` was not rerun during this update.
- Unit and integration tests are intentionally excluded from this follow-up verification.

## Current State

Milestones 1-3 are implemented at the endpoint-surface level. Exercise/reference data, routine/workout/weight/gallery, and nutrition tools/resources are registered through split domain modules in `src/infrastructure/mcp/server.ts`.

Notable improvements since the previous audit:

- Recursive JSON validation replaced the previous `z.custom<JsonValue>()` placeholder in `sharedSchemas.ts`.
- The `unknown` usage in `toolResult.ts` is now documented as an MCP SDK boundary exception.
- Wger HTTP error body previews moved from error logs to debug logs.
- Nutrition/workout schemas were tightened in several places with shared primitives.
- `getStatus()` no longer reports a hard-coded Wger version.
- Write tools now have an `ENABLE_WRITE_TOOLS` registration gate.
- HTTP requests now use `AbortController` with a 30-second timeout.
- `npm run build` and `npm run lint` pass.

## Findings

### 1. Response validation is only partially implemented

`responseSchemas.ts` exists and `WgerClient` still supports optional response schemas, but almost all MCP tools/resources continue to call `client.get/post/patch` with generic type parameters and no response schema. The only observed caller passing a response schema is `list_exercises`, and it validates the paginated envelope with `paginatedResponseSchema(z.any())`, so individual exercise payloads remain unvalidated.

Relevant files:

- `src/infrastructure/mcp/responseSchemas.ts`
- `src/infrastructure/mcp/tools/exercises.ts:75`
- `src/infrastructure/mcp/tools/mealTools.ts:89`
- `src/infrastructure/mcp/resources/exercises.ts:29`
- `src/infrastructure/wger/WgerClient.ts:23`
- `src/infrastructure/wger/WgerClient.ts:192`

Risk: malformed or version-drifted Wger responses are returned as valid MCP payloads.

Recommendation: wire response schemas into representative high-value paths first: write responses, nutrition diary entries, workout logs, and paginated list envelopes. Avoid `z.any()` in response schemas; use JSON-compatible recursive schemas where Wger has an open-ended object.

### 2. HTTP timeout exists but is not configurable

`fetch` now receives an `AbortSignal`, and timeout failures are mapped to `WgerError`. The timeout is hard-coded to 30 seconds in `WgerClient`, not configurable through `Config` or environment variables.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts:8`
- `src/infrastructure/wger/WgerClient.ts:20`
- `src/infrastructure/wger/WgerClient.ts:123`
- `src/infrastructure/wger/WgerClient.ts:142`

Risk: timeout behavior is improved, but deployments with slow self-hosted Wger instances cannot tune the limit without code changes.

Recommendation: add `WGER_REQUEST_TIMEOUT_MS` to config with sane bounds and default `30000`.

### 3. Write tool gate exists but default behavior is inconsistent

Create/update tools now receive `config.enableWriteTools` and are registered only when it is true. However, documentation says `ENABLE_WRITE_TOOLS` defaults to `true`, and `configSchema` declares `default(true)`, but `loadConfig()` always passes a boolean from `parseBoolean()`. When the env var is unset, `parseBoolean(undefined)` returns `false`, so the schema default is never used and write tools are effectively disabled by default.

Relevant file:

- `README.md:32`
- `docs/README.md:170`
- `src/infrastructure/config.ts:15`
- `src/infrastructure/config.ts:21`
- `src/infrastructure/config.ts:34`
- `src/infrastructure/mcp/server.ts:49`
- `src/infrastructure/mcp/server.ts:66`

Risk: operators following the documentation may expect write tools to be present by default, but they will be absent unless `ENABLE_WRITE_TOOLS=true` is explicitly set.

Recommendation: either make `parseBoolean` preserve `undefined` so Zod defaults apply, or change docs/defaults to say write tools default to disabled.

### 4. MCP input schemas still drift from `wger.yaml`

Several previously reported examples have been fixed:

- `decimalAmountSchema` no longer accepts empty strings.
- `update_meal.time` now uses `timeStringSchema`.
- `list_meal_items.meal` and `list_meal_items.ingredient` now use positive integer IDs.
- `update_nutrition_plan.description` and goal fields now match the stricter create schema.
- Day, slot, and slot-entry write `order` fields now use integer `minimum: 0`.

Remaining drift still exists:

- `workoutLogTools.ts` uses unconstrained `z.number()` for `iteration`, `rest`, and `rest_target`; OpenAPI requires integer bounds.
- `slotEntryTools.ts` uses arbitrary strings for `repetition_rounding` and `weight_rounding`; OpenAPI declares decimal strings with a narrower pattern.
- `responseSchemas.ts` introduces `z.any()` for `day.config`, which conflicts with the project’s zero-`any` policy even if it is a response boundary.

Relevant files:

- `src/infrastructure/mcp/sharedSchemas.ts:24`
- `src/infrastructure/mcp/tools/mealTools.ts:32`
- `src/infrastructure/mcp/tools/nutritionPlanTools.ts:42`
- `src/infrastructure/mcp/tools/workoutLogTools.ts:30`
- `src/infrastructure/mcp/tools/workoutLogTools.ts:42`
- `src/infrastructure/mcp/tools/slotEntryTools.ts:43`
- `src/infrastructure/mcp/responseSchemas.ts:40`
- `wger.yaml:11298`
- `wger.yaml:14813`
- `wger.yaml:15842`

Risk: invalid inputs reach Wger, causing avoidable upstream errors and uneven UX between create/update tools.

Recommendation: finish aligning the remaining write schemas with `wger.yaml`. Replace `z.any()` with the existing recursive JSON schema or an explicit JSON-compatible response schema.

### 5. Clean Architecture boundary remains thin

The code is organized by MCP domain module, but MCP transport handlers still call `WgerClient` directly. The application layer is still effectively only the logger port.

Relevant files:

- `src/application/ports/Logger.ts`
- `src/infrastructure/mcp/tools/mealTools.ts:75`
- `src/infrastructure/mcp/tools/routineTools.ts:64`
- `src/infrastructure/wger/WgerClient.ts:10`

Risk: Milestone 4 can grow the transport layer into the main application architecture again, making validation, response schemas, endpoint descriptors, and tests harder to share.

Recommendation: before adding broad Milestone 4 coverage, introduce endpoint descriptors or application services that centralize method/path/schema/response handling per domain.

## Resolved Since Previous Audit

- Recursive JSON validation is now real Zod validation.
- The `unknown` SDK-boundary exception is documented in code.
- Error body previews are no longer logged at error level.
- Shared tool envelopes and `runTool` remain in place.
- Updates continue to use `PATCH`.
- Tool/resource files remain split by domain.
- `get_wger_status` no longer reports a hard-coded version.
- Write tools are no longer registered unconditionally; they now have a gate.
- HTTP requests now have cancellation via `AbortController`.
- Build and lint pass.

## Excluded From This Follow-up

Unit and integration tests were explicitly excluded from this verification pass. The project still needs executable tests, but that is not counted as an open issue in this update.

## Suggested Next Order

1. Fix `ENABLE_WRITE_TOOLS` default behavior or align docs with the actual default.
2. Wire real response schemas into representative tools/resources and remove `z.any()`.
3. Make request timeout configurable with env validation.
4. Tighten remaining schema drift in workout logs and slot-entry rounding fields.
5. Introduce application services or endpoint descriptors before Milestone 4 expansion.
