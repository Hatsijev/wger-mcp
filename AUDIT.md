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
- `npm audit --omit=dev` passes with `found 0 vulnerabilities`.
- No executable test suite exists: there is no `test` script and no `.test.ts` / `.spec.ts` files outside `node_modules` and `dist`.

## Current State

Milestones 1-3 are implemented at the endpoint-surface level. Exercise/reference data, routine/workout/weight/gallery, and nutrition tools/resources are registered through split domain modules in `src/infrastructure/mcp/server.ts`.

Notable improvements since the previous audit:

- Recursive JSON validation replaced the previous `z.custom<JsonValue>()` placeholder in `sharedSchemas.ts`.
- The `unknown` usage in `toolResult.ts` is now documented as an MCP SDK boundary exception.
- Wger HTTP error body previews moved from error logs to debug logs.
- Nutrition/workout schemas were tightened in several places with shared primitives.
- `npm run build`, `npm run lint`, and `npm audit --omit=dev` all pass.

## Findings

### 1. No executable tests exist

`package.json` exposes only `build`, `dev`, `lint`, and `start`; there is no `test` script. A repository scan found no `.test.ts` or `.spec.ts` files.

Relevant files:

- `package.json:6`
- `TEST_SCENARIOS.md`
- `docs/TEST_SCENARIOS.md`

Risk: endpoint mappings, schemas, tool envelopes, config parsing, and Wger client behavior can regress while build/lint still pass.

Recommendation: add a test runner before Milestone 4. Start with focused tests for `WgerClient`, shared schemas, tool result envelopes, and representative create/update tools using a mocked `fetch`.

### 2. Response validation hooks are still unused by callers

`WgerClient` supports optional response schemas, but MCP tools/resources call `client.get/post/patch` with generic type parameters and no Zod response schema. The response is cast in `_parseJson` before optional validation runs.

Relevant files:

- `src/infrastructure/wger/WgerClient.ts:19`
- `src/infrastructure/wger/WgerClient.ts:177`
- `src/infrastructure/mcp/tools/mealTools.ts:88`
- `src/infrastructure/mcp/resources/exercises.ts:29`

Risk: malformed or version-drifted Wger responses are returned as valid MCP payloads.

Recommendation: add reusable response schemas for paginated envelopes and high-value payloads first: status probe, write responses, nutrition diary entries, and workout logs.

### 3. HTTP requests have no timeout or cancellation policy

`fetch` is called without an `AbortSignal`.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts:119`
- `src/infrastructure/wger/WgerClient.ts:129`

Risk: a slow or unreachable Wger instance can hang MCP tool/resource calls indefinitely.

Recommendation: add a configurable request timeout, probably in `Config`, and map timeout failures to a sanitized `WgerError`.

### 4. Safe write tools are enabled unconditionally

Create/update tools are registered without a feature gate. The existing config gates are only logged; they do not affect registration. Delete/admin/raw proxy tools are not exposed, but safe writes can still mutate user data whenever the configured token permits it.

Relevant file:

- `src/infrastructure/mcp/server.ts:49`
- `src/infrastructure/mcp/server.ts:65`
- `src/infrastructure/mcp/server.ts:74`

Risk: any connected MCP client can create/update routines, workouts, weight entries, gallery images, meals, meal items, nutrition plans, and diary entries.

Recommendation: decide explicitly whether safe writes are part of the default product. If yes, document least-privilege token guidance clearly. If no, add an `ENABLE_WRITE_TOOLS` gate and keep write tools absent when disabled.

### 5. MCP input schemas still drift from `wger.yaml`

The shared primitives helped, but several schemas remain looser or inconsistent with the OpenAPI request schemas:

- `decimalAmountSchema` allows empty strings because the regex uses `\d{0,4}` with every numeric part optional.
- `update_meal.time` accepts any string, while create uses the shared time schema.
- `list_meal_items.meal` and `list_meal_items.ingredient` accept arbitrary numbers, not positive integer IDs.
- `update_nutrition_plan.description` allows 1000 characters, while `NutritionPlanRequest` has `maxLength: 80`; update goal fields also lost integer/bounds validation.
- Several `order` fields accept unconstrained numbers where OpenAPI specifies integer `minimum: 0`.

Relevant files:

- `src/infrastructure/mcp/sharedSchemas.ts:24`
- `src/infrastructure/mcp/tools/mealTools.ts:32`
- `src/infrastructure/mcp/tools/mealTools.ts:53`
- `src/infrastructure/mcp/tools/nutritionPlanTools.ts:42`
- `src/infrastructure/mcp/tools/ingredientTools.ts:50`
- `wger.yaml:11795`
- `wger.yaml:12143`

Risk: invalid inputs reach Wger, causing avoidable upstream errors and uneven UX between create/update tools.

Recommendation: finish aligning tool schemas with `wger.yaml`, especially for create/update paths and common filters. Add tests for each shared primitive so these constraints stay fixed.

### 6. Status reporting returns a hard-coded Wger version

`getStatus()` probes `/api/v2/exerciseinfo/` and then returns `{ status: "ok", version: "2.5.0" }` regardless of the actual Wger instance.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts:65`

Risk: clients can treat the reported version as authoritative even when connected to a different Wger release.

Recommendation: either remove `version` from the status response, mark it as the expected/tested API version, or retrieve actual version metadata from a real Wger endpoint if one exists.

### 7. Clean Architecture boundary remains thin

The code is organized by MCP domain module, but MCP transport handlers still call `WgerClient` directly. The application layer is still effectively only the logger port.

Relevant files:

- `src/application/ports/Logger.ts`
- `src/infrastructure/mcp/tools/mealTools.ts:75`
- `src/infrastructure/mcp/tools/routineTools.ts:64`
- `src/infrastructure/wger/WgerClient.ts:8`

Risk: Milestone 4 can grow the transport layer into the main application architecture again, making validation, response schemas, endpoint descriptors, and tests harder to share.

Recommendation: before adding broad Milestone 4 coverage, introduce endpoint descriptors or application services that centralize method/path/schema/response handling per domain.

## Resolved Since Previous Audit

- Recursive JSON validation is now real Zod validation.
- The `unknown` SDK-boundary exception is documented in code.
- Error body previews are no longer logged at error level.
- Shared tool envelopes and `runTool` remain in place.
- Updates continue to use `PATCH`.
- Tool/resource files remain split by domain.
- Build, lint, and dependency audit pass.

## Suggested Next Order

1. Add executable tests for config, `WgerClient`, shared schemas, and representative tools.
2. Add HTTP request timeout support.
3. Decide and document the safe-write capability model.
4. Tighten remaining schemas against `wger.yaml`.
5. Start passing response schemas into `WgerClient`.
6. Fix or clarify `get_wger_status` version reporting.
7. Refresh `TEST_SCENARIOS.md` and `docs/TEST_SCENARIOS.md`.
8. Introduce application services or endpoint descriptors before Milestone 4 expansion.
