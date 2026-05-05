import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  IngredientInfo,
  IngredientImage,
  IngredientWeightUnit,
  Meal,
  MealItem,
  NutritionalValues,
  NutritionPlan,
  NutritionDiaryEntry,
  MealRequest,
  PatchedMealRequest,
  MealItemRequest,
  PatchedMealItemRequest,
  NutritionPlanRequest,
  PatchedNutritionPlanRequest,
  LogItemRequest,
  PatchedLogItemRequest,
} from "../../../domain/models/Nutrition.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  ingredientInfoResponseSchema,
  ingredientImageResponseSchema,
  ingredientWeightUnitResponseSchema,
  mealResponseSchema,
  mealItemResponseSchema,
  nutritionalValuesResponseSchema,
  nutritionPlanResponseSchema,
  nutritionDiaryEntryResponseSchema,
} from "../responseSchemas.js";

// ── Ingredient endpoints ──

export const listIngredientsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    search?: string | undefined;
    language?: number | undefined;
  },
  WgerPaginatedResponse<IngredientInfo>
> = {
  method: "GET",
  path: "/api/v2/ingredientinfo/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    name__search: args.search,
    language: args.language,
  }),
  responseSchema: paginatedResponseSchema(ingredientInfoResponseSchema),
};

export const getIngredientEndpoint: EndpointDescriptor<
  { id: number },
  IngredientInfo
> = {
  method: "GET",
  path: (args) => `/api/v2/ingredientinfo/${args.id}/`,
  responseSchema: ingredientInfoResponseSchema,
};

export const searchIngredientsEndpoint: EndpointDescriptor<
  {
    term: string;
    limit?: number | undefined;
    offset?: number | undefined;
  },
  WgerPaginatedResponse<IngredientInfo>
> = {
  method: "GET",
  path: "/api/v2/ingredientinfo/",
  mapParams: (args) => ({
    name__search: args.term,
    limit: args.limit,
    offset: args.offset,
  }),
  responseSchema: paginatedResponseSchema(ingredientInfoResponseSchema),
};

export const getIngredientValuesEndpoint: EndpointDescriptor<
  { id: number },
  IngredientInfo
> = {
  method: "GET",
  path: (args) => `/api/v2/ingredientinfo/${args.id}/get_values/`,
  responseSchema: ingredientInfoResponseSchema,
};

export const listIngredientImagesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ingredient_id?: number | undefined;
  },
  WgerPaginatedResponse<IngredientImage>
> = {
  method: "GET",
  path: "/api/v2/ingredient-image/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ingredient_id: args.ingredient_id,
  }),
  responseSchema: paginatedResponseSchema(ingredientImageResponseSchema),
};

export const getIngredientImageEndpoint: EndpointDescriptor<
  { id: number },
  IngredientImage
> = {
  method: "GET",
  path: (args) => `/api/v2/ingredient-image/${args.id}/`,
  responseSchema: ingredientImageResponseSchema,
};

export const listIngredientWeightUnitsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ingredient?: number | undefined;
  },
  WgerPaginatedResponse<IngredientWeightUnit>
> = {
  method: "GET",
  path: "/api/v2/ingredientweightunit/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ingredient: args.ingredient,
  }),
  responseSchema: paginatedResponseSchema(ingredientWeightUnitResponseSchema),
};

export const getIngredientWeightUnitEndpoint: EndpointDescriptor<
  { id: number },
  IngredientWeightUnit
> = {
  method: "GET",
  path: (args) => `/api/v2/ingredientweightunit/${args.id}/`,
  responseSchema: ingredientWeightUnitResponseSchema,
};

// ── Meal endpoints ──

export const listMealsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    plan?: number | undefined;
    order?: number | undefined;
  },
  WgerPaginatedResponse<Meal>
> = {
  method: "GET",
  path: "/api/v2/meal/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    plan: args.plan,
    order: args.order,
  }),
  responseSchema: paginatedResponseSchema(mealResponseSchema),
};

export const getMealEndpoint: EndpointDescriptor<{ id: number }, Meal> = {
  method: "GET",
  path: (args) => `/api/v2/meal/${args.id}/`,
  responseSchema: mealResponseSchema,
};

export const getMealNutritionalValuesEndpoint: EndpointDescriptor<
  { id: number },
  NutritionalValues
> = {
  method: "GET",
  path: (args) => `/api/v2/meal/${args.id}/nutritional_values/`,
  responseSchema: nutritionalValuesResponseSchema,
};

export const listMealItemsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    meal?: number | undefined;
    ingredient?: number | undefined;
  },
  WgerPaginatedResponse<MealItem>
> = {
  method: "GET",
  path: "/api/v2/mealitem/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    meal: args.meal,
    ingredient: args.ingredient,
  }),
  responseSchema: paginatedResponseSchema(mealItemResponseSchema),
};

export const getMealItemEndpoint: EndpointDescriptor<{ id: number }, MealItem> = {
  method: "GET",
  path: (args) => `/api/v2/mealitem/${args.id}/`,
  responseSchema: mealItemResponseSchema,
};

export const getMealItemNutritionalValuesEndpoint: EndpointDescriptor<
  { id: number },
  NutritionalValues
> = {
  method: "GET",
  path: (args) => `/api/v2/mealitem/${args.id}/nutritional_values/`,
  responseSchema: nutritionalValuesResponseSchema,
};

export const createMealEndpoint: EndpointDescriptor<
  {
    plan: number;
    time?: string | null | undefined;
    name?: string | undefined;
  },
  Meal,
  MealRequest
