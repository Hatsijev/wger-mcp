# Test Audit Report — Wger MCP Server

> Audited by GLM-5.1. Cross-checked all 17 test files against `wger.yaml` (OpenAPI 3.0.3) piece by piece.
> Date: 2026-05-05

---

## Executive Summary

- **17 test files**, **192 tests**, **all passing** (`npx vitest run` — 4.33s)
- **2 schema mismatches** found between Zod schemas and OpenAPI patterns
- **11 tool files** have **zero test coverage** (nutrition + routine sub-entities)
- **0 resource test files** for routines and nutrition
- Kimi's refactoring fixed the PUT→PATCH issue and introduced proper shared schemas

---

## 1. Test Coverage Map

### Covered (17 files, 192 tests)

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

### Missing Test Files (zero coverage)

| Tool File                                                     | Tools Registered                                                 | Test File |
| ------------------------------------------------------------- | ---------------------------------------------------------------- | --------- |
| `src/infrastructure/mcp/tools/mealTools.ts`                   | 8 (list/get/create/update meal + meal_item + nutritional_values) | **NONE**  |
| `src/infrastructure/mcp/tools/nutritionPlanTools.ts`          | 6 (list/get/create/update plan + nutritional_values)             | **NONE**  |
| `src/infrastructure/mcp/tools/nutritionDiaryTools.ts`         | 6 (list/get/create/update diary + nutritional_values)            | **NONE**  |
| `src/infrastructure/mcp/tools/ingredientTools.ts`             | 8 (list/get/search/weight_units/images)                          | **NONE**  |
| `src/infrastructure/mcp/tools/dayTools.ts`                    | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/slotTools.ts`                   | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/slotEntryTools.ts`              | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/workoutLogTools.ts`             | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/workoutSessionTools.ts`         | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/weightEntryTools.ts`            | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/tools/galleryTools.ts`                | 4 (list/get/create/update)                                       | **NONE**  |
| `src/infrastructure/mcp/resources/nutritionDiaryResources.ts` | 4 resources                                                      | **NONE**  |
| `src/infrastructure/mcp/resources/nutritionPlanResources.ts`  | 4 resources                                                      | **NONE**  |

**Total untested tool registrations: ~60 tools + ~8 resources**

---

## 2. Schema Mismatches Found (Zod vs OpenAPI Spec)

### BUG-1: `rir` / `rir_target` use `decimalAmountSchema` instead of a dedicated schema

**Severity:** MEDIUM

**Location:** `src/infrastructure/mcp/tools/workoutLogTools.ts:49-50`

```
Code uses:  decimalAmountSchema = /^-?\d{1,4}(?:\.\d{0,2})?$/
OpenAPI:    pattern: ^-?\d{0,1}(?:\.\d{0,1})?$
```

The OpenAPI spec restricts `rir` and `rir_target` to **1 digit + 1 decimal place** (e.g., `"9.9"`). The code's `decimalAmountSchema` allows **4 digits + 2 decimal places** (e.g., `"9999.99"`).

**Impact:** Values like `"99.99"` pass Zod validation but the Wger API will reject them.

**Evidence from `wger.yaml` (lines 15893-15902):**

```yaml
rir:
  type: string
  format: decimal
  pattern: ^-?\d{0,1}(?:\.\d{0,1})?$
  nullable: true
rir_target:
  type: string
  format: decimal
  pattern: ^-?\d{0,1}(?:\.\d{0,1})?$
  nullable: true
```

**Fix:** Create a `rirSchema` with pattern `^-?\d{0,1}(?:\.\d{0,1})?$` and use it for `rir`/`rir_target`.

---

### BUG-2: `weight` in WeightEntry uses `decimalAmountSchema` (4 digits) but spec allows only 3

**Severity:** LOW

**Location:** `src/infrastructure/mcp/tools/weightEntryTools.ts:37`

```
Code uses:  decimalAmountSchema = /^-?\d{1,4}(?:\.\d{0,2})?$/
OpenAPI:    pattern: ^-?\d{0,3}(?:\.\d{0,2})?$
```

The OpenAPI spec for `WeightEntryRequest.weight` limits to **3 digits before decimal**. The code allows **4**.

**Impact:** `"9999.99"` passes Zod but the API may reject it.

**Evidence from `wger.yaml` (lines 15740-15748):**

```yaml
WeightEntryRequest:
  properties:
    weight:
      type: string
      format: decimal
      pattern: ^-?\d{0,3}(?:\.\d{0,2})?$
```

**Fix:** Create a `weightEntrySchema` with pattern `^-?\d{0,3}(?:\.\d{0,2})?$` or generalize to a parametric decimal schema.

---

### NOT-A-BUG: `decimalAmountSchema` uses `\d{1,4}` vs spec's `\d{0,4}`

