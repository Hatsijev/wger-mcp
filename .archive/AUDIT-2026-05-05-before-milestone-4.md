# Wger MCP Implementation Audit

Date: 2026-05-05

## Scope

Final pre-Milestone 4 audit of the current TypeScript MCP server after npm packaging, stdio hardening, Wger response validation fixes, Vitest coverage, and the endpoint descriptor refactor. Scope covers current source code, `wger.yaml` alignment where relevant, package scripts, npm package contents, runtime stdio behavior, privacy posture, and verification commands.

Archived previous audit snapshots:

- `.archive/AUDIT-2026-05-05-before-current-review.md`
- `.archive/AUDIT-2026-05-04-before-app-review.md`

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm test` passes: 30 test files, 290 tests.
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run` passes for `wger-mcp@0.1.2`.
- Stdio startup check passes: captured stdout is 0 bytes; logs go to stderr.
- Source/package grep found no runtime `console.log`, `process.stdout`, `◇`, or `injected env` output.
- Privacy check: no tracked `.env`, token, secret, or log files were found.
- Endpoint descriptor check:
  - 10 endpoint descriptor modules exist under `src/infrastructure/mcp/endpoints/`.
  - 107 MCP tools are registered.
  - Tool files no longer call `WgerClient` directly.
  - Normal GET/POST/PATCH/PUT descriptors require response schemas.
  - The only intentionally unvalidated descriptors are 5 explicit `GET_RAW` routine special endpoints.
- Live Wger validation with local `.env` previously passed:
  - `get_exercise` for `/api/v2/exerciseinfo/50/` validated 4 image styles as string enum values.
  - `list_ingredients` for `/api/v2/ingredientinfo/?limit=10&offset=0` validated nullable `image`, nullable `thumbnails`, and compact `weight_units`.

Current worktree note: the app currently includes uncommitted source/test changes. This audit treats those changes as the current app state and does not revert them.

## Current State

The app is usable for personal MCP usage over stdio and is package-ready for npm. Milestones 1-3 are implemented at the current intended endpoint surface. The project is ready to start Milestone 4 using the endpoint descriptor pattern.

Notable validated improvements:

- Package metadata is ready for npm:
  - CLI bin: `wger-mcp`.
  - Package version: `0.1.2`.
  - License: `GPL-3.0-or-later`.
  - `prepack` performs a clean build.
  - Published package files are limited to `dist/**/*`, `.env.example`, `README.md`, and `LICENSE`.
- Stdio safety is fixed:
  - `dotenv.config({ quiet: true })` suppresses dotenv's stdout banner.
  - `ConsoleLogger` writes to stderr.
  - Runtime stdout is empty until MCP protocol messages.
- MCP `serverInfo.version` is aligned with package version `0.1.2`.
- Response validation fixes are in place:
  - Wger exercise `images[].style` validates as string enum `"1"` through `"5"`.
  - Wger ingredient `image` and `thumbnails` allow `null`.
  - Wger ingredient `weight_units` uses a separate compact `IngredientWeightUnitInfo` schema.
  - Nutritional-value endpoints validate with `nutritionalValuesResponseSchema`.
  - Config response validation uses recursive JSON validation, with the remaining type assertion documented as a Wger arbitrary-JSON boundary.
- Tool execution is centralized:
  - `EndpointDescriptor.ts` defines endpoint descriptor types.
  - `EndpointExecutor.ts` is the single runtime dispatcher for descriptor-backed tools.
  - Endpoint modules own Wger paths, query/body mapping, and response schemas.
  - Tool files keep input schemas, tool metadata, and feature-gate registration.
  - `toolResult.ts` remains the single source of truth for success/error envelopes and undefined-field body stripping.
- Tests are configured with Vitest and pass.
- Production TypeScript build excludes test files, so test-only code cannot block npm packaging.

## Findings

### 1. Debug logs can expose personal Wger metadata/data

The API token is not logged, and normal `LOG_LEVEL=info` is acceptable for personal use. At debug level, `WgerClient` still logs full request URLs and debug error body previews. URLs can include dates, routine IDs, diary filters, ingredient searches, or other private metadata. Error body previews may include private Wger data depending on upstream error shape.

Relevant files:

- `src/infrastructure/wger/WgerClient.ts`
- `src/infrastructure/ConsoleLogger.ts`

