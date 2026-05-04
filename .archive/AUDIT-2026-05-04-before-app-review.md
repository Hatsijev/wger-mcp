# Wger MCP Implementation Audit

Date: 2026-05-04

## Scope

Review of the current TypeScript MCP server implementation against the local `.agents` directives, `.planning/CURRENT.md`, project docs, and current source code.

Build verification:

- `npm run build` passes.
- `npm run lint` passes.

Dependency audit: `npm audit --omit=dev` reports `found 0 vulnerabilities`.

## Milestone 3 Follow-Up

Date: 2026-05-04

Milestone 3 nutrition endpoint surface is now implemented: read tools, write tools, resources, nutrition types, and `docs/api/nutrition.md` are present.

The previous finding "Milestone 3 is incomplete" is closed for basic endpoint coverage, but the new implementation carries forward several quality and safety risks.

### New / Updated Findings

#### 1. Nutrition update tools use sparse PUT bodies

The OpenAPI spec exposes PATCH endpoints for partial updates, but the MCP update tools currently call `client.put(...)` with only provided fields.

Relevant files:

- `src/infrastructure/mcp/tools/nutrition.ts`
- `wger.yaml`

Risk: if Wger treats PUT as full replacement, partial MCP update calls can clear or reset omitted fields.

Recommendation: use `PATCH` for `update_meal`, `update_meal_item`, `update_nutrition_plan`, and `update_nutrition_diary_entry`, unless full replacement is explicitly intended and documented.

#### 2. Nutrition schemas are looser than OpenAPI constraints

Nutrition schemas use plain `z.number()` and `z.string()` for fields that have stricter OpenAPI constraints.

Examples:

- IDs accept floats and negative numbers.
- `time` is not validated as time.
- `start` and `end` are not validated as dates.
- `datetime` is not validated as date-time.
- `amount` does not enforce the decimal pattern `^-?\d{0,4}(?:\.\d{0,2})?$`.
- Goal fields do not enforce integer bounds from OpenAPI.

Relevant files:

- `src/infrastructure/mcp/tools/nutrition.ts`
- `wger.yaml`

Recommendation: add shared schema primitives and apply them to all nutrition tools before expanding Milestone 4.

#### 3. Nutrition plan tools and resources use different endpoint families

Nutrition plan tools use `/api/v2/nutritionplaninfo/` for list/get operations, while nutrition plan resources use `/api/v2/nutritionplan/`.

Relevant files:

- `src/infrastructure/mcp/tools/nutrition.ts`
- `src/infrastructure/mcp/resources/nutrition.ts`

Risk: `list_nutrition_plans` and `wger://nutrition-plans` can return different shapes for the same conceptual object.

Recommendation: choose one public semantic for nutrition plan reads. If both Wger endpoint families are needed, expose them with distinct names and document the difference.

#### 4. Documentation has stale milestone wording

`docs/README.md` still says no delete operations are exposed for "Milestone 2", even though `.planning/CURRENT.md` marks Milestones 1-3 complete.

Relevant file:

- `docs/README.md`

Recommendation: update wording to avoid milestone-specific stale claims.

## High-Priority Findings

### 1. Write tools are registered without capability gating

`ENABLE_DESTRUCTIVE_TOOLS`, `ENABLE_ADMIN_TOOLS`, and `ENABLE_RAW_WGER_PROXY` are parsed and logged, but they are not used to control tool registration or execution.

Current write tools such as `create_routine`, `update_routine`, `create_day`, `update_day`, and other mutation tools are always registered.

Milestone 3 adds nutrition mutation tools to the same globally enabled write surface:

- `create_meal`
- `update_meal`
- `create_meal_item`
- `update_meal_item`
- `create_nutrition_plan`
- `update_nutrition_plan`
- `create_nutrition_diary_entry`
- `update_nutrition_diary_entry`

Relevant files:

- `src/infrastructure/mcp/server.ts`
- `src/infrastructure/mcp/tools/routines.ts`
- `src/infrastructure/mcp/tools/nutrition.ts`
- `README.md`
- `docs/README.md`

Risk: any connected MCP client can perform mutation operations if the API token permits them. The top-level README safety section currently implies stronger protection for capability-gated operations than the code enforces. The docs should clearly distinguish safe writes, destructive deletes, admin tools, and raw proxy tools.

Recommendation: introduce explicit capability-based registration or execution guards for mutating, destructive, admin, and raw proxy tools. Keep read-only tools available by default. If safe writes intentionally remain enabled by default, document the deployment expectation and token-scope assumptions.

### 2. No executable tests exist

The repository has `docs/TEST_SCENARIOS.md` and a root-level `TEST_SCENARIOS.md`, but no test runner, no `test` script, and no test files under `test`, `tests`, or `__tests__`.

Relevant files:

- `package.json`
- `docs/TEST_SCENARIOS.md`

Risk: endpoint mappings, schema validation, error formatting, config parsing, and client behavior are not automatically verified.

Recommendation: add a test framework and focused tests for config loading, WgerClient behavior, MCP tool handlers, schema validation, and endpoint mappings.

### 3. Wger API responses are trusted without runtime validation

