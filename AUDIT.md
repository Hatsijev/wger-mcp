# Wger MCP Implementation Audit

Date: 2026-05-04

## Scope

Review of the current TypeScript MCP server implementation against the local `.agents` directives, `.planning/CURRENT.md`, project docs, and current source code.

Build verification: `npm run build` passes.

Dependency audit: `npm audit --omit=dev` reports `found 0 vulnerabilities`.

## High-Priority Findings

### 1. Write tools are registered without capability gating

`ENABLE_DESTRUCTIVE_TOOLS`, `ENABLE_ADMIN_TOOLS`, and `ENABLE_RAW_WGER_PROXY` are parsed and logged, but they are not used to control tool registration or execution.

Current write tools such as `create_routine`, `update_routine`, `create_day`, `update_day`, and other mutation tools are always registered.

Relevant files:

- `src/infrastructure/mcp/server.ts`
- `src/infrastructure/mcp/tools/routines.ts`
- `README.md`

Risk: any connected MCP client can perform mutation operations if the API token permits them. The README safety section currently implies stronger protection than the code enforces.

Recommendation: introduce explicit capability-based registration or execution guards for mutating, destructive, admin, and raw proxy tools. Keep read-only tools available by default.

### 2. No executable tests exist

The repository has `docs/TEST_SCENARIOS.md`, but no test runner, no `test` script, and no test files under `test`, `tests`, or `__tests__`.

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

### 10. Milestone 3 is incomplete

Nutrition read tools and resources exist. Safe write tools for `meal`, `meal_item`, `nutrition_plan`, and `nutrition_diary_entry` are not implemented yet.

Relevant files:

- `.planning/CURRENT.md`
- `src/infrastructure/mcp/tools/nutrition.ts`

Recommendation: complete Task 3.2 after confirming whether writes should target `nutritionplan` or `nutritionplaninfo` endpoints.

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

1. Confirm Milestone 3 read and write coverage against `wger.yaml`.
2. Fix write-tool gating and README safety mismatch.
3. Add shared MCP tool wrapper for consistent error envelopes.
4. Tighten Zod schemas with reusable primitives.
5. Add tests for client behavior, schemas, and representative tools.
6. Revisit architecture boundaries and reduce generated-handler duplication.
