# Wger MCP Documentation

Welcome to the Wger MCP server documentation.

## What's Inside

| Document                                       | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- |
| [architecture.md](architecture.md)             | High-level architecture and C4 diagrams        |
| [development.md](development.md)               | Setup, build, and quality standards            |
| [api/workouts.md](api/workouts.md)             | Workout, routine, weight, and gallery API docs |
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

## Safety & Configuration

- **Write tools** (create / update) are available by default.
- **Delete tools** require `ENABLE_DESTRUCTIVE_TOOLS=true`. No delete operations are currently exposed for Milestone 2.
- **Admin tools** require `ENABLE_ADMIN_TOOLS=true`.
- **Raw proxy** requires `ENABLE_RAW_WGER_PROXY=true`.

All inputs are validated with Zod before reaching the Wger API.
