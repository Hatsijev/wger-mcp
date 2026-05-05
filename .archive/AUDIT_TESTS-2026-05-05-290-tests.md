# Test Audit Report — Wger MCP Server

> Audited by GLM-5.1. Cross-checked test files against `wger.yaml` (OpenAPI 3.0.3) piece by piece.
> Initial audit: 2026-05-05 (17 files, 192 tests)
> Re-audit: 2026-05-05 (30 files, 290 tests)

---

## Executive Summary

- **30 test files**, **290 tests**, **all passing** (`npx vitest run` — 9.38s)
- Previous audit had 17 files / 192 tests — **+13 new test files, +98 new tests**
- **Both schema bugs (rir, weight) from previous audit are FIXED**
- **All previously missing tool tests now exist** (nutrition + routine sub-entities)
- **Nutrition resource tests now exist** (diary + plan)
- **1 new issue found**: `list_nutrition_plans` now uses `/api/v2/nutritionplan/` (flat) instead of `/api/v2/nutritionplaninfo/` (enriched) — behavioral change, loses `meals` array in response
- **1 dead type**: `NutritionPlanInfo` interface no longer used by any tool or resource

---

## 1. Test Coverage Map

### Previously Covered (17 files, 192 tests — unchanged)

| File                                                           | Lines | Tests | Status                 |
| -------------------------------------------------------------- | ----- | ----- | ---------------------- |
| `src/domain/errors/__tests__/WgerError.spec.ts`                | 43    | 6     | Correct                |
| `src/domain/models/__tests__/Config.types.spec.ts`             | 56    | 5     | Correct                |
| `src/domain/models/__tests__/Json.types.spec.ts`               | 25    | 5     | Correct                |
| `src/domain/models/__tests__/Exercise.types.spec.ts`           | 89    | 9     | Correct                |
| `src/domain/models/__tests__/Routine.types.spec.ts`            | 92    | 7     | Correct                |
| `src/domain/models/__tests__/Nutrition.types.spec.ts`          | 152   | 10    | Correct                |
| `src/infrastructure/__tests__/config.spec.ts`                  | 184   | ~18   | Correct                |
| `src/infrastructure/__tests__/ConsoleLogger.spec.ts`           | 104   | ~13   | Correct                |
| `src/infrastructure/wger/__tests__/WgerClient.spec.ts`         | 358   | ~25   | Thorough               |
| `src/infrastructure/mcp/__tests__/sharedSchemas.spec.ts`       | 187   | ~25   | Correct                |
| `src/infrastructure/mcp/__tests__/responseSchemas.spec.ts`     | —     | —     | Present                |
| `src/infrastructure/mcp/__tests__/server.spec.ts`              | —     | —     | Present                |
| `src/infrastructure/mcp/__tests__/toolResult.spec.ts`          | —     | —     | Present                |
| `src/infrastructure/mcp/resources/__tests__/exercises.spec.ts` | —     | —     | Present                |
| `src/infrastructure/mcp/tools/__tests__/exercises.spec.ts`     | 225   | ~15   | Correct                |
| `src/infrastructure/mcp/tools/__tests__/routineTools.spec.ts`  | 143   | ~12   | Correct but incomplete |
| `src/index.spec.ts`                                            | —     | —     | Present                |

### New Test Files (13 files, +98 tests — added since initial audit)

| File                                                                         | Lines | Tests | Status  |
| ---------------------------------------------------------------------------- | ----- | ----- | ------- |
| `src/infrastructure/mcp/tools/__tests__/mealTools.spec.ts`                   | 126   | 9     | Correct |
| `src/infrastructure/mcp/tools/__tests__/nutritionPlanTools.spec.ts`          | 123   | 9     | Correct |
| `src/infrastructure/mcp/tools/__tests__/nutritionDiaryTools.spec.ts`         | 123   | 9     | Correct |
| `src/infrastructure/mcp/tools/__tests__/ingredientTools.spec.ts`             | 113   | 7     | Correct |
| `src/infrastructure/mcp/tools/__tests__/dayTools.spec.ts`                    | 121   | 9     | Correct |
| `src/infrastructure/mcp/tools/__tests__/slotTools.spec.ts`                   | 113   | 8     | Correct |
| `src/infrastructure/mcp/tools/__tests__/slotEntryTools.spec.ts`              | 126   | 10    | Correct |
| `src/infrastructure/mcp/tools/__tests__/workoutLogTools.spec.ts`             | 115   | 8     | Correct |
| `src/infrastructure/mcp/tools/__tests__/workoutSessionTools.spec.ts`         | 115   | 8     | Correct |
| `src/infrastructure/mcp/tools/__tests__/weightEntryTools.spec.ts`            | 115   | 8     | Correct |
| `src/infrastructure/mcp/tools/__tests__/galleryTools.spec.ts`                | 107   | 7     | Correct |
| `src/infrastructure/mcp/resources/__tests__/nutritionDiaryResources.spec.ts` | 70    | 3     | Correct |
| `src/infrastructure/mcp/resources/__tests__/nutritionPlanResources.spec.ts`  | 70    | 3     | Correct |

