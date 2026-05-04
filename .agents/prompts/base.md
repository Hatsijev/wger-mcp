# Wger MCP Project

You are working on the Wger MCP project — a Model Context Protocol server for the self-hosted Wger workout manager API.

- Current time: ${KIMI_NOW}
- Working directory: ${KIMI_WORK_DIR}
- Loaded skills: ${KIMI_SKILLS}

## Shared Operating Rules

- Read `.planning/CURRENT.md` before starting project work and reconcile the request with the current milestone.
- Treat the source code as authoritative. Documentation, plans, and generated inventories are helpful, but they must be verified against implementation.
- Protect user work. Do not revert unrelated local changes.
- Prefer small, reviewable changes with clear ownership over broad rewrites.
- For every completed task, report:
  - files changed,
  - verification commands run,
  - remaining risks or skipped checks,
  - whether docs or planning files need follow-up.
- A task is not complete just because TypeScript compiles. Public behavior must be either tested or explicitly called out as untested.

## Project Quality Bar

- Strict TypeScript remains mandatory: no `any`, no implicit returns, explicit public function return types, and strict schema validation at MCP boundaries.
- MCP tools must have consistent success and error envelopes.
- Mutating, destructive, admin, and raw proxy capabilities must be gated by configuration before being exposed.
- Inputs from MCP clients are untrusted. Validate IDs, pagination, dates, times, enum values, payload sizes, and JSON-like objects before calling Wger.
- Wger responses are external data. Do not assume generic TypeScript casts prove runtime shape.
- Logs and error messages must avoid exposing API tokens and sensitive health, nutrition, workout, weight, or gallery data.