Risk: safe for personal use when logs remain private and `LOG_LEVEL=info`; not ideal for public support logs or shared bug reports.

Recommendation: before wider public release, log method + path without query string and remove upstream body previews entirely, or gate body previews behind a separate explicit diagnostic flag.

### 2. Five routine special endpoints remain intentionally unvalidated

The response-schema gap is now explicit rather than accidental. Normal GET descriptors require response schemas. The only unvalidated tool calls use `GET_RAW` for routine special endpoints whose real shapes still need to be modeled:

- `get_routine_structure`
- `get_routine_logs`
- `get_routine_stats`
- `get_routine_date_sequence_display`
- `get_routine_date_sequence_gym`

Relevant files:

- `src/infrastructure/mcp/EndpointDescriptor.ts`
- `src/infrastructure/mcp/EndpointExecutor.ts`
- `src/infrastructure/mcp/endpoints/routineEndpoints.ts`

Risk: contained. These five endpoints can still pass malformed or version-drifted payloads, but the exception is clearly visible in descriptor code.

Recommendation: during Milestone 4 or a hardening pass, capture real Wger payloads for these endpoints and add concrete response schemas. Replace `GET_RAW` descriptors with normal `GET` descriptors once modeled.

### 3. Full application service layer is still not present

The previous "thin architecture boundary" issue is materially improved. MCP tool files no longer know Wger paths, body mapping, or response schemas. However, this is still an infrastructure-level descriptor abstraction, not a full application/use-case service layer.

Relevant files:

- `src/infrastructure/mcp/EndpointExecutor.ts`
- `src/infrastructure/mcp/endpoints/*Endpoints.ts`
- `src/application/ports/Logger.ts`

Risk: low for current personal use and Milestone 4 read/write endpoint expansion. If the project later needs richer domain workflows, cross-endpoint orchestration, policy decisions, caching, or non-MCP transports, application services may still be useful.

Recommendation: continue Milestone 4 with endpoint descriptors. Introduce application services only when behavior becomes more than one Wger endpoint call plus validation/mapping.

## Previously Reported Issues Checked

Fixed:

- Recursive JSON validation is implemented.
- The previous response-schema drift for workout logs and slot entries is fixed.
- Wger exercise image `style` string enum validation is fixed and live-tested.
- Wger ingredient nullable media and compact weight-unit validation is fixed and live-tested.
- Nutritional-value endpoint responses are validated.
- Config response schema assertion is documented as a Wger arbitrary-JSON boundary.
- Stdio stdout pollution from dotenv is fixed.
- Runtime logging uses stderr, not stdout.
- MCP `serverInfo.version` is aligned with package version `0.1.2`.
- `npm pack --dry-run` passes.
- Vitest is configured and the current suite passes.
- Tool execution is centralized through endpoint descriptors and `EndpointExecutor`.
- Tool files no longer call `WgerClient` directly.
- Normal descriptors require response schemas; unvalidated GETs are explicit `GET_RAW` exceptions.
- No tracked `.env`, token, secret, or log files were found.

Still open:

- Debug logs still expose full URLs and debug body previews.
- Five routine special endpoints still need concrete response schemas.
- A full application service layer is not present, though it is not currently required.

## Privacy Notes

The app is suitable for personal use from a privacy standpoint if local logs and configs stay private. The MCP responses intentionally expose Wger data to the connected MCP client, including workouts, weight entries, nutrition data, diary entries, and gallery data. Do not connect this server to an untrusted MCP client.

Before publishing or sharing publicly:

- Do not publish real MCP client config containing your Wger URL or token.
- Keep `.env` untracked.
- Keep generated local runtime folders such as `.crush/` untracked.
- Prefer `LOG_LEVEL=info`.
- Add npm env flags in Claude configs if using `npx`, such as `npm_config_update_notifier=false` and `npm_config_loglevel=error`.
- Consider disabling write tools with `ENABLE_WRITE_TOOLS=false` for read-only deployments.

## Suggested Next Order

1. Start Milestone 4 with read-only reference/config-style endpoint coverage using endpoint descriptors.
2. Add concrete schemas for the five `GET_RAW` routine special endpoints when payload shapes are known.
3. Reduce debug logging of full URLs and remove upstream body previews before public release.