### Still Missing Test Files (10 resource files — zero coverage)

| Resource File                                                 | Resources Registered | Test File |
| ------------------------------------------------------------- | -------------------- | --------- |
| `src/infrastructure/mcp/resources/routineResources.ts`        | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/dayResources.ts`            | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/slotResources.ts`           | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/slotEntryResources.ts`      | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/workoutLogResources.ts`     | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/workoutSessionResources.ts` | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/weightEntryResources.ts`    | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/galleryResources.ts`        | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/ingredientResources.ts`     | ~4 resources         | **NONE**  |
| `src/infrastructure/mcp/resources/mealResources.ts`           | ~4 resources         | **NONE**  |

**Total untested resource registrations: ~40 resources**

---

## 2. Schema Mismatches Found (Zod vs OpenAPI Spec)

### BUG-1: `rir` / `rir_target` schema — **FIXED** ✅

**Previous:** `decimalAmountSchema` (`^-?\d{1,4}(?:\.\d{0,2})?$`) was used, allowing 4+2 digits.
**Now:** Dedicated `rirDecimalSchema` (`^-?\d{0,1}(?:\.\d{0,1})?$`) matches OpenAPI pattern exactly.

Verified in `workoutLogTools.spec.ts` line 102-107: `"99.99"` rejected, `"9.9"` accepted.

---

### BUG-2: `weight` in WeightEntry — **FIXED** ✅

**Previous:** `decimalAmountSchema` (`^-?\d{1,4}(?:\.\d{0,2})?$`) was used, allowing 4+2 digits.
**Now:** Dedicated `weightDecimalSchema` (`^-?\d{0,3}(?:\.\d{0,2})?$`) matches OpenAPI pattern exactly.

Verified in `weightEntryTools.spec.ts`: values exceeding 3 digits before decimal are rejected.

---

### `datetime` in nutritionDiaryTools — **FIXED** ✅

Previous audit noted the code used `isoDateStringSchema` (date-only) for `datetime` which should be `format: date-time` per OpenAPI. Now uses `isoDateTimeStringSchema`.

Verified in `nutritionDiaryTools.spec.ts` line 114-115: `"2024-01-01"` rejected, `"2024-01-01T10:00:00"` accepted.

---

## 3. Schema Validation — Verified Correct

All of the following were verified by reading `wger.yaml` chunk by chunk and comparing against the Zod schemas in the tool files:

