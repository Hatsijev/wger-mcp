# Wger MCP Documentation

Welcome to the Wger MCP server documentation.

## What's Inside

| Document                                       | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- |
| [architecture.md](architecture.md)             | High-level architecture and C4 diagrams        |
| [development.md](development.md)               | Setup, build, and quality standards            |
| [api/workouts.md](api/workouts.md)             | Workout, routine, weight, and gallery API docs |
| [api/nutrition.md](api/nutrition.md)           | Nutrition ingredients, meals, plans, and diary |
| [ENDPOINT_INVENTORY.md](ENDPOINT_INVENTORY.md) | Full Wger API endpoint mapping                 |
| [decisions/](decisions/)                       | Architecture Decision Records (ADRs)           |

## Supported Tools & Resources

### Exercises (Milestone 1)

**Tools:**

| Tool                       | Description                                  |
| -------------------------- | -------------------------------------------- |
| `list_exercises`           | List exercises with pagination and filtering |
| `get_exercise`             | Get a single exercise by ID                  |
| `search_exercises`         | Search exercises by name or description      |
| `list_muscles`             | List all muscles                             |
| `list_equipment`           | List all equipment                           |
| `list_exercise_categories` | List all exercise categories                 |
| `get_wger_status`          | Check connectivity to the Wger API           |

**Resources:**

| URI                     | Description                 |
| ----------------------- | --------------------------- |
| `wger://exercises`      | List of exercises           |
| `wger://exercises/{id}` | Single exercise             |
| `wger://muscles`        | List of muscles             |
| `wger://equipment`      | List of equipment           |
| `wger://categories`     | List of exercise categories |

### Workouts / Routines (Milestone 2)

**Read Tools:**

| Tool                                | Description                |
| ----------------------------------- | -------------------------- |
| `list_routines`                     | List routines              |
| `get_routine`                       | Get routine by ID          |
| `list_days`                         | List routine days          |
| `get_day`                           | Get day by ID              |
| `list_slots`                        | List slots                 |
| `get_slot`                          | Get slot by ID             |
| `list_slot_entries`                 | List slot entries          |
| `get_slot_entry`                    | Get slot entry by ID       |
| `list_workout_logs`                 | List workout logs          |
| `get_workout_log`                   | Get workout log by ID      |
| `list_workout_sessions`             | List workout sessions      |
| `get_workout_session`               | Get workout session by ID  |
| `list_weight_entries`               | List weight entries        |
| `get_weight_entry`                  | Get weight entry by ID     |
| `list_gallery_images`               | List gallery images        |
| `get_gallery_image`                 | Get gallery image by ID    |
| `get_routine_structure`             | Get full routine structure |
| `get_routine_logs`                  | Get routine workout logs   |
| `get_routine_stats`                 | Get routine statistics     |
| `get_routine_date_sequence_display` | Get display date sequence  |
| `get_routine_date_sequence_gym`     | Get gym date sequence      |

**Write Tools (create / update):**

| Tool                     | Description                        |
| ------------------------ | ---------------------------------- |
| `create_routine`         | Create a new routine               |
| `update_routine`         | Update an existing routine         |
| `create_day`             | Create a new day                   |
| `update_day`             | Update an existing day             |
| `create_slot`            | Create a new slot                  |
| `update_slot`            | Update an existing slot            |
| `create_slot_entry`      | Create a new slot entry            |
| `update_slot_entry`      | Update an existing slot entry      |
| `create_workout_log`     | Create a new workout log           |
| `update_workout_log`     | Update an existing workout log     |
| `create_workout_session` | Create a new workout session       |
| `update_workout_session` | Update an existing workout session |
| `create_weight_entry`    | Create a new weight entry          |
| `update_weight_entry`    | Update an existing weight entry    |
| `create_gallery_image`   | Create a new gallery image         |
| `update_gallery_image`   | Update an existing gallery image   |

**Resources:**

