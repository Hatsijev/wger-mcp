# Wger MCP Server — Roadmap

## Milestone 1: Bootstrap + Config + Read-Only Reference Data

- [ ] Initialize TypeScript project (package.json, tsconfig.json, strict mode)
- [ ] Install dependencies: MCP SDK, Zod, yaml, dotenv
- [ ] Create `src/config.ts` with env var validation
- [ ] Create `src/wger/WgerClient.ts` with authenticated HTTP client
- [ ] Implement `get_wger_status` tool
- [ ] Implement read-only resources/tools for:
  - [ ] exercises (list, get, search)
  - [ ] muscles
  - [ ] equipment
  - [ ] exercise categories
- [ ] Add basic error handling and logging
- [ ] Verify `tsc --noEmit` passes

## Milestone 2: Workout / Routine / Body Weight

- [ ] routines (list, get, create, update)
- [ ] routine special endpoints (logs, stats, structure, date sequences)
- [ ] days
- [ ] slots
- [ ] slot entries
- [ ] workout logs
- [ ] workout sessions
- [ ] weight entries
- [ ] gallery

## Milestone 3: Nutrition

- [ ] nutrition plans
- [ ] meals
- [ ] meal items
- [ ] ingredients (list, get, search, get_values)
- [ ] ingredient info / images / weight units
- [ ] nutrition diary
- [ ] nutritional values endpoints

## Milestone 4: Remaining Coverage + Safe Writes

- [ ] measurement + measurement categories
- [ ] exercise translations, aliases, comments, images, videos, submissions
- [ ] templates, public templates
- [ ] trophy, user-trophy, user-statistics
- [ ] config endpoints (repetitions, rest, rir, sets, weight, max-\*)
- [ ] languages, licenses, units
- [ ] version, schema, min-app/min-server version

## Milestone 5: Gated + Admin + Polish

- [ ] Implement delete tools behind `ENABLE_DESTRUCTIVE_TOOLS`
- [ ] Implement auth/admin tools behind `ENABLE_ADMIN_TOOLS`
- [ ] Implement raw proxy behind `ENABLE_RAW_WGER_PROXY`
- [ ] Add tests / verification scripts
- [ ] Complete README with setup, env vars, MCP config, safety flags
- [ ] Final docs update