| Schema                   | Field                 | Code Constraint             | OpenAPI Constraint                   | Match?                               |
| ------------------------ | --------------------- | --------------------------- | ------------------------------------ | ------------------------------------ |
| `RoutineRequest`         | `start`, `end`        | `isoDateStringSchema`       | `format: date`                       | ✅                                   |
| `RoutineRequest`         | `name`                | `boundedStringSchema(25)`   | `maxLength: 25`                      | ✅                                   |
| `RoutineRequest`         | `description`         | `boundedStringSchema(1000)` | `maxLength: 1000`                    | ✅                                   |
| `DayRequest`             | `routine`             | `z.number()` required       | `required: [routine]`                | ✅                                   |
| `DayRequest`             | `name`                | `boundedStringSchema(20)`   | `maxLength: 20`                      | ✅                                   |
| `DayRequest`             | `description`         | `boundedStringSchema(1000)` | `maxLength: 1000`                    | ✅                                   |
| `DayRequest`             | `order`               | `nonNegativeIntegerSchema`  | `minimum: 0, maximum: 2147483647`    | ✅                                   |
| `SlotRequest`            | `comment`             | `boundedStringSchema(200)`  | `maxLength: 200`                     | ✅                                   |
| `SlotRequest`            | `order`               | `nonNegativeIntegerSchema`  | `minimum: 0`                         | ✅                                   |
| `SlotEntryRequest`       | `comment`             | `boundedStringSchema(100)`  | `maxLength: 100`                     | ✅                                   |
| `SlotEntryRequest`       | `repetition_rounding` | `roundingDecimalSchema`     | `pattern: ^-?\d{0,2}(?:\.\d{0,2})?$` | ✅                                   |
| `SlotEntryRequest`       | `weight_rounding`     | `roundingDecimalSchema`     | `pattern: ^-?\d{0,2}(?:\.\d{0,2})?$` | ✅                                   |
| `WorkoutLogRequest`      | `repetitions`         | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅ (1-4 vs 0-4 is better)            |
| `WorkoutLogRequest`      | `weight`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅                                   |
| `WorkoutLogRequest`      | `rir`                 | `rirDecimalSchema`          | `pattern: ^-?\d{0,1}(?:\.\d{0,1})?$` | ✅ **Fixed**                         |
| `WorkoutLogRequest`      | `rest`                | `nonNegativeIntegerSchema`  | `minimum: 0`                         | ✅                                   |
| `WorkoutLogRequest`      | `iteration`           | `nonNegativeIntegerSchema`  | `minimum: 0`                         | ✅                                   |
| `WorkoutSessionRequest`  | `date`                | `isoDateStringSchema`       | `format: date`                       | ✅                                   |
| `WorkoutSessionRequest`  | `time_start`          | `timeStringSchema`          | `format: time`                       | ✅                                   |
| `WorkoutSessionRequest`  | `time_end`            | `timeStringSchema`          | `format: time`                       | ✅                                   |
| `WeightEntryRequest`     | `weight`              | `weightDecimalSchema`       | `pattern: ^-?\d{0,3}(?:\.\d{0,2})?$` | ✅ **Fixed**                         |
| `MealRequest`            | `plan`                | `z.number()` required       | `required: [plan]`                   | ✅                                   |
| `MealRequest`            | `time`                | `timeStringSchema`          | `format: time, nullable: true`       | ✅                                   |
| `MealRequest`            | `name`                | `boundedStringSchema(25)`   | `maxLength: 25`                      | ✅                                   |
| `MealItemRequest`        | `amount`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅                                   |
| `NutritionPlanRequest`   | `start`               | `isoDateStringSchema`       | `format: date`                       | ✅                                   |
| `NutritionPlanRequest`   | `end`                 | `isoDateStringSchema`       | `format: date, nullable: true`       | ✅                                   |
| `NutritionPlanRequest`   | `description`         | `boundedStringSchema(80)`   | `maxLength: 80`                      | ✅                                   |
| `LogItemRequest`         | `amount`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅                                   |
| `LogItemRequest`         | `datetime`            | `isoDateTimeStringSchema`   | `format: date-time`                  | ✅ **Fixed**                         |
| `ImageRequest` (gallery) | `image`               | `boundedStringSchema(2000)` | `format: binary`                     | ⚠️ Known issue — should be multipart |

---

## 4. HTTP Method Verification

All update operations were verified to use `client.patch()` (not `client.put()`). Kimi fixed this correctly.

| File                     | Update Method  | Correct? |
| ------------------------ | -------------- | -------- |
| `routineTools.ts`        | `client.patch` | ✅       |
| `dayTools.ts`            | `client.patch` | ✅       |
| `slotTools.ts`           | `client.patch` | ✅       |
| `slotEntryTools.ts`      | `client.patch` | ✅       |
| `workoutLogTools.ts`     | `client.patch` | ✅       |
| `workoutSessionTools.ts` | `client.patch` | ✅       |
| `weightEntryTools.ts`    | `client.patch` | ✅       |
| `galleryTools.ts`        | `client.patch` | ✅       |
| `mealTools.ts`           | `client.patch` | ✅       |
| `nutritionPlanTools.ts`  | `client.patch` | ✅       |
| `nutritionDiaryTools.ts` | `client.patch` | ✅       |

---

## 5. Endpoint Path Verification

All endpoint paths in tool files were verified against `wger.yaml`:

