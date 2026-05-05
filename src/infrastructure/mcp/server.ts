import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../../domain/models/Config.types.js";
import { Logger } from "../../application/ports/Logger.js";
import { WgerClient } from "../wger/WgerClient.js";
import { registerExerciseTools } from "./tools/exercises.js";
import { registerExerciseResources } from "./resources/exercises.js";
import { registerRoutineTools } from "./tools/routineTools.js";
import { registerDayTools } from "./tools/dayTools.js";
import { registerSlotTools } from "./tools/slotTools.js";
import { registerSlotEntryTools } from "./tools/slotEntryTools.js";
import { registerWorkoutLogTools } from "./tools/workoutLogTools.js";
import { registerWorkoutSessionTools } from "./tools/workoutSessionTools.js";
import { registerWeightEntryTools } from "./tools/weightEntryTools.js";
import { registerGalleryTools } from "./tools/galleryTools.js";
import { registerRoutineResources } from "./resources/routineResources.js";
import { registerDayResources } from "./resources/dayResources.js";
import { registerSlotResources } from "./resources/slotResources.js";
import { registerSlotEntryResources } from "./resources/slotEntryResources.js";
import { registerWorkoutLogResources } from "./resources/workoutLogResources.js";
import { registerWorkoutSessionResources } from "./resources/workoutSessionResources.js";
import { registerWeightEntryResources } from "./resources/weightEntryResources.js";
import { registerGalleryResources } from "./resources/galleryResources.js";
import { registerIngredientTools } from "./tools/ingredientTools.js";
import { registerMealTools } from "./tools/mealTools.js";
import { registerNutritionPlanTools } from "./tools/nutritionPlanTools.js";
import { registerNutritionDiaryTools } from "./tools/nutritionDiaryTools.js";
import { registerIngredientResources } from "./resources/ingredientResources.js";
import { registerMealResources } from "./resources/mealResources.js";
import { registerNutritionPlanResources } from "./resources/nutritionPlanResources.js";
import { registerNutritionDiaryResources } from "./resources/nutritionDiaryResources.js";
import { registerReferenceTools } from "./tools/referenceTools.js";
import { registerMeasurementTools } from "./tools/measurementTools.js";
import { registerExerciseDetailTools } from "./tools/exerciseDetailTools.js";
import { registerTemplateTools } from "./tools/templateTools.js";
import { registerTrophyTools } from "./tools/trophyTools.js";
import { registerConfigTools } from "./tools/configTools.js";

const SERVER_NAME = "wger-mcp";
const SERVER_VERSION = "0.1.2";

export function createMcpServer(
  config: Config,
  logger: Logger,
  client: WgerClient,
): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  registerExerciseTools(server, client, logger);
  registerExerciseResources(server, client, logger);
  registerRoutineTools(server, client, logger, config.enableWriteTools);
  registerDayTools(server, client, logger, config.enableWriteTools);
  registerSlotTools(server, client, logger, config.enableWriteTools);
  registerSlotEntryTools(server, client, logger, config.enableWriteTools);
  registerWorkoutLogTools(server, client, logger, config.enableWriteTools);
  registerWorkoutSessionTools(server, client, logger, config.enableWriteTools);
  registerWeightEntryTools(server, client, logger, config.enableWriteTools);
  registerGalleryTools(server, client, logger, config.enableWriteTools);
  registerRoutineResources(server, client, logger);
  registerDayResources(server, client, logger);
  registerSlotResources(server, client, logger);
  registerSlotEntryResources(server, client, logger);
  registerWorkoutLogResources(server, client, logger);
  registerWorkoutSessionResources(server, client, logger);
  registerWeightEntryResources(server, client, logger);
  registerGalleryResources(server, client, logger);
  registerIngredientTools(server, client, logger);
  registerMealTools(server, client, logger, config.enableWriteTools);
  registerNutritionPlanTools(server, client, logger, config.enableWriteTools);
  registerNutritionDiaryTools(server, client, logger, config.enableWriteTools);
  registerIngredientResources(server, client, logger);
  registerMealResources(server, client, logger);
  registerNutritionPlanResources(server, client, logger);
  registerNutritionDiaryResources(server, client, logger);
  registerReferenceTools(server, client, logger);
  registerMeasurementTools(server, client, logger, config.enableWriteTools);
  registerExerciseDetailTools(server, client, logger, config.enableWriteTools);
  registerTemplateTools(server, client, logger);
  registerTrophyTools(server, client, logger);
  registerConfigTools(server, client, logger, config.enableWriteTools);

  logger.debug("MCP server instance created", {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    enableDestructiveTools: config.enableDestructiveTools,
    enableAdminTools: config.enableAdminTools,
    enableRawWgerProxy: config.enableRawWgerProxy,
  });

  return server;
}
