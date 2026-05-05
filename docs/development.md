# Development Guide

## Prerequisites

- Node.js 20+
- A running Wger instance
- A Wger API token

## Setup

```bash
# Install dependencies
npm install
```

Create a `.env` file (or export the variables directly):

```bash
WGER_BASE_URL=https://your-wger-instance.com
WGER_API_TOKEN=your-token-here
# Optional:
# LOG_LEVEL=info
# ENABLE_WRITE_TOOLS=true
# ENABLE_DESTRUCTIVE_TOOLS=false
# ENABLE_ADMIN_TOOLS=false
# ENABLE_RAW_WGER_PROXY=false
```

## Build

```bash
npm run build
```

Compiles TypeScript from `src/` to `dist/`.

## Development

```bash
npm run dev
```

Runs the compiler in watch mode.

## Quality Checks

```bash
npm run lint
```

Runs `tsc --noEmit` to type-check the entire project without emitting files.

## Quality Standards Summary

| Standard               | Rule                                                               |
| ---------------------- | ------------------------------------------------------------------ |
| TypeScript strict mode | `strict: true`, `exactOptionalPropertyTypes: true`                 |
| Zero `any` / `unknown` | No implicit or explicit `any` in application or domain code        |
| Explicit types         | All functions, ports, and public APIs declare return types         |
| Input validation       | All external inputs validated with Zod before entering the domain  |
| Clean Architecture     | Domain → Application → Infrastructure; no inward dependencies      |
| Error handling         | Domain errors only; infrastructure maps HTTP errors to `WgerError` |