`WgerClient` parses JSON and casts it directly to generic type `T`.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts`

Risk: malformed, unexpected, or version-drifted Wger responses can be returned as valid MCP responses.

Recommendation: validate public tool response boundaries with Zod schemas or typed endpoint descriptors. At minimum, validate high-risk write responses and status/error envelopes.

## Medium-Priority Findings

### 4. Error handling is inconsistent across tool domains

Exercise tools allow errors to propagate directly. Routine and nutrition tools catch errors and return structured `{ ok: false, error }` responses with `isError: true`.

Relevant files:

- `src/infrastructure/mcp/tools/exercises.ts`
- `src/infrastructure/mcp/tools/routines.ts`
- `src/infrastructure/mcp/tools/nutrition.ts`

Risk: MCP clients receive different error behavior depending on which domain they call.

Recommendation: centralize tool execution through a shared wrapper that returns consistent success and error envelopes.

### 5. Update tools use PUT with sparse bodies

Update handlers extract `id`, omit undefined fields, and call `client.put(...)`.

Relevant file:

- `src/infrastructure/mcp/tools/routines.ts`

Risk: if Wger treats PUT as full replacement, partial updates can accidentally clear or reset fields.

Recommendation: verify Wger endpoint semantics. Prefer PATCH for partial update tools unless full replacement is explicitly intended.

### 6. Input validation is too loose for MCP boundary exposure

Many schemas use plain `z.number()` or `z.string()` for IDs, pagination, dates, times, weights, and image payloads.

Examples:

- IDs accept floats and negative numbers.
- `limit` and `offset` have no range bounds.
- Dates and times accept arbitrary strings.
- Gallery image input is an unbounded string.
- JSON config fields use `z.custom<JsonValue>()`, which does not meaningfully validate shape.

Relevant files:

- `src/infrastructure/mcp/tools/exercises.ts`
- `src/infrastructure/mcp/tools/routines.ts`
- `src/infrastructure/mcp/tools/nutrition.ts`

Risk: invalid input reaches Wger, producing avoidable errors or excessive payloads.

Recommendation: introduce reusable schema helpers such as positive integer IDs, bounded pagination, ISO date strings, time strings, bounded text fields, and bounded image payload validation.

### 7. Error logging may leak sensitive data

Wger error responses are logged with full response bodies, and thrown errors include response text. Fitness, weight, workout, gallery, and nutrition data can be sensitive.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts`

Risk: logs or MCP error payloads may expose private user data.

Recommendation: redact or summarize API error bodies. Include request method, path, status code, and a correlation-friendly error code instead of full body text by default.

### 8. No timeout, retry, or cancellation policy around fetch

`fetch` is called without an `AbortSignal` or timeout.

Relevant file:

- `src/infrastructure/wger/WgerClient.ts`

Risk: a slow or unreachable Wger instance can hang tool calls indefinitely.

Recommendation: add configurable request timeout. Consider limited retries only for safe idempotent reads.

### 9. Resource template IDs are parsed but not validated

Resource handlers convert URI variables with `Number(variables.id)` and use the result directly in API paths.

Relevant files:

- `src/infrastructure/mcp/resources/exercises.ts`
- `src/infrastructure/mcp/resources/routines.ts`
- `src/infrastructure/mcp/resources/nutrition.ts`

Risk: invalid IDs such as `NaN`, floats, or negative values can reach the API path.

Recommendation: validate resource IDs with the same positive-integer helper used by tools.

### 10. Milestone 3 endpoint coverage is complete, but quality gates remain open

Nutrition read tools, write tools, resources, domain types, and documentation are now present.

Remaining risks:

- no executable tests,
- loose schemas,
- sparse PUT updates,
- nutrition plan endpoint-family mismatch,
- write tools available by default,
- unresolved shared WgerClient/runtime-validation risks.

Recommendation: do not expand Milestone 4 until the shared infrastructure issues are addressed or explicitly accepted as deferred risk.

## Architectural Observations

### What is done well

- Strict TypeScript compiler settings are enabled.
- `npm run build` passes.
- Config parsing uses Zod.
- Authentication and HTTP behavior are centralized in `WgerClient`.
- MCP tools and resources are clearly separated by domain.
- Domain model files avoid `any` and provide useful readonly interfaces.
- Documentation and endpoint inventory provide useful project context.

### What needs architectural attention

The repository shape suggests Clean Architecture, but most behavior currently lives in infrastructure. MCP tool handlers call `WgerClient` directly and manually build endpoint paths. The application layer has only a logger port.

Large tool files, especially `src/infrastructure/mcp/tools/routines.ts`, contain repeated registration, request, response, and error-handling logic.

Recommendation: introduce application-level services or endpoint descriptors that keep MCP transport details separate from Wger use cases. Add shared helpers for:

- Tool response formatting.
- Error conversion.
- Input schema primitives.
- Endpoint path construction.
- Read/write operation registration.

## Security Checklist For Follow-Up

- Verify write-tool gating before exposing the server to an MCP client with a real token.
- Redact API error bodies from logs and MCP error messages.
- Add request timeouts.
- Bound all user-controlled payload sizes.
- Validate IDs as positive integers.
- Validate dates/times before requests reach Wger.
- Decide whether partial updates use PATCH instead of PUT.
- Confirm no raw proxy, admin, or delete tooling is exposed before the corresponding flags are enforced.
- Add automated tests before expanding Milestone 4 coverage.

## Suggested Review Order After Milestone 3

1. Decide and document the write-tool capability model.
2. Switch sparse update tools to PATCH where appropriate.
3. Add shared MCP tool wrapper for consistent error envelopes.
4. Tighten Zod schemas with reusable primitives.
5. Add tests for client behavior, schemas, and representative tools.
6. Resolve nutrition plan endpoint-family naming/shape consistency.
7. Revisit architecture boundaries and reduce generated-handler duplication.
