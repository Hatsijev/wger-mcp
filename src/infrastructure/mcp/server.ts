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

export function createMcpServer(
  config: Config,
  logger: Logger,
  client: WgerClient,
): McpServer {
  const server = new McpServer(
    { name: "wger-mcp", version: "0.1.0" },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  registerExerciseTools(server, client, logger);
  registerExerciseResources(server, client, logger);
  registerRoutineTools(server, client, logger);
  registerDayTools(server, client, logger);
  registerSlotTools(server, client, logger);
  registerSlotEntryTools(server, client, logger);
  registerWorkoutLogTools(server, client, logger);
  registerWorkoutSessionTools(server, client, logger);
  registerWeightEntryTools(server, client, logger);
  registerGalleryTools(server, client, logger);
  registerRoutineResources(server, client, logger);
  registerDayResources(server, client, logger);
  registerSlotResources(server, client, logger);
  registerSlotEntryResources(server, client, logger);
  registerWorkoutLogResources(server, client, logger);
  registerWorkoutSessionResources(server, client, logger);
  registerWeightEntryResources(server, client, logger);
  registerGalleryResources(server, client, logger);
  registerIngredientTools(server, client, logger);
  registerMealTools(server, client, logger);
  registerNutritionPlanTools(server, client, logger);
  registerNutritionDiaryTools(server, client, logger);
  registerIngredientResources(server, client, logger);
  registerMealResources(server, client, logger);
  registerNutritionPlanResources(server, client, logger);
  registerNutritionDiaryResources(server, client, logger);

  logger.debug("MCP server instance created", {
    name: "wger-mcp",
    version: "0.1.0",
    enableDestructiveTools: config.enableDestructiveTools,
    enableAdminTools: config.enableAdminTools,
    enableRawWgerProxy: config.enableRawWgerProxy,
  });

  return server;
}