| Tool                                    | Code Path                                        | OpenAPI Path                                     | Match?                              |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------------ | ----------------------------------- |
| `list_ingredients`                      | `/api/v2/ingredientinfo/`                        | `/api/v2/ingredientinfo/`                        | ✅                                  |
| `get_ingredient`                        | `/api/v2/ingredientinfo/{id}/`                   | `/api/v2/ingredientinfo/{id}/`                   | ✅                                  |
| `get_ingredient_values`                 | `/api/v2/ingredientinfo/{id}/get_values/`        | `/api/v2/ingredientinfo/{id}/get_values/`        | ✅                                  |
| `list_ingredient_images`                | `/api/v2/ingredient-image/`                      | `/api/v2/ingredient-image/`                      | ✅                                  |
| `list_ingredient_weight_units`          | `/api/v2/ingredientweightunit/`                  | `/api/v2/ingredientweightunit/`                  | ✅                                  |
| `list_meals`                            | `/api/v2/meal/`                                  | `/api/v2/meal/`                                  | ✅                                  |
| `get_meal_nutritional_values`           | `/api/v2/meal/{id}/nutritional_values/`          | `/api/v2/meal/{id}/nutritional_values/`          | ✅                                  |
| `list_meal_items`                       | `/api/v2/mealitem/`                              | `/api/v2/mealitem/`                              | ✅                                  |
| `list_nutrition_plans`                  | `/api/v2/nutritionplan/`                         | `/api/v2/nutritionplan/`                         | ✅ (changed from nutritionplaninfo) |
| `get_nutrition_plan`                    | `/api/v2/nutritionplan/{id}/`                    | `/api/v2/nutritionplan/{id}/`                    | ✅ (changed from nutritionplaninfo) |
| `get_nutrition_plan_nutritional_values` | `/api/v2/nutritionplan/{id}/nutritional_values/` | `/api/v2/nutritionplan/{id}/nutritional_values/` | ✅ (now validates response)         |
| `list_nutrition_diary_entries`          | `/api/v2/nutritiondiary/`                        | `/api/v2/nutritiondiary/`                        | ✅                                  |
| `create_nutrition_plan`                 | `/api/v2/nutritionplan/`                         | `/api/v2/nutritionplan/`                         | ✅                                  |

---

## 6. Behavioral Change — `list_nutrition_plans` endpoint

**Severity:** LOW (not a bug, but a change from previous audit)

Previous audit noted `list_nutrition_plans` used `/api/v2/nutritionplaninfo/` (enriched endpoint returning `NutritionPlanInfo` with meals). Now uses `/api/v2/nutritionplan/` (flat endpoint returning `NutritionPlan` without meals).

- `NutritionPlanInfo` type in `Nutrition.types.ts` is now **dead code** — no tool or resource references it
- Tools return flat `NutritionPlan` consistently — resolves the previous "Resource/Tool type inconsistency" finding
- Resources also use `/api/v2/nutritionplan/` — consistent with tools

Verified in `nutritionPlanTools.spec.ts` line 59-68 and `nutritionPlanResources.spec.ts` line 51-60.

---

## 7. Recommendations

### Priority 1 — Schema Fixes (DONE ✅)

1. ~~**Create `rirDecimalSchema`**~~ — Done. `rirDecimalSchema` with pattern `^-?\d{0,1}(?:\.\d{0,1})?$` now used.
2. ~~**Create `weightDecimalSchema`**~~ — Done. `weightDecimalSchema` with pattern `^-?\d{0,3}(?:\.\d{0,2})?$` now used.

### Priority 2 — Missing Test Files (MOSTLY DONE ✅)

3-11. ~~All 9 missing tool test files~~ — Done. All now have `.spec.ts` files.
12-13. Nutrition resource tests — Done. `nutritionDiaryResources.spec.ts` and `nutritionPlanResources.spec.ts` created. 14. **Still missing**: 10 resource test files (routineResources, dayResources, slotResources, slotEntryResources, workoutLogResources, workoutSessionResources, weightEntryResources, galleryResources, ingredientResources, mealResources)

### Priority 3 — Cleanup

15. **Remove dead `NutritionPlanInfo` type** from `Nutrition.types.ts` (no longer referenced)
16. **Gallery image tool** still sends JSON body but API expects `multipart/form-data` (known issue, unchanged)

### Priority 4 — New Improvement ✅

17. **`nutritionalValuesResponseSchema`** added to `responseSchemas.ts` — all 4 `nutritional_values` endpoints (`meal`, `meal_item`, `nutrition_plan`, `nutrition_diary`) now validate response shape against Zod schema matching `NutritionalValues` in `wger.yaml` (8 required number fields: energy, protein, carbohydrates, carbohydrates_sugar, fat, fat_saturated, fiber, sodium). Tests updated to verify 3-argument `client.get()` calls.

---

## Methodology

Every Zod schema in every tool file was compared against the corresponding OpenAPI request schema in `wger.yaml`. The file is ~438KB and cannot be read at once — it was read chunk by chunk using `grep -n` to locate schemas, then `sed -n 'START,ENDp'` to extract specific ranges. All patterns, `maxLength`, `minimum`/`maximum`, `format`, `nullable`, and `required` constraints were verified.