> = {
  method: "POST",
  path: "/api/v2/meal/",
  mapBody: (args) => args as MealRequest,
  responseSchema: mealResponseSchema,
};

export const updateMealEndpoint: EndpointDescriptor<
  {
    id: number;
    plan?: number | undefined;
    time?: string | null | undefined;
    name?: string | undefined;
  },
  Meal,
  PatchedMealRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/meal/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMealRequest,
  responseSchema: mealResponseSchema,
};

export const createMealItemEndpoint: EndpointDescriptor<
  {
    meal: number;
    ingredient: number;
    weight_unit?: number | null | undefined;
    amount: string;
  },
  MealItem,
  MealItemRequest
> = {
  method: "POST",
  path: "/api/v2/mealitem/",
  mapBody: (args) => args as MealItemRequest,
  responseSchema: mealItemResponseSchema,
};

export const updateMealItemEndpoint: EndpointDescriptor<
  {
    id: number;
    meal?: number | undefined;
    ingredient?: number | undefined;
    weight_unit?: number | null | undefined;
    amount?: string | undefined;
  },
  MealItem,
  PatchedMealItemRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/mealitem/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedMealItemRequest,
  responseSchema: mealItemResponseSchema,
};

// ── Nutrition plan endpoints ──

export const listNutritionPlansEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    description?: string | undefined;
  },
  WgerPaginatedResponse<NutritionPlan>
> = {
  method: "GET",
  path: "/api/v2/nutritionplan/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    description: args.description,
  }),
  responseSchema: paginatedResponseSchema(nutritionPlanResponseSchema),
};

export const getNutritionPlanEndpoint: EndpointDescriptor<
  { id: number },
  NutritionPlan
> = {
  method: "GET",
  path: (args) => `/api/v2/nutritionplan/${args.id}/`,
  responseSchema: nutritionPlanResponseSchema,
};

export const getNutritionPlanNutritionalValuesEndpoint: EndpointDescriptor<
  { id: number },
  NutritionalValues
> = {
  method: "GET",
  path: (args) => `/api/v2/nutritionplan/${args.id}/nutritional_values/`,
  responseSchema: nutritionalValuesResponseSchema,
};

export const createNutritionPlanEndpoint: EndpointDescriptor<
  {
    start?: string | undefined;
    end?: string | null | undefined;
    description?: string | undefined;
    only_logging?: boolean | undefined;
    goal_energy?: number | null | undefined;
    goal_protein?: number | null | undefined;
    goal_carbohydrates?: number | null | undefined;
    goal_fat?: number | null | undefined;
    goal_fiber?: number | null | undefined;
  },
  NutritionPlan,
  NutritionPlanRequest
> = {
  method: "POST",
  path: "/api/v2/nutritionplan/",
  mapBody: (args) => args as NutritionPlanRequest,
  responseSchema: nutritionPlanResponseSchema,
};

export const updateNutritionPlanEndpoint: EndpointDescriptor<
  {
    id: number;
    start?: string | undefined;
    end?: string | null | undefined;
    description?: string | undefined;
    only_logging?: boolean | undefined;
    goal_energy?: number | null | undefined;
    goal_protein?: number | null | undefined;
    goal_carbohydrates?: number | null | undefined;
    goal_fat?: number | null | undefined;
    goal_fiber?: number | null | undefined;
  },
  NutritionPlan,
  PatchedNutritionPlanRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/nutritionplan/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedNutritionPlanRequest,
  responseSchema: nutritionPlanResponseSchema,
};

// ── Nutrition diary endpoints ──

export const listNutritionDiaryEntriesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    plan?: number | undefined;
    date?: string | undefined;
  },
  WgerPaginatedResponse<NutritionDiaryEntry>
> = {
  method: "GET",
  path: "/api/v2/nutritiondiary/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    plan: args.plan,
    datetime__date: args.date,
  }),
  responseSchema: paginatedResponseSchema(nutritionDiaryEntryResponseSchema),
};

export const getNutritionDiaryEntryEndpoint: EndpointDescriptor<
  { id: number },
  NutritionDiaryEntry
> = {
  method: "GET",
  path: (args) => `/api/v2/nutritiondiary/${args.id}/`,
  responseSchema: nutritionDiaryEntryResponseSchema,
};

export const getNutritionDiaryNutritionalValuesEndpoint: EndpointDescriptor<
  { id: number },
  NutritionalValues
> = {
  method: "GET",
  path: (args) => `/api/v2/nutritiondiary/${args.id}/nutritional_values/`,
  responseSchema: nutritionalValuesResponseSchema,
};

export const createNutritionDiaryEntryEndpoint: EndpointDescriptor<
  {
    plan: number;
    meal?: number | null | undefined;
    ingredient: number;
    weight_unit?: number | null | undefined;
    datetime?: string | undefined;
    amount: string;
  },
  NutritionDiaryEntry,
  LogItemRequest
> = {
  method: "POST",
  path: "/api/v2/nutritiondiary/",
  mapBody: (args) => args as LogItemRequest,
  responseSchema: nutritionDiaryEntryResponseSchema,
};

export const updateNutritionDiaryEntryEndpoint: EndpointDescriptor<
  {
    id: number;
    plan?: number | undefined;
    meal?: number | null | undefined;
    ingredient?: number | undefined;
    weight_unit?: number | null | undefined;
    datetime?: string | undefined;
    amount?: string | undefined;
  },
  NutritionDiaryEntry,
  PatchedLogItemRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/nutritiondiary/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedLogItemRequest,
  responseSchema: nutritionDiaryEntryResponseSchema,
};
