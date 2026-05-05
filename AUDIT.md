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
- Privacy check: no tracked `.env`, token, secret, or log files were found.
- Privacy check: `git status` was clean at the time of the check.

## Current State

Milestones 1-3 are implemented at the endpoint-surface level. Exercise/reference data, routine/workout/weight/gallery, and nutrition tools/resources are registered through split domain modules in `src/infrastructure/mcp/server.ts`.

Notable improvements since the previous audit:

- Recursive JSON validation replaced the previous `z.custom<JsonValue>()` placeholder in `sharedSchemas.ts`.
- The `unknown` usage in `toolResult.ts` is now documented as an MCP SDK boundary exception.
- Wger HTTP error body previews moved from error logs to debug logs.
- Nutrition/workout schemas were tightened in several places with shared primitives.
- `getStatus()` no longer reports a hard-coded Wger version.
- Write tools now have an `ENABLE_WRITE_TOOLS` registration gate.
- `ENABLE_WRITE_TOOLS` now preserves `undefined` so the documented Zod default applies.
- HTTP requests now use `AbortController` with a configurable request timeout.
- Response schemas are wired through most tool/resource calls.
- The previously listed workout-log and slot-entry schema drift is fixed.
- No real API tokens or `.env` files are tracked.
- Local `.crush/logs/crush.log` exists but is ignored and not tracked.
- `npm run build` and `npm run lint` pass.

## Findings

### 1. Response validation still has small gaps

`responseSchemas.ts` now contains concrete schemas and most tools/resources pass response schemas into `WgerClient`. The previous `z.any()` use is gone. Remaining gaps are narrower:

- Nutritional value endpoints still return `NutritionalValues` without a response schema.
- Some routine special endpoints still validate as `Routine`, matching the current OpenAPI schema but probably not the real semantic shape of those special responses.
- `responseSchemas.ts` uses `jsonValueSchema as unknown as z.ZodType<Config>` for open-ended config values. This is better than `z.any()`, but it is a new `unknown` cast outside the documented MCP SDK-boundary exception.

Relevant files:

- `src/infrastructure/mcp/responseSchemas.ts`
- `src/infrastructure/mcp/tools/mealTools.ts:125`
- `src/infrastructure/mcp/tools/mealTools.ts:175`
- `src/infrastructure/mcp/tools/nutritionPlanTools.ts:108`
- `src/infrastructure/mcp/tools/nutritionDiaryTools.ts:104`
- `src/infrastructure/wger/WgerClient.ts:23`
- `src/infrastructure/wger/WgerClient.ts:192`

Risk: malformed or version-drifted Wger responses are mostly covered now, but several endpoint families can still return unvalidated payloads.

Recommendation: add a `nutritionalValuesResponseSchema`, use it in all nutritional-value tools, and remove or explicitly document the `unknown` cast used for config response validation.

### 2. Clean Architecture boundary remains thin

The code is organized by MCP domain module, but MCP transport handlers still call `WgerClient` directly. The application layer is still effectively only the logger port.

Relevant files:

- `src/application/ports/Logger.ts`
- `src/infrastructure/mcp/tools/mealTools.ts:75`
- `src/infrastructure/mcp/tools/routineTools.ts:64`
- `src/infrastructure/wger/WgerClient.ts:10`

Risk: Milestone 4 can grow the transport layer into the main application architecture again, making validation, response schemas, endpoint descriptors, and tests harder to share.

Recommendation: before adding broad Milestone 4 coverage, introduce endpoint descriptors or application services that centralize method/path/schema/response handling per domain.

### 3. Debug logs can expose personal Wger metadata/data

The API token is not logged. However, `WgerClient` logs full request URLs at debug level, and debug error logging still includes a truncated upstream response body preview. URLs can contain personal metadata such as dates, routine IDs, diary filters, ingredient searches, or other query parameters. Error body previews can contain personal Wger data depending on the endpoint and upstream error shape.

Relevant files:

- `src/infrastructure/wger/WgerClient.ts:27`
- `src/infrastructure/wger/WgerClient.ts:37`
- `src/infrastructure/wger/WgerClient.ts:47`
- `src/infrastructure/wger/WgerClient.ts:57`
- `src/infrastructure/wger/WgerClient.ts:63`
- `src/infrastructure/wger/WgerClient.ts:164`
- `src/infrastructure/ConsoleLogger.ts:37`

Risk: safe for normal personal use with `LOG_LEVEL=info`, but debug logs can reveal private workout/nutrition metadata or upstream response snippets if shared or committed accidentally.

Recommendation: keep `LOG_LEVEL=info` for normal use. Before public release, consider logging only method + path without query string and removing upstream body previews entirely.

## Resolved Since Previous Audit

- Recursive JSON validation is now real Zod validation.
- The `unknown` SDK-boundary exception is documented in code.
- Error body previews are no longer logged at error level.
- Shared tool envelopes and `runTool` remain in place.
- Updates continue to use `PATCH`.
- Tool/resource files remain split by domain.
- `get_wger_status` no longer reports a hard-coded version.
- Write tools are no longer registered unconditionally; they now have a gate.
- `ENABLE_WRITE_TOOLS` now defaults consistently with documentation.
- HTTP requests now have configurable cancellation via `AbortController`.
- The previously listed input-schema drift items are fixed.
- Response validation is broadly wired through tools/resources.
- No real `.env`, token, secret, or log files are tracked.
- API tokens are not logged.
- Build and lint pass.

## Excluded From This Follow-up

Unit and integration tests were explicitly excluded from this verification pass. The project still needs executable tests, but that is not counted as an open issue in this update.

## Privacy Notes

The app is suitable for personal use from a privacy standpoint if local logs and configs stay private. The MCP responses intentionally expose Wger data to the connected MCP client, including workouts, weight entries, nutrition data, diary entries, and gallery data. Do not connect this server to an untrusted MCP client.

Before publishing publicly:

- Do not publish real MCP client config containing your Wger URL or token.
- Keep `.env` untracked.
- Keep generated local runtime folders such as `.crush/` untracked.
- Prefer `LOG_LEVEL=info`.
- Consider disabling write tools by setting `ENABLE_WRITE_TOOLS=false` for read-only deployments.

## Suggested Next Order

1. Add `nutritionalValuesResponseSchema` and wire it into nutritional-value tools.
2. Remove or explicitly document the `unknown` cast in `responseSchemas.ts`.
3. Reduce debug logging of full URLs and remove upstream body previews before public release.
4. Introduce application services or endpoint descriptors before Milestone 4 expansion.
