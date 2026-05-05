import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listMaxRepetitionsConfigsEndpoint,
  getMaxRepetitionsConfigEndpoint,
  createMaxRepetitionsConfigEndpoint,
  updateMaxRepetitionsConfigEndpoint,
  deleteMaxRepetitionsConfigEndpoint,
  listMaxRestConfigsEndpoint,
  getMaxRestConfigEndpoint,
  createMaxRestConfigEndpoint,
  updateMaxRestConfigEndpoint,
  deleteMaxRestConfigEndpoint,
  listMaxRiRConfigsEndpoint,
  getMaxRiRConfigEndpoint,
  createMaxRiRConfigEndpoint,
  updateMaxRiRConfigEndpoint,
  deleteMaxRiRConfigEndpoint,
  listMaxSetNrConfigsEndpoint,
  getMaxSetNrConfigEndpoint,
  createMaxSetNrConfigEndpoint,
  updateMaxSetNrConfigEndpoint,
  deleteMaxSetNrConfigEndpoint,
  listMaxWeightConfigsEndpoint,
  getMaxWeightConfigEndpoint,
  createMaxWeightConfigEndpoint,
  updateMaxWeightConfigEndpoint,
  deleteMaxWeightConfigEndpoint,
} from "../endpoints/configEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
} from "../sharedSchemas.js";

// ── Max Repetitions Config Schemas ───────────────────────────────────────

const listMaxRepetitionsConfigsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getMaxRepetitionsConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMaxRepetitionsConfigSchema = z.object({
  slot_entry: positiveIntegerIdSchema,
  iteration: z.number().int().min(0),
  value: z.string(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const updateMaxRepetitionsConfigSchema = z.object({
  id: positiveIntegerIdSchema,
  slot_entry: positiveIntegerIdSchema.optional(),
  iteration: z.number().int().min(0).optional(),
  value: z.string().optional(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const deleteMaxRepetitionsConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

// ── Max Rest Config Schemas ──────────────────────────────────────────────

const listMaxRestConfigsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getMaxRestConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMaxRestConfigSchema = z.object({
  slot_entry: positiveIntegerIdSchema,
  iteration: z.number().int().min(0),
  value: z.number().int().min(0).max(600),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const updateMaxRestConfigSchema = z.object({
  id: positiveIntegerIdSchema,
  slot_entry: positiveIntegerIdSchema.optional(),
  iteration: z.number().int().min(0).optional(),
  value: z.number().int().min(0).max(600).optional(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const deleteMaxRestConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

// ── Max RiR Config Schemas ───────────────────────────────────────────────

const listMaxRiRConfigsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getMaxRiRConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMaxRiRConfigSchema = z.object({
  slot_entry: positiveIntegerIdSchema,
  iteration: z.number().int().min(0),
  value: z.string(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const updateMaxRiRConfigSchema = z.object({
  id: positiveIntegerIdSchema,
  slot_entry: positiveIntegerIdSchema.optional(),
  iteration: z.number().int().min(0).optional(),
  value: z.string().optional(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const deleteMaxRiRConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

// ── Max Set Nr Config Schemas ────────────────────────────────────────────

const listMaxSetNrConfigsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getMaxSetNrConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMaxSetNrConfigSchema = z.object({
  slot_entry: positiveIntegerIdSchema,
  iteration: z.number().int().min(0),
  value: z.number().int().min(0).max(50),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const updateMaxSetNrConfigSchema = z.object({
  id: positiveIntegerIdSchema,
  slot_entry: positiveIntegerIdSchema.optional(),
  iteration: z.number().int().min(0).optional(),
  value: z.number().int().min(0).max(50).optional(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const deleteMaxSetNrConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

// ── Max Weight Config Schemas ────────────────────────────────────────────

const listMaxWeightConfigsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
});

const getMaxWeightConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMaxWeightConfigSchema = z.object({
  slot_entry: positiveIntegerIdSchema,
  iteration: z.number().int().min(0),
  value: z.string(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const updateMaxWeightConfigSchema = z.object({
  id: positiveIntegerIdSchema,
  slot_entry: positiveIntegerIdSchema.optional(),
  iteration: z.number().int().min(0).optional(),
  value: z.string().optional(),
  operation: z.enum(["+", "-", "r"]).optional(),
  step: z.enum(["na", "abs", "percent"]).optional(),
  repeat: z.boolean().optional(),
  requirements: z.unknown().nullable().optional(),
});

const deleteMaxWeightConfigSchema = z.object({
  id: positiveIntegerIdSchema,
});

export function registerConfigTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  // ── Max Repetitions Config Tools ──────────────────────────────────────

  server.registerTool(
    "list_max_repetitions_configs",
    { description: "List max repetitions configs", inputSchema: listMaxRepetitionsConfigsSchema },
    endpointHandler(client, logger, "list_max_repetitions_configs", listMaxRepetitionsConfigsEndpoint),
  );

  server.registerTool(
    "get_max_repetitions_config",
    { description: "Get a max repetitions config by ID", inputSchema: getMaxRepetitionsConfigSchema },
    endpointHandler(client, logger, "get_max_repetitions_config", getMaxRepetitionsConfigEndpoint),
  );

  // ── Max Rest Config Tools ─────────────────────────────────────────────

  server.registerTool(
    "list_max_rest_configs",
    { description: "List max rest configs", inputSchema: listMaxRestConfigsSchema },
    endpointHandler(client, logger, "list_max_rest_configs", listMaxRestConfigsEndpoint),
  );

  server.registerTool(
    "get_max_rest_config",
    { description: "Get a max rest config by ID", inputSchema: getMaxRestConfigSchema },
    endpointHandler(client, logger, "get_max_rest_config", getMaxRestConfigEndpoint),
  );

  // ── Max RiR Config Tools ──────────────────────────────────────────────

  server.registerTool(
    "list_max_rir_configs",
    { description: "List max RiR configs", inputSchema: listMaxRiRConfigsSchema },
    endpointHandler(client, logger, "list_max_rir_configs", listMaxRiRConfigsEndpoint),
  );

  server.registerTool(
    "get_max_rir_config",
    { description: "Get a max RiR config by ID", inputSchema: getMaxRiRConfigSchema },
    endpointHandler(client, logger, "get_max_rir_config", getMaxRiRConfigEndpoint),
  );

  // ── Max Set Nr Config Tools ───────────────────────────────────────────

  server.registerTool(
    "list_max_set_nr_configs",
    { description: "List max set number configs", inputSchema: listMaxSetNrConfigsSchema },
    endpointHandler(client, logger, "list_max_set_nr_configs", listMaxSetNrConfigsEndpoint),
  );

  server.registerTool(
    "get_max_set_nr_config",
    { description: "Get a max set number config by ID", inputSchema: getMaxSetNrConfigSchema },
    endpointHandler(client, logger, "get_max_set_nr_config", getMaxSetNrConfigEndpoint),
  );

  // ── Max Weight Config Tools ───────────────────────────────────────────

  server.registerTool(
    "list_max_weight_configs",
    { description: "List max weight configs", inputSchema: listMaxWeightConfigsSchema },
    endpointHandler(client, logger, "list_max_weight_configs", listMaxWeightConfigsEndpoint),
  );

  server.registerTool(
    "get_max_weight_config",
    { description: "Get a max weight config by ID", inputSchema: getMaxWeightConfigSchema },
    endpointHandler(client, logger, "get_max_weight_config", getMaxWeightConfigEndpoint),
  );

  if (enableWriteTools) {
    // ── Max Repetitions Config Write Tools ──────────────────────────────

    server.registerTool(
      "create_max_repetitions_config",
      { description: "Create a max repetitions config", inputSchema: createMaxRepetitionsConfigSchema },
      endpointHandler(client, logger, "create_max_repetitions_config", createMaxRepetitionsConfigEndpoint),
    );

    server.registerTool(
      "update_max_repetitions_config",
      { description: "Update a max repetitions config", inputSchema: updateMaxRepetitionsConfigSchema },
      endpointHandler(client, logger, "update_max_repetitions_config", updateMaxRepetitionsConfigEndpoint),
    );

    server.registerTool(
      "delete_max_repetitions_config",
      { description: "Delete a max repetitions config", inputSchema: deleteMaxRepetitionsConfigSchema },
      endpointHandler(client, logger, "delete_max_repetitions_config", deleteMaxRepetitionsConfigEndpoint),
    );

    // ── Max Rest Config Write Tools ─────────────────────────────────────

    server.registerTool(
      "create_max_rest_config",
      { description: "Create a max rest config", inputSchema: createMaxRestConfigSchema },
      endpointHandler(client, logger, "create_max_rest_config", createMaxRestConfigEndpoint),
    );

    server.registerTool(
      "update_max_rest_config",
      { description: "Update a max rest config", inputSchema: updateMaxRestConfigSchema },
      endpointHandler(client, logger, "update_max_rest_config", updateMaxRestConfigEndpoint),
    );

    server.registerTool(
      "delete_max_rest_config",
      { description: "Delete a max rest config", inputSchema: deleteMaxRestConfigSchema },
      endpointHandler(client, logger, "delete_max_rest_config", deleteMaxRestConfigEndpoint),
    );

    // ── Max RiR Config Write Tools ──────────────────────────────────────

    server.registerTool(
      "create_max_rir_config",
      { description: "Create a max RiR config", inputSchema: createMaxRiRConfigSchema },
      endpointHandler(client, logger, "create_max_rir_config", createMaxRiRConfigEndpoint),
    );

    server.registerTool(
      "update_max_rir_config",
      { description: "Update a max RiR config", inputSchema: updateMaxRiRConfigSchema },
      endpointHandler(client, logger, "update_max_rir_config", updateMaxRiRConfigEndpoint),
    );

    server.registerTool(
      "delete_max_rir_config",
      { description: "Delete a max RiR config", inputSchema: deleteMaxRiRConfigSchema },
      endpointHandler(client, logger, "delete_max_rir_config", deleteMaxRiRConfigEndpoint),
    );

    // ── Max Set Nr Config Write Tools ───────────────────────────────────

    server.registerTool(
      "create_max_set_nr_config",
      { description: "Create a max set number config", inputSchema: createMaxSetNrConfigSchema },
      endpointHandler(client, logger, "create_max_set_nr_config", createMaxSetNrConfigEndpoint),
    );

    server.registerTool(
      "update_max_set_nr_config",
      { description: "Update a max set number config", inputSchema: updateMaxSetNrConfigSchema },
      endpointHandler(client, logger, "update_max_set_nr_config", updateMaxSetNrConfigEndpoint),
    );

    server.registerTool(
      "delete_max_set_nr_config",
      { description: "Delete a max set number config", inputSchema: deleteMaxSetNrConfigSchema },
      endpointHandler(client, logger, "delete_max_set_nr_config", deleteMaxSetNrConfigEndpoint),
    );

    // ── Max Weight Config Write Tools ───────────────────────────────────

    server.registerTool(
      "create_max_weight_config",
      { description: "Create a max weight config", inputSchema: createMaxWeightConfigSchema },
      endpointHandler(client, logger, "create_max_weight_config", createMaxWeightConfigEndpoint),
    );

    server.registerTool(
      "update_max_weight_config",
      { description: "Update a max weight config", inputSchema: updateMaxWeightConfigSchema },
      endpointHandler(client, logger, "update_max_weight_config", updateMaxWeightConfigEndpoint),
    );

    server.registerTool(
      "delete_max_weight_config",
      { description: "Delete a max weight config", inputSchema: deleteMaxWeightConfigSchema },
      endpointHandler(client, logger, "delete_max_weight_config", deleteMaxWeightConfigEndpoint),
    );
  }

  logger.info("Config tools registered");
}
