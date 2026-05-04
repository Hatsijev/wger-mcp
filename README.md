# Wger MCP Server

A Model Context Protocol (MCP) server for the self-hosted [Wger](https://wger.de) workout and fitness tracker.

## Overview

This MCP server acts as a complete bridge between AI clients and a Wger API instance, exposing exercises, workouts, nutrition plans, body measurements, and more through MCP tools and resources.

## Setup

### Prerequisites

- Node.js 20+
- A running Wger instance
- Wger API token

### Installation

```bash
npm install
npm run build
```

### Environment Variables

| Variable                   | Required | Default | Description                  |
| -------------------------- | -------- | ------- | ---------------------------- |
| `WGER_BASE_URL`            | Yes      | —       | Wger instance URL            |
| `WGER_API_TOKEN`           | Yes      | —       | API auth token               |
| `WGER_LANGUAGE`            | No       | —       | Default language code        |
| `LOG_LEVEL`                | No       | `info`  | Logging level                |
| `ENABLE_DESTRUCTIVE_TOOLS` | No       | `false` | Enable delete operations     |
| `ENABLE_ADMIN_TOOLS`       | No       | `false` | Enable auth/admin operations |
| `ENABLE_RAW_WGER_PROXY`    | No       | `false` | Enable raw HTTP proxy        |

### MCP Client Configuration

Add to your MCP client config:

```json
{
  "mcpServers": {
    "wger": {
      "command": "node",
      "args": ["/path/to/wger-mcp/dist/index.js"],
      "env": {
        "WGER_BASE_URL": "https://your-wger-instance.com",
        "WGER_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Architecture

```
src/
├── domain/          # Pure business logic
├── application/     # Use cases and ports
├── infrastructure/  # MCP server, HTTP client, config
└── index.ts
```

## Safety

- All inputs validated with Zod before reaching the Wger API.
- **Write tools** (create / update) are enabled by default. The server assumes the API token has appropriate write scope.
- **Delete tools** require `ENABLE_DESTRUCTIVE_TOOLS=true`. No delete operations are currently exposed.
- **Admin operations** require `ENABLE_ADMIN_TOOLS=true`.
- **Raw proxy** requires `ENABLE_RAW_WGER_PROXY=true`.

## Development

```bash
npm run dev      # Watch mode
npm run build    # Production build
npm run lint     # Type check
```

## License

MIT