| URI                            | Description              |
| ------------------------------ | ------------------------ |
| `wger://routines`              | List of routines         |
| `wger://routines/{id}`         | Single routine           |
| `wger://days`                  | List of days             |
| `wger://days/{id}`             | Single day               |
| `wger://slots`                 | List of slots            |
| `wger://slots/{id}`            | Single slot              |
| `wger://slot-entries`          | List of slot entries     |
| `wger://slot-entries/{id}`     | Single slot entry        |
| `wger://workout-logs`          | List of workout logs     |
| `wger://workout-logs/{id}`     | Single workout log       |
| `wger://workout-sessions`      | List of workout sessions |
| `wger://workout-sessions/{id}` | Single workout session   |
| `wger://weight-entries`        | List of weight entries   |
| `wger://weight-entries/{id}`   | Single weight entry      |
| `wger://gallery`               | List of gallery images   |
| `wger://gallery/{id}`          | Single gallery image     |

### Nutrition (Milestone 3)

**Read Tools:**

| Tool                                     | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `list_ingredients`                       | List ingredients                       |
| `get_ingredient`                         | Get ingredient by ID                   |
| `search_ingredients`                     | Search ingredients by name             |
| `get_ingredient_values`                  | Get nutritional values for ingredient  |
| `list_ingredient_images`                 | List ingredient images                 |
| `get_ingredient_image`                   | Get ingredient image by ID             |
| `list_ingredient_weight_units`           | List ingredient weight units           |
| `get_ingredient_weight_unit`             | Get ingredient weight unit by ID       |
| `list_meals`                             | List meals                             |
| `get_meal`                               | Get meal by ID                         |
| `get_meal_nutritional_values`            | Get nutritional values for meal        |
| `list_meal_items`                        | List meal items                        |
| `get_meal_item`                          | Get meal item by ID                    |
| `get_meal_item_nutritional_values`       | Get nutritional values for meal item   |
| `list_nutrition_plans`                   | List nutrition plans                   |
| `get_nutrition_plan`                     | Get nutrition plan by ID               |
| `get_nutrition_plan_nutritional_values`  | Get nutritional values for plan        |
| `list_nutrition_diary_entries`           | List nutrition diary entries           |
| `get_nutrition_diary_entry`              | Get nutrition diary entry by ID        |
| `get_nutrition_diary_nutritional_values` | Get nutritional values for diary entry |

**Write Tools (create / update):**

| Tool                           | Description                              |
| ------------------------------ | ---------------------------------------- |
| `create_meal`                  | Create a new meal                        |
| `update_meal`                  | Update an existing meal                  |
| `create_meal_item`             | Create a new meal item                   |
| `update_meal_item`             | Update an existing meal item             |
| `create_nutrition_plan`        | Create a new nutrition plan              |
| `update_nutrition_plan`        | Update an existing nutrition plan        |
| `create_nutrition_diary_entry` | Create a new nutrition diary entry       |
| `update_nutrition_diary_entry` | Update an existing nutrition diary entry |

**Resources:**

| URI                           | Description                     |
| ----------------------------- | ------------------------------- |
| `wger://ingredients`          | List of ingredients             |
| `wger://ingredients/{id}`     | Single ingredient               |
| `wger://meals`                | List of meals                   |
| `wger://meals/{id}`           | Single meal                     |
| `wger://meal-items`           | List of meal items              |
| `wger://meal-items/{id}`      | Single meal item                |
| `wger://nutrition-plans`      | List of nutrition plans         |
| `wger://nutrition-plans/{id}` | Single nutrition plan           |
| `wger://nutrition-diary`      | List of nutrition diary entries |
| `wger://nutrition-diary/{id}` | Single nutrition diary entry    |

## Safety & Configuration

- **Read tools** are always available.
- **Write tools** (create / update) are enabled by default (`ENABLE_WRITE_TOOLS=true`). The MCP server assumes the API token has appropriate write scope. Set `ENABLE_WRITE_TOOLS=false` to disable all create/update operations.
- **Delete tools** require `ENABLE_DESTRUCTIVE_TOOLS=true`. No delete operations are currently exposed.
- **Admin tools** require `ENABLE_ADMIN_TOOLS=true`.
- **Raw proxy** requires `ENABLE_RAW_WGER_PROXY=true`.

All inputs are validated with Zod before reaching the Wger API.
