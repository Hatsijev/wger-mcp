import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WgerClient } from "../../wger/WgerClient.js";
import { Logger } from "../../../application/ports/Logger.js";
import { endpointHandler } from "../EndpointExecutor.js";
import {
  listMeasurementsEndpoint,
  getMeasurementEndpoint,
  createMeasurementEndpoint,
  updateMeasurementEndpoint,
  listMeasurementCategoriesEndpoint,
  getMeasurementCategoryEndpoint,
  createMeasurementCategoryEndpoint,
  updateMeasurementCategoryEndpoint,
} from "../endpoints/measurementEndpoints.js";
import {
  paginationLimitSchema,
  paginationOffsetSchema,
  positiveIntegerIdSchema,
  isoDateTimeStringSchema,
  boundedStringSchema,
} from "../sharedSchemas.js";

const listMeasurementsSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  category: positiveIntegerIdSchema.optional(),
  date: isoDateTimeStringSchema.optional(),
  date__gt: isoDateTimeStringSchema.optional(),
  date__gte: isoDateTimeStringSchema.optional(),
  date__lt: isoDateTimeStringSchema.optional(),
  date__lte: isoDateTimeStringSchema.optional(),
});

const getMeasurementSchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMeasurementSchema = z.object({
  category: positiveIntegerIdSchema,
  date: isoDateTimeStringSchema.optional(),
  value: z.number().min(0).max(5000),
  notes: boundedStringSchema(100).optional(),
});

const updateMeasurementSchema = z.object({
  id: positiveIntegerIdSchema,
  category: positiveIntegerIdSchema.optional(),
  date: isoDateTimeStringSchema.optional(),
  value: z.number().min(0).max(5000).optional(),
  notes: boundedStringSchema(100).optional(),
});

const listMeasurementCategoriesSchema = z.object({
  limit: paginationLimitSchema,
  offset: paginationOffsetSchema,
  ordering: z.string().optional(),
  name: z.string().optional(),
  unit: z.string().optional(),
});

const getMeasurementCategorySchema = z.object({
  id: positiveIntegerIdSchema,
});

const createMeasurementCategorySchema = z.object({
  name: boundedStringSchema(100),
  unit: boundedStringSchema(30),
});

const updateMeasurementCategorySchema = z.object({
  id: positiveIntegerIdSchema,
  name: boundedStringSchema(100).optional(),
  unit: boundedStringSchema(30).optional(),
});

export function registerMeasurementTools(
  server: McpServer,
  client: WgerClient,
  logger: Logger,
  enableWriteTools = true,
): void {
  server.registerTool(
    "list_measurements",
    {
      description: "List body measurements",
      inputSchema: listMeasurementsSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_measurements",
      listMeasurementsEndpoint,
    ),
  );

  server.registerTool(
    "get_measurement",
    {
      description: "Get a measurement by ID",
      inputSchema: getMeasurementSchema,
    },
    endpointHandler(client, logger, "get_measurement", getMeasurementEndpoint),
  );

  server.registerTool(
    "list_measurement_categories",
    {
      description: "List measurement categories",
      inputSchema: listMeasurementCategoriesSchema,
    },
    endpointHandler(
      client,
      logger,
      "list_measurement_categories",
      listMeasurementCategoriesEndpoint,
    ),
  );

  server.registerTool(
    "get_measurement_category",
    {
      description: "Get a measurement category by ID",
      inputSchema: getMeasurementCategorySchema,
    },
    endpointHandler(
      client,
      logger,
      "get_measurement_category",
      getMeasurementCategoryEndpoint,
    ),
  );

  if (enableWriteTools) {
    server.registerTool(
      "create_measurement",
      {
        description: "Create a new body measurement",
        inputSchema: createMeasurementSchema,
      },
      endpointHandler(
        client,
        logger,
        "create_measurement",
        createMeasurementEndpoint,
      ),
    );

    server.registerTool(
      "update_measurement",
      {
        description: "Update an existing body measurement",
        inputSchema: updateMeasurementSchema,
      },
      endpointHandler(
        client,
        logger,
        "update_measurement",
        updateMeasurementEndpoint,
      ),
    );

    server.registerTool(
      "create_measurement_category",
      {
        description: "Create a new measurement category",
        inputSchema: createMeasurementCategorySchema,
      },
      endpointHandler(
        client,
        logger,
        "create_measurement_category",
        createMeasurementCategoryEndpoint,
      ),
    );

    server.registerTool(
      "update_measurement_category",
      {
        description: "Update an existing measurement category",
        inputSchema: updateMeasurementCategorySchema,
      },
      endpointHandler(
        client,
        logger,
        "update_measurement_category",
        updateMeasurementCategoryEndpoint,
      ),
    );
  }

  logger.info("Measurement tools registered");
}
