# Wger MCP Implementation Audit

Date: 2026-05-04

## Scope

Review of the current TypeScript MCP server implementation against `.agents` directives, `.planning/CURRENT.md`, project docs, `wger.yaml`, and current source code.

Archived previous audit snapshot:

- `.archive/AUDIT-2026-05-04-before-app-review.md`

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm audit --omit=dev` reports `found 0 vulnerabilities`.
- No executable test suite exists: there is no `test` script and no `test`, `tests`, or `__tests__` directory.

## Current State

Milestones 1-3 are implemented at the endpoint-surface level. Exercise, routine/workout/weight/gallery, and nutrition tools/resources are registered through split domain modules in `src/infrastructure/mcp/server.ts`.

Notable improvements since the previous audit:

- Tool handlers now use shared `runTool` error handling.
- Tool success/error envelopes are consistent across domains.
- Update tools use `PATCH` instead of sparse `PUT`.
- Resource template IDs use `validateResourceId`.
- Common MCP schema primitives exist in `sharedSchemas.ts`.
- Wger HTTP errors no longer expose full upstream response bodies to MCP clients.
- The previous large routine/nutrition tool files have been split into smaller domain-specific tool modules and resources.

## Findings

### 1. No executable tests exist

`docs/TEST_SCENARIOS.md` and root `TEST_SCENARIOS.md` are planning artifacts only. They do not verify behavior.

Relevant files:

- `package.json`
- `docs/TEST_SCENARIOS.md`
- `TEST_SCENARIOS.md`

Risk: endpoint mappings, schemas, tool envelopes, config parsing, and Wger client behavior can regress while build/lint still pass.

Recommendation: add a test runner and focused tests before Milestone 4.

### 2. Response validation support exists but is unused

`WgerClient` accepts optional response schemas, but current tool/resource calls do not pass schemas. Responses are still trusted through generic type parameters in normal use.

Relevant files:

- `src/infrastructure/wger/WgerClient.ts`
- `src/infrastructure/mcp/tools/*.ts`
- `src/infrastructure/mcp/resources/*.ts`

Risk: malformed or version-drifted Wger responses can be returned as valid MCP payloads.

Recommendation: introduce response schemas for representative high-value paths first: write tools, status checks, and paginated list envelopes.

### 3. HTTP requests have no timeout or cancellation policy

`fetch` is called without an `AbortSignal`.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts`

Risk: a slow or unreachable Wger instance can hang MCP tool calls indefinitely.

Recommendation: add a configurable request timeout and preserve cancellation behavior where possible.

### 4. Current code violates zero-unknown guidance

`toolResult.ts` uses `unknown` in public result interfaces and `successResult`.

Relevant file:

- `src/infrastructure/mcp/toolResult.ts`

Risk: this conflicts with the project’s stated zero-`unknown` policy. It may be acceptable at an SDK boundary, but that exception is not documented.

Recommendation: replace with explicit JSON-compatible payload types based on `JsonValue`, or document this as an allowed SDK-boundary exception.

### 5. JSON config validation is not real recursive validation

`jsonConfigSchema` uses `z.custom<JsonValue>()` without a predicate.

Relevant file:

- `src/infrastructure/mcp/sharedSchemas.ts`

Risk: the schema name suggests JSON validation, but the schema itself does not enforce recursive JSON shape.

Recommendation: replace it with a recursive Zod JSON schema.

### 6. MCP input validation is improved but still incomplete

Many schemas now use shared primitives, but some fields still use loose `z.number()` or `z.string()` where `wger.yaml` has stricter constraints.

Examples:

- `ingredientTools.ts`: `term`, `language`, `ingredient_id`, and `ingredient` are loose.
- `mealTools.ts`: filter IDs, `time`, and `amount` are loose.
- `nutritionPlanTools.ts`: `description` length and goal integer bounds do not match OpenAPI.
- `nutritionDiaryTools.ts`: filter `plan` and `amount` are loose.
- `galleryTools.ts`: `image` is unbounded.
- Workout/routine config and numeric fields still need closer OpenAPI matching.

Relevant files:

- `src/infrastructure/mcp/tools/*.ts`
- `wger.yaml`

Risk: invalid inputs reach Wger, producing avoidable API errors or excessive payloads.

Recommendation: finish applying shared primitives and OpenAPI-specific bounds across all tool modules.

### 7. Write tools are enabled by default

Create/update tools are registered unconditionally. Delete, admin, and raw proxy tools are not currently exposed, but the config flags are only logged and are not used to control registration.

Relevant files:

- `src/infrastructure/mcp/server.ts`
- `README.md`
- `docs/README.md`

Risk: any connected MCP client can perform create/update operations if the configured token permits it.

Recommendation: decide whether safe writes are intentionally enabled by default. If yes, document the security model and least-privilege token expectation clearly. If no, add an explicit write capability gate.

### 8. Error logging still includes upstream body previews

Thrown errors are now sanitized, but logs still include a truncated `bodyPreview`.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts`

Risk: even a short preview can contain sensitive health, workout, weight, nutrition, or gallery data.

Recommendation: move body previews to `debug`, redact sensitive fields, or log only status/path/error classification by default.

### 9. Documentation/test scenario files are stale

`docs/TEST_SCENARIOS.md` still describes old behavior in places, including update tools using `PUT` and exercise tools lacking structured error handling.

Relevant file:

- `docs/TEST_SCENARIOS.md`

Risk: reviewers and future agents may test against obsolete behavior.

Recommendation: regenerate or curate test scenarios after the current refactor.

### 10. Clean Architecture boundary remains thin

The code is better organized by MCP domain module, but MCP transport code still calls `WgerClient` directly. The application layer is still essentially only ports.

Relevant files:

- `src/application/ports/Logger.ts`
- `src/infrastructure/mcp/tools/*.ts`
- `src/infrastructure/wger/WgerClient.ts`

Risk: as Milestone 4 expands, endpoint registration can again become the main architecture rather than a transport adapter over use cases.

Recommendation: introduce endpoint descriptors or application services before adding broad Milestone 4 coverage.

## Done Well

- Strict TypeScript build and lint pass.
- Tool modules are now split by domain, improving maintainability.
- Tool error handling and response envelopes are centralized.
- Updates use `PATCH`.
- Resource IDs are validated.
- Shared schema primitives are in place.
- Wger client centralizes auth, HTTP methods, JSON parsing, and response validation hooks.
- Docs cover current Milestone 3 nutrition tools/resources.

## Suggested Next Order

1. Add executable tests for config, `WgerClient`, schema primitives, and representative tools.
2. Add HTTP request timeout support.
3. Replace `z.custom<JsonValue>()` with recursive JSON validation.
4. Tighten remaining schemas against `wger.yaml`.
5. Decide and document the safe-write capability model.
6. Start passing response schemas into `WgerClient`.
7. Refresh `docs/TEST_SCENARIOS.md`.
8. Introduce application services or endpoint descriptors before Milestone 4 expansion.
