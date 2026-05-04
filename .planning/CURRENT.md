# Current Plan — Wger MCP Server

## Objective

Build a complete TypeScript MCP server for the self-hosted Wger workout/fitness tracker API.

## Architecture

AI client → Wger MCP Server → Wger API

## Key Constraints

- TypeScript with official MCP SDK
- Zod for input validation
- Clean architecture: domain / application / infrastructure
- Zero `any`/`unknown`, no inline types
- All destructive/admin/raw tools disabled by default
- Environment variables for all config and credentials

## Environment Variables

- `WGER_BASE_URL`
- `WGER_API_TOKEN`
- `WGER_LANGUAGE` (optional)
- `LOG_LEVEL` (optional)
- `ENABLE_DESTRUCTIVE_TOOLS=false`
- `ENABLE_ADMIN_TOOLS=false`
- `ENABLE_RAW_WGER_PROXY=false`

## Safety Gates

| Gate                 | Env Var                    | Default |
| -------------------- | -------------------------- | ------- |
| Destructive (delete) | `ENABLE_DESTRUCTIVE_TOOLS` | `false` |
| Admin/user/auth      | `ENABLE_ADMIN_TOOLS`       | `false` |
| Raw HTTP proxy       | `ENABLE_RAW_WGER_PROXY`    | `false` |

## Endpoint Inventory

See `docs/ENDPOINT_INVENTORY.md` for the complete 255-endpoint analysis.

Key totals:

- 60 endpoint groups
- 210 schemas
- Read-only reference data: equipment, muscles, categories, languages, licenses, units
- Exercise domain: exercise, translation, alias, comment, image, info, video, submission
- Routine/Workout domain: routine, day, slot, slot-entry, workoutlog, workoutsession
- Nutrition domain: ingredient, meal, mealitem, nutritionplan, nutritionplaninfo, nutritiondiary
- Body data: weightentry, measurement, measurement-category, gallery
- Config: repetitions-config, rest-config, rir-config, sets-config, weight-config, max-\*-config
- Auth/Admin: login, register, token, check-permission, check-language, userprofile, deletion-log

## Active Milestone

**Milestone 1** — Project bootstrap + config + WgerClient + read-only exercise reference data.
