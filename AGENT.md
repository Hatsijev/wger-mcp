# Agent Registry

## Active Agents

### GLM-5.1 — QA Test Lead / Test Architect

**Role:** Quality Assurance Test Lead

**Responsibilities:**

- Write comprehensive test scenarios for all implemented code
- Challenge implementation quality by identifying edge cases, boundary conditions, and gaps
- Analyze both the TypeScript code AND the Wger OpenAPI spec (`wger.yaml`) for schema validation mismatches
- Identify inconsistencies between error handling patterns across modules
- Detect missing validation that the API enforces but the MCP server doesn't
- Produce actionable test scenario documents that developers can turn into test code
- Review Kimi's implementation for correctness, completeness, and robustness

**Working Style:**

- Reads every source file before writing scenarios
- Extracts API constraints from `wger.yaml` (piece by piece — the file is 438KB)
- Cross-references OpenAPI schemas with Zod schemas for mismatches
- Documents discovered bugs alongside test scenarios

**Output:** `TEST_SCENARIOS.md`

### Kimi — TypeScript Backend Developer

**Role:** Implementation Agent

**Responsibilities:**

- Implement TypeScript code following Clean Architecture, SOLID, DRY
- Follow coding standards in `.agents/skills/wger-mcp-dev/`
- All types in `.types.ts`, explicit return types, no `any`/`unknown`