The OpenAPI pattern `^-?\d{0,4}(?:\.\d{0,2})?$` allows 0 digits (empty string, bare `-`). The code's `\d{1,4}` requires at least 1 digit — this is **more correct** than the spec and prevents empty string submission.

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
| `WorkoutLogRequest`      | `rir`                 | `decimalAmountSchema`       | `pattern: ^-?\d{0,1}(?:\.\d{0,1})?$` | ❌ **BUG-1**                         |
| `WorkoutLogRequest`      | `rest`                | `nonNegativeIntegerSchema`  | `minimum: 0`                         | ✅                                   |
| `WorkoutLogRequest`      | `iteration`           | `nonNegativeIntegerSchema`  | `minimum: 0`                         | ✅                                   |
| `WorkoutSessionRequest`  | `date`                | `isoDateStringSchema`       | `format: date`                       | ✅                                   |
| `WorkoutSessionRequest`  | `time_start`          | `timeStringSchema`          | `format: time`                       | ✅                                   |
| `WorkoutSessionRequest`  | `time_end`            | `timeStringSchema`          | `format: time`                       | ✅                                   |
| `WeightEntryRequest`     | `weight`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,3}(?:\.\d{0,2})?$` | ❌ **BUG-2**                         |
| `MealRequest`            | `plan`                | `z.number()` required       | `required: [plan]`                   | ✅                                   |
| `MealRequest`            | `time`                | `timeStringSchema`          | `format: time, nullable: true`       | ✅                                   |
| `MealRequest`            | `name`                | `boundedStringSchema(25)`   | `maxLength: 25`                      | ✅                                   |
| `MealItemRequest`        | `amount`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅                                   |
| `NutritionPlanRequest`   | `start`               | `isoDateStringSchema`       | `format: date`                       | ✅                                   |
| `NutritionPlanRequest`   | `end`                 | `isoDateStringSchema`       | `format: date, nullable: true`       | ✅                                   |
| `NutritionPlanRequest`   | `description`         | `boundedStringSchema(80)`   | `maxLength: 80`                      | ✅                                   |
| `LogItemRequest`         | `amount`              | `decimalAmountSchema`       | `pattern: ^-?\d{0,4}(?:\.\d{0,2})?$` | ✅                                   |
| `LogItemRequest`         | `datetime`            | `isoDateStringSchema`       | `format: date-time`                  | ⚠️ Code uses date-only, not datetime |
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

| Tool                                    | Code Path                                        | OpenAPI Path                                     | Match?             |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------------ | ------------------ |
| `list_ingredients`                      | `/api/v2/ingredientinfo/`                        | `/api/v2/ingredientinfo/`                        | ✅                 |
| `get_ingredient`                        | `/api/v2/ingredientinfo/{id}/`                   | `/api/v2/ingredientinfo/{id}/`                   | ✅                 |
| `get_ingredient_values`                 | `/api/v2/ingredientinfo/{id}/get_values/`        | `/api/v2/ingredientinfo/{id}/get_values/`        | ✅                 |
| `list_ingredient_images`                | `/api/v2/ingredient-image/`                      | `/api/v2/ingredient-image/`                      | ✅                 |
| `list_ingredient_weight_units`          | `/api/v2/ingredientweightunit/`                  | `/api/v2/ingredientweightunit/`                  | ✅                 |
| `list_meals`                            | `/api/v2/meal/`                                  | `/api/v2/meal/`                                  | ✅                 |
| `get_meal_nutritional_values`           | `/api/v2/meal/{id}/nutritional_values/`          | `/api/v2/meal/{id}/nutritional_values/`          | ✅                 |
| `list_meal_items`                       | `/api/v2/mealitem/`                              | `/api/v2/mealitem/`                              | ✅                 |
| `list_nutrition_plans`                  | `/api/v2/nutritionplaninfo/`                     | `/api/v2/nutritionplaninfo/`                     | ✅                 |
| `get_nutrition_plan`                    | `/api/v2/nutritionplaninfo/{id}/`                | `/api/v2/nutritionplaninfo/{id}/`                | ✅                 |
| `get_nutrition_plan_nutritional_values` | `/api/v2/nutritionplan/{id}/nutritional_values/` | `/api/v2/nutritionplan/{id}/nutritional_values/` | ⚠️ Mixed base path |
| `list_nutrition_diary_entries`          | `/api/v2/nutritiondiary/`                        | `/api/v2/nutritiondiary/`                        | ✅                 |
| `create_nutrition_plan`                 | `/api/v2/nutritionplan/`                         | `/api/v2/nutritionplan/`                         | ✅                 |

---

## 6. Recommendations

### Priority 1 — Schema Fixes

1. **Create `rirDecimalSchema`** with pattern `^-?\d{0,1}(?:\.\d{0,1})?$` and use it for `rir`/`rir_target` in `workoutLogTools.ts`
2. **Create `weightDecimalSchema`** with pattern `^-?\d{0,3}(?:\.\d{0,2})?$` and use it for `weight` in `weightEntryTools.ts`

### Priority 2 — Missing Test Files

3. **Create `mealTools.spec.ts`** — test meal/meal_item CRUD + nutritional_values endpoints
4. **Create `nutritionPlanTools.spec.ts`** — test plan CRUD + nutritional_values
5. **Create `nutritionDiaryTools.spec.ts`** — test diary CRUD + nutritional_values
6. **Create `ingredientTools.spec.ts`** — test ingredient/image/weight_unit read tools
7. **Create `dayTools.spec.ts`**, `slotTools.spec.ts`, `slotEntryTools.spec.ts`, `workoutLogTools.spec.ts`, `workoutSessionTools.spec.ts`, `weightEntryTools.spec.ts`, `galleryTools.spec.ts`

### Priority 3 — Edge Case Tests

8. **Test `nutritional_values` response shape** — OpenAPI says these endpoints return parent entity (`Meal`, `MealItem`, `NutritionPlan`, `LogItem`), not `NutritionalValues` directly. Code types them as `NutritionalValues`. Integration test needed to verify actual API response.
9. **Test `datetime` field** in `nutritionDiaryTools.ts` — code uses `isoDateStringSchema` (date-only) but OpenAPI says `format: date-time`.

---

## Methodology

Every Zod schema in every tool file was compared against the corresponding OpenAPI request schema in `wger.yaml`. The file is ~438KB and cannot be read at once — it was read chunk by chunk using `grep -n` to locate schemas, then `sed -n 'START,ENDp'` to extract specific ranges. All patterns, `maxLength`, `minimum`/`maximum`, `format`, `nullable`, and `required` constraints were verified.
