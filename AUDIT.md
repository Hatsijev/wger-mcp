# Wger MCP Implementation Audit

Date: 2026-05-05

## Scope

Review of the current TypeScript MCP server implementation after the npm packaging, stdio, response-validation, and test-suite updates. Scope covers `AGENTS.md`, current source code, `wger.yaml`, package scripts, npm packaging metadata, runtime stdio behavior, privacy posture, and verification commands.

Archived previous audit snapshots:

- `.archive/AUDIT-2026-05-05-before-current-review.md`
- `.archive/AUDIT-2026-05-04-before-app-review.md`

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm test` passes: 30 test files, 290 tests. Re-run after nutritional-value schema wiring.
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run` passes for `wger-mcp@0.1.2`.
- `npm_config_cache=/tmp/npm-cache npm audit --omit=dev` passes with 0 vulnerabilities.
- Stdio startup check passes: captured stdout is 0 bytes; logs go to stderr.
- Source/package grep found no runtime `console.log`, `process.stdout`, `◇`, or `injected env` output.
- Privacy check: no tracked `.env`, token, secret, or log files were found.
- Live Wger validation with local `.env` passes:
  - `get_exercise` for `/api/v2/exerciseinfo/50/` validates 4 image styles as string enum values.
  - `list_ingredients` for `/api/v2/ingredientinfo/?limit=10&offset=0` validates nullable `image`, nullable `thumbnails`, and compact `weight_units`.

Current worktree note: the app currently includes uncommitted source/test changes. This audit treats those changes as the current app state and does not revert them.

## Current State

The app is usable for personal MCP usage over stdio and is package-ready for npm. Exercise/reference data, routine/workout/weight/gallery, and nutrition tools/resources are registered through split domain modules in `src/infrastructure/mcp/server.ts`.

Notable improvements since the previous audit:

- Package metadata is ready for npm:
  - CLI bin: `wger-mcp`.
  - Package version: `0.1.2`.
  - License: `GPL-3.0-or-later`.
  - `prepack` performs a clean build.
  - Published package files are limited to `dist/**/*`, `.env.example`, `README.md`, and `LICENSE`.
- Stdio safety issue is fixed:
  - `dotenv.config({ quiet: true })` suppresses dotenv's stdout banner.
  - `ConsoleLogger` writes to stderr.
  - Runtime stdout is empty until MCP protocol messages.
- MCP `serverInfo.version` is no longer stale; it reports `0.1.2`.
- The Wger exercise image style mismatch is fixed:
  - `images[].style` validates as Wger's string enum `"1"` through `"5"`.
- The Wger ingredient response mismatch is fixed:
  - `IngredientInfo.image` and `IngredientInfo.thumbnails` allow `null`.
  - `IngredientInfo.weight_units` uses a separate `IngredientWeightUnitInfo` schema without requiring `ingredient`.
- Nutritional-value endpoints now validate responses with `nutritionalValuesResponseSchema`.
- The config response schema type assertion is documented as a Wger arbitrary-JSON boundary.
- Tests are now configured with Vitest and pass.
- Production TypeScript build excludes test files, so broken test-only imports cannot block npm packaging.
- `npm audit --omit=dev` currently reports 0 vulnerabilities.

## Findings

### 1. Debug logs can expose personal Wger metadata/data

The API token is not logged, and normal `LOG_LEVEL=info` is acceptable for personal use. At debug level, `WgerClient` still logs full request URLs and debug error body previews. URLs can include dates, routine IDs, diary filters, ingredient searches, or other private metadata. Error body previews may include private Wger data depending on upstream error shape.

Relevant files:

- `src/infrastructure/wger/WgerClient.ts`
- `src/infrastructure/ConsoleLogger.ts`

Risk: safe for personal use when logs remain private and `LOG_LEVEL=info`; not ideal for public support logs or shared bug reports.

Recommendation: before wider public release, log method + path without query string and remove upstream body previews entirely, or gate body previews behind a separate explicit diagnostic flag.

### 2. Clean Architecture boundary remains thin

The code is organized by MCP domain module, but MCP transport handlers still call `WgerClient` directly. The application layer remains mostly the logger port.

Relevant files:

- `src/application/ports/Logger.ts`
- `src/infrastructure/mcp/tools/*`
- `src/infrastructure/wger/WgerClient.ts`

Risk: manageable at the current size, but Milestone 4 expansion can make path/schema/error behavior harder to share consistently.

Recommendation: before adding broad Milestone 4 endpoint coverage, introduce endpoint descriptors or application services that centralize method/path/schema/response handling per domain.

## Previously Reported Issues Checked

Fixed:

- Recursive JSON validation is implemented.
- The previous response-schema drift for workout logs and slot entries is fixed.
- Wger exercise image `style` string enum validation is fixed and live-tested.
- Wger ingredient nullable media and compact weight-unit validation is fixed and live-tested.
- Nutritional-value endpoint responses are now validated with `nutritionalValuesResponseSchema`.
- The config response schema type assertion is now documented as a Wger arbitrary-JSON boundary.
- Stdio stdout pollution from dotenv is fixed.
- Runtime logging uses stderr, not stdout.
- MCP `serverInfo.version` is aligned with package version `0.1.2`.
- `npm pack --dry-run` passes.
- `npm audit --omit=dev` reports 0 vulnerabilities.
- Vitest is configured and the current suite passes.
- No tracked `.env`, token, secret, or log files were found.

Still open:

- Debug logs still expose full URLs and debug body previews.
- The application layer remains thin.

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

1. Reduce debug logging of full URLs and remove upstream body previews before public release.
2. Introduce application services or endpoint descriptors before Milestone 4 expansion.
