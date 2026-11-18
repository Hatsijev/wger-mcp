# Wger MCP Server

> [!WARNING]
> This project is archived and no longer maintained. I stopped using Wger because it did not fit my needs and I could
> not see a clear direction for the product. The code stays available as is, under the GPL-3.0 license. Issues and pull
> requests are not accepted, but you are free to fork it.

A Model Context Protocol (MCP) server for the self-hosted [Wger](https://wger.de) workout and fitness tracker.

## Overview

This MCP server acts as a complete bridge between AI clients and a Wger API instance, exposing exercises, workouts, nutrition plans, body measurements, and more through MCP tools and resources.

## Setup

### Prerequisites

- Node.js 20+
- A running Wger instance
- Wger API token

### Obtaining a Wger API Token

1. Log in to your Wger instance web UI.
2. Navigate to **User → API Key** (or `/en/user/api-key/`).
3. Copy the generated token.

### Installation

From npm:

```bash
npm install -g wger-mcp
```

From source:

```bash
npm install
npm run build
```

## Environment Variables

All configuration is done through environment variables. The server loads them automatically (via `dotenv`) if a `.env` file is present in the working directory.

### Required

| Variable         | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `WGER_BASE_URL`  | Base URL of your Wger instance (e.g. `https://wger.example.com`) |
| `WGER_API_TOKEN` | API token from your Wger user profile                            |

### Optional

| Variable                   | Default | Valid values                     | Description                                                        |
| -------------------------- | ------- | -------------------------------- | ------------------------------------------------------------------ |
| `WGER_LANGUAGE`            | —       | Any string                       | Default language code for exercise lookups (e.g. `en`, `de`, `fr`) |
| `WGER_REQUEST_TIMEOUT_MS`  | `30000` | `1000` – `300000`                | HTTP request timeout to the Wger API in milliseconds               |
| `LOG_LEVEL`                | `info`  | `debug`, `info`, `warn`, `error` | Server logging verbosity                                           |
| `ENABLE_WRITE_TOOLS`       | `true`  | `true`, `false`                  | Register create / update MCP tools                                 |
| `ENABLE_DESTRUCTIVE_TOOLS` | `false` | `true`, `false`                  | Register delete MCP tools                                          |
| `ENABLE_ADMIN_TOOLS`       | `false` | `true`, `false`                  | Register auth / admin MCP tools                                    |
| `ENABLE_RAW_WGER_PROXY`    | `false` | `true`, `false`                  | Enable raw HTTP proxy tool for direct Wger API access              |

> **Boolean env vars:** Only the literal string `true` (case-insensitive) enables a flag. Any other value or an unset variable is treated as `false`. For flags that default to `true`, explicitly set `ENABLE_WRITE_TOOLS=false` to disable them.

### Full `.env` Example

```bash
# Required
WGER_BASE_URL=https://your-wger-instance.com
WGER_API_TOKEN=your-token-here

# Optional
WGER_LANGUAGE=en
WGER_REQUEST_TIMEOUT_MS=30000
LOG_LEVEL=info
ENABLE_WRITE_TOOLS=true
ENABLE_DESTRUCTIVE_TOOLS=false
ENABLE_ADMIN_TOOLS=false
ENABLE_RAW_WGER_PROXY=false
```

## MCP Client Configuration

Add to your MCP client config (e.g. Claude Desktop, Cline, etc.):

### Minimal configuration

```json
{
  "mcpServers": {
    "wger": {
      "command": "npx",
      "args": ["-y", "wger-mcp"],
      "env": {
        "WGER_BASE_URL": "https://your-wger-instance.com",
        "WGER_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Full configuration

```json
{
  "mcpServers": {
    "wger": {
      "command": "npx",
      "args": ["-y", "wger-mcp"],
      "env": {
        "WGER_BASE_URL": "https://your-wger-instance.com",
        "WGER_API_TOKEN": "your-token-here",
        "WGER_LANGUAGE": "en",
        "WGER_REQUEST_TIMEOUT_MS": "30000",
        "LOG_LEVEL": "info",
        "ENABLE_WRITE_TOOLS": "true",
        "ENABLE_DESTRUCTIVE_TOOLS": "false",
        "ENABLE_ADMIN_TOOLS": "false",
        "ENABLE_RAW_WGER_PROXY": "false"
      }
    }
  }
}
```

### Local source checkout

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
- HTTP requests time out after `WGER_REQUEST_TIMEOUT_MS` (default 30s) and surface as MCP errors.
- Logs are written to stderr so MCP stdio transport remains reserved for protocol messages.
- **Write tools** (create / update) are enabled by default. The server assumes the API token has appropriate write scope.
- **Delete tools** require `ENABLE_DESTRUCTIVE_TOOLS=true`. No delete operations are currently exposed.
- **Admin operations** require `ENABLE_ADMIN_TOOLS=true`.
- **Raw proxy** requires `ENABLE_RAW_WGER_PROXY=true`.

## Development

```bash
npm run dev      # Watch mode
npm run build    # Production build
npm run lint     # Type check
npm pack --dry-run
```

## License

GNU General Public License v3.0 or later. See `LICENSE`.
