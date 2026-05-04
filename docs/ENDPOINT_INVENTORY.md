# Wger API Endpoint Inventory & MCP Mapping

**OpenAPI Version:** 3.0.3

**API Version:** 2.5.0

**Total Endpoints:** 255

**Total Groups:** 60

## Summary by Group

| Group                  | Endpoints | GET | Write | DELETE | Safety          | Resources | Tools |
| ---------------------- | --------- | --- | ----- | ------ | --------------- | --------- | ----- |
| check-language         | 1         | 0   | 1     | 0      | admin-sensitive | 0         | 1     |
| check-permission       | 1         | 1   | 0     | 0      | read-only       | 0         | 0     |
| day                    | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| deletion-log           | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| equipment              | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| exercise               | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| exercise-submission    | 1         | 0   | 1     | 0      | write-capable   | 0         | 1     |
| exercise-translation   | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| exercisealias          | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| exercisecategory       | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| exercisecomment        | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| exerciseimage          | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| exerciseinfo           | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| gallery                | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| ingredient             | 3         | 3   | 0     | 0      | read-only       | 2         | 0     |
| ingredient-image       | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| ingredientinfo         | 3         | 3   | 0     | 0      | read-only       | 2         | 0     |
| ingredientweightunit   | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| language               | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| license                | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| login                  | 1         | 0   | 1     | 0      | admin-sensitive | 0         | 1     |
| max-repetitions-config | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| max-rest-config        | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| max-rir-config         | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| max-sets-config        | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| max-weight-config      | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| meal                   | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| mealitem               | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| measurement            | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| measurement-category   | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| min-app-version        | 1         | 1   | 0     | 0      | read-only       | 0         | 0     |
| min-server-version     | 1         | 1   | 0     | 0      | read-only       | 0         | 0     |
| muscle                 | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| nutritiondiary         | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| nutritionplan          | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| nutritionplaninfo      | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| public-templates       | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| register               | 1         | 0   | 1     | 0      | admin-sensitive | 0         | 1     |
| repetitions-config     | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| rest-config            | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| rir-config             | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| routine                | 11        | 7   | 3     | 1      | destructive     | 2         | 4     |
| schema                 | 1         | 1   | 0     | 0      | read-only       | 0         | 0     |
| sets-config            | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| setting-repetitionunit | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| setting-weightunit     | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| slot                   | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| slot-entry             | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| templates              | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| token                  | 3         | 0   | 3     | 0      | admin-sensitive | 0         | 3     |
| trophy                 | 3         | 3   | 0     | 0      | read-only       | 2         | 0     |
| user-statistics        | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| user-trophy            | 2         | 2   | 0     | 0      | read-only       | 2         | 0     |
| userprofile            | 7         | 3   | 3     | 1      | destructive     | 2         | 4     |
| version                | 1         | 1   | 0     | 0      | read-only       | 0         | 0     |
| video                  | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| weight-config          | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| weightentry            | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| workoutlog             | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |
| workoutsession         | 6         | 2   | 3     | 1      | destructive     | 2         | 4     |

## Detailed MCP Mapping

### check-language

- **Safety:** admin-sensitive
- **Admin-sensitive:** Yes
- **Endpoints:** 1 total (0 read, 1 write, 0 delete)
- **MCP Tools:**
  - `check_language_create`
- **Wger Endpoints:**
  - 🟡 `POST` `/api/v2/check-language/` (check_language_create)

### check-permission

- **Safety:** read-only
- **Admin-sensitive:** Yes
- **Endpoints:** 1 total (1 read, 0 write, 0 delete)
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/check-permission/` (check_permission_retrieve) | resp:PermissionResponse

### day

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://day`
  - `wger://day/{id}`
- **MCP Tools:**
  - `day_create`
  - `day_destroy`
  - `day_partial_update`
  - `day_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/day/` (day_list) | resp:PaginatedDayList
  - 🟡 `POST` `/api/v2/day/` (day_create) | body:DayRequest, resp:Day
  - 🟢 `GET` `/api/v2/day/{id}/` (day_retrieve) | resp:Day
  - 🟡 `PUT` `/api/v2/day/{id}/` (day_update) | body:DayRequest, resp:Day
  - 🟡 `PATCH` `/api/v2/day/{id}/` (day_partial_update) | body:PatchedDayRequest, resp:Day
  - 🔴 `DELETE` `/api/v2/day/{id}/` (day_destroy)

### deletion-log

- **Safety:** read-only
- **Admin-sensitive:** Yes
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://deletion-log`
  - `wger://deletion-log/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/deletion-log/` (deletion_log_list) | resp:PaginatedDeletionLogList
  - 🟢 `GET` `/api/v2/deletion-log/{id}/` (deletion_log_retrieve) | resp:DeletionLog

### equipment

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://equipment`
  - `wger://equipment/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/equipment/` (equipment_list) | resp:PaginatedEquipmentList
  - 🟢 `GET` `/api/v2/equipment/{id}/` (equipment_retrieve) | resp:Equipment

### exercise

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://exercise`
  - `wger://exercise/{id}`
- **MCP Tools:**
  - `exercise_create`
  - `exercise_destroy`
  - `exercise_partial_update`
  - `exercise_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exercise/` (exercise_list) | resp:PaginatedExerciseList
  - 🟡 `POST` `/api/v2/exercise/` (exercise_create) | body:ExerciseRequest, resp:Exercise
  - 🟢 `GET` `/api/v2/exercise/{id}/` (exercise_retrieve) | resp:Exercise
  - 🟡 `PUT` `/api/v2/exercise/{id}/` (exercise_update) | body:ExerciseRequest, resp:Exercise
  - 🟡 `PATCH` `/api/v2/exercise/{id}/` (exercise_partial_update) | body:PatchedExerciseRequest, resp:Exercise
  - 🔴 `DELETE` `/api/v2/exercise/{id}/` (exercise_destroy)

### exercise-submission

- **Safety:** write-capable
- **Endpoints:** 1 total (0 read, 1 write, 0 delete)
- **MCP Tools:**
  - `exercise_submission_create`
- **Wger Endpoints:**
  - 🟡 `POST` `/api/v2/exercise-submission/` (exercise_submission_create) | body:ExerciseSubmissionRequest, resp:ExerciseSubmission

### exercise-translation

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://exercise-translation`
  - `wger://exercise-translation/{id}`
- **MCP Tools:**
  - `exercise_translation_create`
  - `exercise_translation_destroy`
  - `exercise_translation_partial_update`
  - `exercise_translation_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exercise-translation/` (exercise_translation_list) | resp:PaginatedExerciseTranslationList
  - 🟡 `POST` `/api/v2/exercise-translation/` (exercise_translation_create) | body:ExerciseTranslationRequest, resp:ExerciseTranslation
  - 🟢 `GET` `/api/v2/exercise-translation/{id}/` (exercise_translation_retrieve) | resp:ExerciseTranslation
  - 🟡 `PUT` `/api/v2/exercise-translation/{id}/` (exercise_translation_update) | body:ExerciseTranslationRequest, resp:ExerciseTranslation
  - 🟡 `PATCH` `/api/v2/exercise-translation/{id}/` (exercise_translation_partial_update) | body:PatchedExerciseTranslationRequest, resp:ExerciseTranslation
  - 🔴 `DELETE` `/api/v2/exercise-translation/{id}/` (exercise_translation_destroy)

### exercisealias

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://exercisealias`
  - `wger://exercisealias/{id}`
- **MCP Tools:**
  - `exercisealias_create`
  - `exercisealias_destroy`
  - `exercisealias_partial_update`
  - `exercisealias_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exercisealias/` (exercisealias_list) | resp:PaginatedExerciseAliasList
  - 🟡 `POST` `/api/v2/exercisealias/` (exercisealias_create) | body:ExerciseAliasRequest, resp:ExerciseAlias
  - 🟢 `GET` `/api/v2/exercisealias/{id}/` (exercisealias_retrieve) | resp:ExerciseAlias
  - 🟡 `PUT` `/api/v2/exercisealias/{id}/` (exercisealias_update) | body:ExerciseAliasRequest, resp:ExerciseAlias
  - 🟡 `PATCH` `/api/v2/exercisealias/{id}/` (exercisealias_partial_update) | body:PatchedExerciseAliasRequest, resp:ExerciseAlias
  - 🔴 `DELETE` `/api/v2/exercisealias/{id}/` (exercisealias_destroy)

### exercisecategory

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://exercisecategory`
  - `wger://exercisecategory/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exercisecategory/` (exercisecategory_list) | resp:PaginatedExerciseCategoryList
  - 🟢 `GET` `/api/v2/exercisecategory/{id}/` (exercisecategory_retrieve) | resp:ExerciseCategory

### exercisecomment

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://exercisecomment`
  - `wger://exercisecomment/{id}`
- **MCP Tools:**
  - `exercisecomment_create`
  - `exercisecomment_destroy`
  - `exercisecomment_partial_update`
  - `exercisecomment_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exercisecomment/` (exercisecomment_list) | resp:PaginatedExerciseCommentList
  - 🟡 `POST` `/api/v2/exercisecomment/` (exercisecomment_create) | body:ExerciseCommentRequest, resp:ExerciseComment
  - 🟢 `GET` `/api/v2/exercisecomment/{id}/` (exercisecomment_retrieve) | resp:ExerciseComment
  - 🟡 `PUT` `/api/v2/exercisecomment/{id}/` (exercisecomment_update) | body:ExerciseCommentRequest, resp:ExerciseComment
  - 🟡 `PATCH` `/api/v2/exercisecomment/{id}/` (exercisecomment_partial_update) | body:PatchedExerciseCommentRequest, resp:ExerciseComment
  - 🔴 `DELETE` `/api/v2/exercisecomment/{id}/` (exercisecomment_destroy)

### exerciseimage

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://exerciseimage`
  - `wger://exerciseimage/{id}`
- **MCP Tools:**
  - `exerciseimage_create`
  - `exerciseimage_destroy`
  - `exerciseimage_partial_update`
  - `exerciseimage_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exerciseimage/` (exerciseimage_list) | resp:PaginatedExerciseImageList
  - 🟡 `POST` `/api/v2/exerciseimage/` (exerciseimage_create) | body:ExerciseImageRequest, resp:ExerciseImage
  - 🟢 `GET` `/api/v2/exerciseimage/{id}/` (exerciseimage_retrieve) | resp:ExerciseImage
  - 🟡 `PUT` `/api/v2/exerciseimage/{id}/` (exerciseimage_update) | body:ExerciseImageRequest, resp:ExerciseImage
  - 🟡 `PATCH` `/api/v2/exerciseimage/{id}/` (exerciseimage_partial_update) | body:PatchedExerciseImageRequest, resp:ExerciseImage
  - 🔴 `DELETE` `/api/v2/exerciseimage/{id}/` (exerciseimage_destroy)
  - 🟢 `GET` `/api/v2/exerciseimage/{id}/thumbnails/` (exerciseimage_thumbnails_retrieve) | resp:ExerciseImage

### exerciseinfo

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://exerciseinfo`
  - `wger://exerciseinfo/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/exerciseinfo/` (exerciseinfo_list) | resp:PaginatedExerciseInfoList
  - 🟢 `GET` `/api/v2/exerciseinfo/{id}/` (exerciseinfo_retrieve) | resp:ExerciseInfo

### gallery

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://gallery`
  - `wger://gallery/{id}`
- **MCP Tools:**
  - `gallery_create`
  - `gallery_destroy`
  - `gallery_partial_update`
  - `gallery_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/gallery/` (gallery_list) | resp:PaginatedImageList
  - 🟡 `POST` `/api/v2/gallery/` (gallery_create) | body:ImageRequest, resp:Image
  - 🟢 `GET` `/api/v2/gallery/{id}/` (gallery_retrieve) | resp:Image
  - 🟡 `PUT` `/api/v2/gallery/{id}/` (gallery_update) | body:ImageRequest, resp:Image
  - 🟡 `PATCH` `/api/v2/gallery/{id}/` (gallery_partial_update) | body:PatchedImageRequest, resp:Image
  - 🔴 `DELETE` `/api/v2/gallery/{id}/` (gallery_destroy)

### ingredient

- **Safety:** read-only
- **Endpoints:** 3 total (3 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://ingredient`
  - `wger://ingredient/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/ingredient/` (ingredient_list) | resp:PaginatedIngredientList
  - 🟢 `GET` `/api/v2/ingredient/{id}/` (ingredient_retrieve) | resp:Ingredient
  - 🟢 `GET` `/api/v2/ingredient/{id}/get_values/` (ingredient_get_values_retrieve) | resp:Ingredient

### ingredient-image

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://ingredient-image`
  - `wger://ingredient-image/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/ingredient-image/` (ingredient_image_list) | resp:PaginatedIngredientImageList
  - 🟢 `GET` `/api/v2/ingredient-image/{id}/` (ingredient_image_retrieve) | resp:IngredientImage

### ingredientinfo

- **Safety:** read-only
- **Endpoints:** 3 total (3 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://ingredientinfo`
  - `wger://ingredientinfo/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/ingredientinfo/` (ingredientinfo_list) | resp:PaginatedIngredientInfoList
  - 🟢 `GET` `/api/v2/ingredientinfo/{id}/` (ingredientinfo_retrieve) | resp:IngredientInfo
  - 🟢 `GET` `/api/v2/ingredientinfo/{id}/get_values/` (ingredientinfo_get_values_retrieve) | resp:IngredientInfo

### ingredientweightunit

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://ingredientweightunit`
  - `wger://ingredientweightunit/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/ingredientweightunit/` (ingredientweightunit_list) | resp:PaginatedIngredientWeightUnitList
  - 🟢 `GET` `/api/v2/ingredientweightunit/{id}/` (ingredientweightunit_retrieve) | resp:IngredientWeightUnit

### language

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://language`
  - `wger://language/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/language/` (language_list) | resp:PaginatedLanguageList
  - 🟢 `GET` `/api/v2/language/{id}/` (language_retrieve) | resp:Language

### license

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://license`
  - `wger://license/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/license/` (license_list) | resp:PaginatedLicenseList
  - 🟢 `GET` `/api/v2/license/{id}/` (license_retrieve) | resp:License

### login

- **Safety:** admin-sensitive
- **Admin-sensitive:** Yes
- **Endpoints:** 1 total (0 read, 1 write, 0 delete)
- **MCP Tools:**
  - `login_create`
- **Wger Endpoints:**
  - 🟡 `POST` `/api/v2/login/` (login_create) | body:UserLoginRequest, resp:login

### max-repetitions-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://max-repetitions-config`
  - `wger://max-repetitions-config/{id}`
- **MCP Tools:**
  - `max_repetitions_config_create`
  - `max_repetitions_config_destroy`
  - `max_repetitions_config_partial_update`
  - `max_repetitions_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/max-repetitions-config/` (max_repetitions_config_list) | resp:PaginatedMaxRepetitionsConfigList
  - 🟡 `POST` `/api/v2/max-repetitions-config/` (max_repetitions_config_create) | body:MaxRepetitionsConfigRequest, resp:MaxRepetitionsConfig
  - 🟢 `GET` `/api/v2/max-repetitions-config/{id}/` (max_repetitions_config_retrieve) | resp:MaxRepetitionsConfig
  - 🟡 `PUT` `/api/v2/max-repetitions-config/{id}/` (max_repetitions_config_update) | body:MaxRepetitionsConfigRequest, resp:MaxRepetitionsConfig
  - 🟡 `PATCH` `/api/v2/max-repetitions-config/{id}/` (max_repetitions_config_partial_update) | body:PatchedMaxRepetitionsConfigRequest, resp:MaxRepetitionsConfig
  - 🔴 `DELETE` `/api/v2/max-repetitions-config/{id}/` (max_repetitions_config_destroy)

### max-rest-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://max-rest-config`
  - `wger://max-rest-config/{id}`
- **MCP Tools:**
  - `max_rest_config_create`
  - `max_rest_config_destroy`
  - `max_rest_config_partial_update`
  - `max_rest_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/max-rest-config/` (max_rest_config_list) | resp:PaginatedMaxRestConfigList
  - 🟡 `POST` `/api/v2/max-rest-config/` (max_rest_config_create) | body:MaxRestConfigRequest, resp:MaxRestConfig
  - 🟢 `GET` `/api/v2/max-rest-config/{id}/` (max_rest_config_retrieve) | resp:MaxRestConfig
  - 🟡 `PUT` `/api/v2/max-rest-config/{id}/` (max_rest_config_update) | body:MaxRestConfigRequest, resp:MaxRestConfig
  - 🟡 `PATCH` `/api/v2/max-rest-config/{id}/` (max_rest_config_partial_update) | body:PatchedMaxRestConfigRequest, resp:MaxRestConfig
  - 🔴 `DELETE` `/api/v2/max-rest-config/{id}/` (max_rest_config_destroy)

### max-rir-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://max-rir-config`
  - `wger://max-rir-config/{id}`
- **MCP Tools:**
  - `max_rir_config_create`
  - `max_rir_config_destroy`
  - `max_rir_config_partial_update`
  - `max_rir_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/max-rir-config/` (max_rir_config_list) | resp:PaginatedMaxRiRConfigList
  - 🟡 `POST` `/api/v2/max-rir-config/` (max_rir_config_create) | body:MaxRiRConfigRequest, resp:MaxRiRConfig
  - 🟢 `GET` `/api/v2/max-rir-config/{id}/` (max_rir_config_retrieve) | resp:MaxRiRConfig
  - 🟡 `PUT` `/api/v2/max-rir-config/{id}/` (max_rir_config_update) | body:MaxRiRConfigRequest, resp:MaxRiRConfig
  - 🟡 `PATCH` `/api/v2/max-rir-config/{id}/` (max_rir_config_partial_update) | body:PatchedMaxRiRConfigRequest, resp:MaxRiRConfig
  - 🔴 `DELETE` `/api/v2/max-rir-config/{id}/` (max_rir_config_destroy)

### max-sets-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://max-sets-config`
  - `wger://max-sets-config/{id}`
- **MCP Tools:**
  - `max_sets_config_create`
  - `max_sets_config_destroy`
  - `max_sets_config_partial_update`
  - `max_sets_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/max-sets-config/` (max_sets_config_list) | resp:PaginatedMaxSetNrConfigList
  - 🟡 `POST` `/api/v2/max-sets-config/` (max_sets_config_create) | body:MaxSetNrConfigRequest, resp:MaxSetNrConfig
  - 🟢 `GET` `/api/v2/max-sets-config/{id}/` (max_sets_config_retrieve) | resp:MaxSetNrConfig
  - 🟡 `PUT` `/api/v2/max-sets-config/{id}/` (max_sets_config_update) | body:MaxSetNrConfigRequest, resp:MaxSetNrConfig
  - 🟡 `PATCH` `/api/v2/max-sets-config/{id}/` (max_sets_config_partial_update) | body:PatchedMaxSetNrConfigRequest, resp:MaxSetNrConfig
  - 🔴 `DELETE` `/api/v2/max-sets-config/{id}/` (max_sets_config_destroy)

### max-weight-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://max-weight-config`
  - `wger://max-weight-config/{id}`
- **MCP Tools:**
  - `max_weight_config_create`
  - `max_weight_config_destroy`
  - `max_weight_config_partial_update`
  - `max_weight_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/max-weight-config/` (max_weight_config_list) | resp:PaginatedMaxWeightConfigList
  - 🟡 `POST` `/api/v2/max-weight-config/` (max_weight_config_create) | body:MaxWeightConfigRequest, resp:MaxWeightConfig
  - 🟢 `GET` `/api/v2/max-weight-config/{id}/` (max_weight_config_retrieve) | resp:MaxWeightConfig
  - 🟡 `PUT` `/api/v2/max-weight-config/{id}/` (max_weight_config_update) | body:MaxWeightConfigRequest, resp:MaxWeightConfig
  - 🟡 `PATCH` `/api/v2/max-weight-config/{id}/` (max_weight_config_partial_update) | body:PatchedMaxWeightConfigRequest, resp:MaxWeightConfig
  - 🔴 `DELETE` `/api/v2/max-weight-config/{id}/` (max_weight_config_destroy)

### meal

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://meal`
  - `wger://meal/{id}`
- **MCP Tools:**
  - `meal_create`
  - `meal_destroy`
  - `meal_partial_update`
  - `meal_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/meal/` (meal_list) | resp:PaginatedMealList
  - 🟡 `POST` `/api/v2/meal/` (meal_create) | body:MealRequest, resp:Meal
  - 🟢 `GET` `/api/v2/meal/{id}/` (meal_retrieve) | resp:Meal
  - 🟡 `PUT` `/api/v2/meal/{id}/` (meal_update) | body:MealRequest, resp:Meal
  - 🟡 `PATCH` `/api/v2/meal/{id}/` (meal_partial_update) | body:PatchedMealRequest, resp:Meal
  - 🔴 `DELETE` `/api/v2/meal/{id}/` (meal_destroy)
  - 🟢 `GET` `/api/v2/meal/{id}/nutritional_values/` (meal_nutritional_values_retrieve) | resp:Meal

### mealitem

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://mealitem`
  - `wger://mealitem/{id}`
- **MCP Tools:**
  - `mealitem_create`
  - `mealitem_destroy`
  - `mealitem_partial_update`
  - `mealitem_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/mealitem/` (mealitem_list) | resp:PaginatedMealItemList
  - 🟡 `POST` `/api/v2/mealitem/` (mealitem_create) | body:MealItemRequest, resp:MealItem
  - 🟢 `GET` `/api/v2/mealitem/{id}/` (mealitem_retrieve) | resp:MealItem
  - 🟡 `PUT` `/api/v2/mealitem/{id}/` (mealitem_update) | body:MealItemRequest, resp:MealItem
  - 🟡 `PATCH` `/api/v2/mealitem/{id}/` (mealitem_partial_update) | body:PatchedMealItemRequest, resp:MealItem
  - 🔴 `DELETE` `/api/v2/mealitem/{id}/` (mealitem_destroy)
  - 🟢 `GET` `/api/v2/mealitem/{id}/nutritional_values/` (mealitem_nutritional_values_retrieve) | resp:MealItem

### measurement

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://measurement`
  - `wger://measurement/{id}`
- **MCP Tools:**
  - `measurement_create`
  - `measurement_destroy`
  - `measurement_partial_update`
  - `measurement_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/measurement/` (measurement_list) | resp:PaginatedMeasurementList
  - 🟡 `POST` `/api/v2/measurement/` (measurement_create) | body:MeasurementRequest, resp:Measurement
  - 🟢 `GET` `/api/v2/measurement/{id}/` (measurement_retrieve) | resp:Measurement
  - 🟡 `PUT` `/api/v2/measurement/{id}/` (measurement_update) | body:MeasurementRequest, resp:Measurement
  - 🟡 `PATCH` `/api/v2/measurement/{id}/` (measurement_partial_update) | body:PatchedMeasurementRequest, resp:Measurement
  - 🔴 `DELETE` `/api/v2/measurement/{id}/` (measurement_destroy)

### measurement-category

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://measurement-category`
  - `wger://measurement-category/{id}`
- **MCP Tools:**
  - `measurement_category_create`
  - `measurement_category_destroy`
  - `measurement_category_partial_update`
  - `measurement_category_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/measurement-category/` (measurement_category_list) | resp:PaginatedUnitList
  - 🟡 `POST` `/api/v2/measurement-category/` (measurement_category_create) | body:UnitRequest, resp:Unit
  - 🟢 `GET` `/api/v2/measurement-category/{id}/` (measurement_category_retrieve) | resp:Unit
  - 🟡 `PUT` `/api/v2/measurement-category/{id}/` (measurement_category_update) | body:UnitRequest, resp:Unit
  - 🟡 `PATCH` `/api/v2/measurement-category/{id}/` (measurement_category_partial_update) | body:PatchedUnitRequest, resp:Unit
  - 🔴 `DELETE` `/api/v2/measurement-category/{id}/` (measurement_category_destroy)

### min-app-version

- **Safety:** read-only
- **Endpoints:** 1 total (1 read, 0 write, 0 delete)
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/min-app-version/` (min_app_version_retrieve)

### min-server-version

- **Safety:** read-only
- **Endpoints:** 1 total (1 read, 0 write, 0 delete)
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/min-server-version/` (min_server_version_retrieve)

### muscle

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://muscle`
  - `wger://muscle/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/muscle/` (muscle_list) | resp:PaginatedMuscleList
  - 🟢 `GET` `/api/v2/muscle/{id}/` (muscle_retrieve) | resp:Muscle

### nutritiondiary

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://nutritiondiary`
  - `wger://nutritiondiary/{id}`
- **MCP Tools:**
  - `nutritiondiary_create`
  - `nutritiondiary_destroy`
  - `nutritiondiary_partial_update`
  - `nutritiondiary_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/nutritiondiary/` (nutritiondiary_list) | resp:PaginatedLogItemList
  - 🟡 `POST` `/api/v2/nutritiondiary/` (nutritiondiary_create) | body:LogItemRequest, resp:LogItem
  - 🟢 `GET` `/api/v2/nutritiondiary/{id}/` (nutritiondiary_retrieve) | resp:LogItem
  - 🟡 `PUT` `/api/v2/nutritiondiary/{id}/` (nutritiondiary_update) | body:LogItemRequest, resp:LogItem
  - 🟡 `PATCH` `/api/v2/nutritiondiary/{id}/` (nutritiondiary_partial_update) | body:PatchedLogItemRequest, resp:LogItem
  - 🔴 `DELETE` `/api/v2/nutritiondiary/{id}/` (nutritiondiary_destroy)
  - 🟢 `GET` `/api/v2/nutritiondiary/{id}/nutritional_values/` (nutritiondiary_nutritional_values_retrieve) | resp:LogItem

### nutritionplan

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://nutritionplan`
  - `wger://nutritionplan/{id}`
- **MCP Tools:**
  - `nutritionplan_create`
  - `nutritionplan_destroy`
  - `nutritionplan_partial_update`
  - `nutritionplan_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/nutritionplan/` (nutritionplan_list) | resp:PaginatedNutritionPlanList
  - 🟡 `POST` `/api/v2/nutritionplan/` (nutritionplan_create) | body:NutritionPlanRequest, resp:NutritionPlan
  - 🟢 `GET` `/api/v2/nutritionplan/{id}/` (nutritionplan_retrieve) | resp:NutritionPlan
  - 🟡 `PUT` `/api/v2/nutritionplan/{id}/` (nutritionplan_update) | body:NutritionPlanRequest, resp:NutritionPlan
  - 🟡 `PATCH` `/api/v2/nutritionplan/{id}/` (nutritionplan_partial_update) | body:PatchedNutritionPlanRequest, resp:NutritionPlan
  - 🔴 `DELETE` `/api/v2/nutritionplan/{id}/` (nutritionplan_destroy)
  - 🟢 `GET` `/api/v2/nutritionplan/{id}/nutritional_values/` (nutritionplan_nutritional_values_retrieve) | resp:NutritionPlan

### nutritionplaninfo

- **Safety:** destructive
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://nutritionplaninfo`
  - `wger://nutritionplaninfo/{id}`
- **MCP Tools:**
  - `nutritionplaninfo_create`
  - `nutritionplaninfo_destroy`
  - `nutritionplaninfo_partial_update`
  - `nutritionplaninfo_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/nutritionplaninfo/` (nutritionplaninfo_list) | resp:PaginatedNutritionPlanInfoList
  - 🟡 `POST` `/api/v2/nutritionplaninfo/` (nutritionplaninfo_create) | body:NutritionPlanInfoRequest, resp:NutritionPlanInfo
  - 🟢 `GET` `/api/v2/nutritionplaninfo/{id}/` (nutritionplaninfo_retrieve) | resp:NutritionPlanInfo
  - 🟡 `PUT` `/api/v2/nutritionplaninfo/{id}/` (nutritionplaninfo_update) | body:NutritionPlanInfoRequest, resp:NutritionPlanInfo
  - 🟡 `PATCH` `/api/v2/nutritionplaninfo/{id}/` (nutritionplaninfo_partial_update) | body:PatchedNutritionPlanInfoRequest, resp:NutritionPlanInfo
  - 🔴 `DELETE` `/api/v2/nutritionplaninfo/{id}/` (nutritionplaninfo_destroy)
  - 🟢 `GET` `/api/v2/nutritionplaninfo/{id}/nutritional_values/` (nutritionplaninfo_nutritional_values_retrieve) | resp:NutritionPlanInfo

### public-templates

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://public-templates`
  - `wger://public-templates/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/public-templates/` (public_templates_list) | resp:PaginatedRoutineList
  - 🟢 `GET` `/api/v2/public-templates/{id}/` (public_templates_retrieve) | resp:Routine

### register

- **Safety:** admin-sensitive
- **Admin-sensitive:** Yes
- **Endpoints:** 1 total (0 read, 1 write, 0 delete)
- **MCP Tools:**
  - `register_create`
- **Wger Endpoints:**
  - 🟡 `POST` `/api/v2/register/` (register_create) | body:UserRegistrationRequest, resp:login

### repetitions-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://repetitions-config`
  - `wger://repetitions-config/{id}`
- **MCP Tools:**
  - `repetitions_config_create`
  - `repetitions_config_destroy`
  - `repetitions_config_partial_update`
  - `repetitions_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/repetitions-config/` (repetitions_config_list) | resp:PaginatedRepetitionsConfigList
  - 🟡 `POST` `/api/v2/repetitions-config/` (repetitions_config_create) | body:RepetitionsConfigRequest, resp:RepetitionsConfig
  - 🟢 `GET` `/api/v2/repetitions-config/{id}/` (repetitions_config_retrieve) | resp:RepetitionsConfig
  - 🟡 `PUT` `/api/v2/repetitions-config/{id}/` (repetitions_config_update) | body:RepetitionsConfigRequest, resp:RepetitionsConfig
  - 🟡 `PATCH` `/api/v2/repetitions-config/{id}/` (repetitions_config_partial_update) | body:PatchedRepetitionsConfigRequest, resp:RepetitionsConfig
  - 🔴 `DELETE` `/api/v2/repetitions-config/{id}/` (repetitions_config_destroy)

### rest-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://rest-config`
  - `wger://rest-config/{id}`
- **MCP Tools:**
  - `rest_config_create`
  - `rest_config_destroy`
  - `rest_config_partial_update`
  - `rest_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/rest-config/` (rest_config_list) | resp:PaginatedRestConfigList
  - 🟡 `POST` `/api/v2/rest-config/` (rest_config_create) | body:RestConfigRequest, resp:RestConfig
  - 🟢 `GET` `/api/v2/rest-config/{id}/` (rest_config_retrieve) | resp:RestConfig
  - 🟡 `PUT` `/api/v2/rest-config/{id}/` (rest_config_update) | body:RestConfigRequest, resp:RestConfig
  - 🟡 `PATCH` `/api/v2/rest-config/{id}/` (rest_config_partial_update) | body:PatchedRestConfigRequest, resp:RestConfig
  - 🔴 `DELETE` `/api/v2/rest-config/{id}/` (rest_config_destroy)

### rir-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://rir-config`
  - `wger://rir-config/{id}`
- **MCP Tools:**
  - `rir_config_create`
  - `rir_config_destroy`
  - `rir_config_partial_update`
  - `rir_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/rir-config/` (rir_config_list) | resp:PaginatedRiRConfigList
  - 🟡 `POST` `/api/v2/rir-config/` (rir_config_create) | body:RiRConfigRequest, resp:RiRConfig
  - 🟢 `GET` `/api/v2/rir-config/{id}/` (rir_config_retrieve) | resp:RiRConfig
  - 🟡 `PUT` `/api/v2/rir-config/{id}/` (rir_config_update) | body:RiRConfigRequest, resp:RiRConfig
  - 🟡 `PATCH` `/api/v2/rir-config/{id}/` (rir_config_partial_update) | body:PatchedRiRConfigRequest, resp:RiRConfig
  - 🔴 `DELETE` `/api/v2/rir-config/{id}/` (rir_config_destroy)

### routine

- **Safety:** destructive
- **Endpoints:** 11 total (7 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://routine`
  - `wger://routine/{id}`
- **MCP Tools:**
  - `routine_create`
  - `routine_destroy`
  - `routine_partial_update`
  - `routine_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/routine/` (routine_list) | resp:PaginatedRoutineList
  - 🟡 `POST` `/api/v2/routine/` (routine_create) | body:RoutineRequest, resp:Routine
  - 🟢 `GET` `/api/v2/routine/{id}/` (routine_retrieve) | resp:Routine
  - 🟡 `PUT` `/api/v2/routine/{id}/` (routine_update) | body:RoutineRequest, resp:Routine
  - 🟡 `PATCH` `/api/v2/routine/{id}/` (routine_partial_update) | body:PatchedRoutineRequest, resp:Routine
  - 🔴 `DELETE` `/api/v2/routine/{id}/` (routine_destroy)
  - 🟢 `GET` `/api/v2/routine/{id}/date-sequence-display/` (routine_date_sequence_display_retrieve) | resp:Routine
  - 🟢 `GET` `/api/v2/routine/{id}/date-sequence-gym/` (routine_date_sequence_gym_retrieve) | resp:Routine
  - 🟢 `GET` `/api/v2/routine/{id}/logs/` (routine_logs_retrieve) | resp:Routine
  - 🟢 `GET` `/api/v2/routine/{id}/stats/` (routine_stats_retrieve) | resp:Routine
  - 🟢 `GET` `/api/v2/routine/{id}/structure/` (routine_structure_retrieve) | resp:Routine

### schema

- **Safety:** read-only
- **Endpoints:** 1 total (1 read, 0 write, 0 delete)
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/schema` (schema_retrieve)

### sets-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://sets-config`
  - `wger://sets-config/{id}`
- **MCP Tools:**
  - `sets_config_create`
  - `sets_config_destroy`
  - `sets_config_partial_update`
  - `sets_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/sets-config/` (sets_config_list) | resp:PaginatedSetNrConfigList
  - 🟡 `POST` `/api/v2/sets-config/` (sets_config_create) | body:SetNrConfigRequest, resp:SetNrConfig
  - 🟢 `GET` `/api/v2/sets-config/{id}/` (sets_config_retrieve) | resp:SetNrConfig
  - 🟡 `PUT` `/api/v2/sets-config/{id}/` (sets_config_update) | body:SetNrConfigRequest, resp:SetNrConfig
  - 🟡 `PATCH` `/api/v2/sets-config/{id}/` (sets_config_partial_update) | body:PatchedSetNrConfigRequest, resp:SetNrConfig
  - 🔴 `DELETE` `/api/v2/sets-config/{id}/` (sets_config_destroy)

### setting-repetitionunit

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://setting-repetitionunit`
  - `wger://setting-repetitionunit/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/setting-repetitionunit/` (setting_repetitionunit_list) | resp:PaginatedRepetitionUnitList
  - 🟢 `GET` `/api/v2/setting-repetitionunit/{id}/` (setting_repetitionunit_retrieve) | resp:RepetitionUnit

### setting-weightunit

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://setting-weightunit`
  - `wger://setting-weightunit/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/setting-weightunit/` (setting_weightunit_list) | resp:PaginatedRoutineWeightUnitList
  - 🟢 `GET` `/api/v2/setting-weightunit/{id}/` (setting_weightunit_retrieve) | resp:RoutineWeightUnit

### slot

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://slot`
  - `wger://slot/{id}`
- **MCP Tools:**
  - `slot_create`
  - `slot_destroy`
  - `slot_partial_update`
  - `slot_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/slot/` (slot_list) | resp:PaginatedSlotList
  - 🟡 `POST` `/api/v2/slot/` (slot_create) | body:SlotRequest, resp:Slot
  - 🟢 `GET` `/api/v2/slot/{id}/` (slot_retrieve) | resp:Slot
  - 🟡 `PUT` `/api/v2/slot/{id}/` (slot_update) | body:SlotRequest, resp:Slot
  - 🟡 `PATCH` `/api/v2/slot/{id}/` (slot_partial_update) | body:PatchedSlotRequest, resp:Slot
  - 🔴 `DELETE` `/api/v2/slot/{id}/` (slot_destroy)

### slot-entry

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://slot-entry`
  - `wger://slot-entry/{id}`
- **MCP Tools:**
  - `slot_entry_create`
  - `slot_entry_destroy`
  - `slot_entry_partial_update`
  - `slot_entry_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/slot-entry/` (slot_entry_list) | resp:PaginatedSlotEntryList
  - 🟡 `POST` `/api/v2/slot-entry/` (slot_entry_create) | body:SlotEntryRequest, resp:SlotEntry
  - 🟢 `GET` `/api/v2/slot-entry/{id}/` (slot_entry_retrieve) | resp:SlotEntry
  - 🟡 `PUT` `/api/v2/slot-entry/{id}/` (slot_entry_update) | body:SlotEntryRequest, resp:SlotEntry
  - 🟡 `PATCH` `/api/v2/slot-entry/{id}/` (slot_entry_partial_update) | body:PatchedSlotEntryRequest, resp:SlotEntry
  - 🔴 `DELETE` `/api/v2/slot-entry/{id}/` (slot_entry_destroy)

### templates

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://templates`
  - `wger://templates/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/templates/` (templates_list) | resp:PaginatedRoutineList
  - 🟢 `GET` `/api/v2/templates/{id}/` (templates_retrieve) | resp:Routine

### token

- **Safety:** admin-sensitive
- **Admin-sensitive:** Yes
- **Endpoints:** 3 total (0 read, 3 write, 0 delete)
- **MCP Tools:**
  - `token_create`
  - `token_refresh_create`
  - `token_verify_create`
- **Wger Endpoints:**
  - 🟡 `POST` `/api/v2/token` (token_create) | body:TokenObtainPairRequest, resp:TokenObtainPair
  - 🟡 `POST` `/api/v2/token/refresh` (token_refresh_create) | body:TokenRefreshRequest, resp:TokenRefresh
  - 🟡 `POST` `/api/v2/token/verify` (token_verify_create) | body:TokenVerifyRequest

### trophy

- **Safety:** read-only
- **Endpoints:** 3 total (3 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://trophy`
  - `wger://trophy/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/trophy/` (trophy_list) | resp:PaginatedTrophyList
  - 🟢 `GET` `/api/v2/trophy/{id}/` (trophy_retrieve) | resp:Trophy
  - 🟢 `GET` `/api/v2/trophy/progress/` (trophy_progress_list) | resp:PaginatedTrophyProgressList

### user-statistics

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://user-statistics`
  - `wger://user-statistics/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/user-statistics/` (user_statistics_list) | resp:PaginatedUserStatisticsList
  - 🟢 `GET` `/api/v2/user-statistics/{id}/` (user_statistics_retrieve) | resp:UserStatistics

### user-trophy

- **Safety:** read-only
- **Endpoints:** 2 total (2 read, 0 write, 0 delete)
- **MCP Resources:**
  - `wger://user-trophy`
  - `wger://user-trophy/{id}`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/user-trophy/` (user_trophy_list) | resp:PaginatedUserTrophyList
  - 🟢 `GET` `/api/v2/user-trophy/{id}/` (user_trophy_retrieve) | resp:UserTrophy

### userprofile

- **Safety:** destructive
- **Admin-sensitive:** Yes
- **Endpoints:** 7 total (3 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://userprofile`
  - `wger://userprofile/{id}`
- **MCP Tools:**
  - `userprofile_create`
  - `userprofile_destroy`
  - `userprofile_partial_update`
  - `userprofile_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/userprofile/` (userprofile_list) | resp:PaginatedUserprofileList
  - 🟡 `POST` `/api/v2/userprofile/` (userprofile_create) | body:UserprofileRequest, resp:Userprofile
  - 🟢 `GET` `/api/v2/userprofile/{id}/` (userprofile_retrieve) | resp:Userprofile
  - 🟡 `PUT` `/api/v2/userprofile/{id}/` (userprofile_update) | body:UserprofileRequest, resp:Userprofile
  - 🟡 `PATCH` `/api/v2/userprofile/{id}/` (userprofile_partial_update) | body:PatchedUserprofileRequest, resp:Userprofile
  - 🔴 `DELETE` `/api/v2/userprofile/{id}/` (userprofile_destroy)
  - 🟢 `GET` `/api/v2/userprofile/verify-email/` (userprofile_verify_email_retrieve) | resp:Userprofile

### version

- **Safety:** read-only
- **Endpoints:** 1 total (1 read, 0 write, 0 delete)
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/version/` (version_retrieve)

### video

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://video`
  - `wger://video/{id}`
- **MCP Tools:**
  - `video_create`
  - `video_destroy`
  - `video_partial_update`
  - `video_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/video/` (video_list) | resp:PaginatedExerciseVideoList
  - 🟡 `POST` `/api/v2/video/` (video_create) | body:ExerciseVideoRequest, resp:ExerciseVideo
  - 🟢 `GET` `/api/v2/video/{id}/` (video_retrieve) | resp:ExerciseVideo
  - 🟡 `PUT` `/api/v2/video/{id}/` (video_update) | body:ExerciseVideoRequest, resp:ExerciseVideo
  - 🟡 `PATCH` `/api/v2/video/{id}/` (video_partial_update) | body:PatchedExerciseVideoRequest, resp:ExerciseVideo
  - 🔴 `DELETE` `/api/v2/video/{id}/` (video_destroy)

### weight-config

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://weight-config`
  - `wger://weight-config/{id}`
- **MCP Tools:**
  - `weight_config_create`
  - `weight_config_destroy`
  - `weight_config_partial_update`
  - `weight_config_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/weight-config/` (weight_config_list) | resp:PaginatedWeightConfigList
  - 🟡 `POST` `/api/v2/weight-config/` (weight_config_create) | body:WeightConfigRequest, resp:WeightConfig
  - 🟢 `GET` `/api/v2/weight-config/{id}/` (weight_config_retrieve) | resp:WeightConfig
  - 🟡 `PUT` `/api/v2/weight-config/{id}/` (weight_config_update) | body:WeightConfigRequest, resp:WeightConfig
  - 🟡 `PATCH` `/api/v2/weight-config/{id}/` (weight_config_partial_update) | body:PatchedWeightConfigRequest, resp:WeightConfig
  - 🔴 `DELETE` `/api/v2/weight-config/{id}/` (weight_config_destroy)

### weightentry

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://weightentry`
  - `wger://weightentry/{id}`
- **MCP Tools:**
  - `weightentry_create`
  - `weightentry_destroy`
  - `weightentry_partial_update`
  - `weightentry_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/weightentry/` (weightentry_list) | resp:PaginatedWeightEntryList
  - 🟡 `POST` `/api/v2/weightentry/` (weightentry_create) | body:WeightEntryRequest, resp:WeightEntry
  - 🟢 `GET` `/api/v2/weightentry/{id}/` (weightentry_retrieve) | resp:WeightEntry
  - 🟡 `PUT` `/api/v2/weightentry/{id}/` (weightentry_update) | body:WeightEntryRequest, resp:WeightEntry
  - 🟡 `PATCH` `/api/v2/weightentry/{id}/` (weightentry_partial_update) | body:PatchedWeightEntryRequest, resp:WeightEntry
  - 🔴 `DELETE` `/api/v2/weightentry/{id}/` (weightentry_destroy)

### workoutlog

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://workoutlog`
  - `wger://workoutlog/{id}`
- **MCP Tools:**
  - `workoutlog_create`
  - `workoutlog_destroy`
  - `workoutlog_partial_update`
  - `workoutlog_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/workoutlog/` (workoutlog_list) | resp:PaginatedWorkoutLogList
  - 🟡 `POST` `/api/v2/workoutlog/` (workoutlog_create) | body:WorkoutLogRequest, resp:WorkoutLog
  - 🟢 `GET` `/api/v2/workoutlog/{id}/` (workoutlog_retrieve) | resp:WorkoutLog
  - 🟡 `PUT` `/api/v2/workoutlog/{id}/` (workoutlog_update) | body:WorkoutLogRequest, resp:WorkoutLog
  - 🟡 `PATCH` `/api/v2/workoutlog/{id}/` (workoutlog_partial_update) | body:PatchedWorkoutLogRequest, resp:WorkoutLog
  - 🔴 `DELETE` `/api/v2/workoutlog/{id}/` (workoutlog_destroy)

### workoutsession

- **Safety:** destructive
- **Endpoints:** 6 total (2 read, 3 write, 1 delete)
- **MCP Resources:**
  - `wger://workoutsession`
  - `wger://workoutsession/{id}`
- **MCP Tools:**
  - `workoutsession_create`
  - `workoutsession_destroy`
  - `workoutsession_partial_update`
  - `workoutsession_update`
- **Wger Endpoints:**
  - 🟢 `GET` `/api/v2/workoutsession/` (workoutsession_list) | resp:PaginatedWorkoutSessionList
  - 🟡 `POST` `/api/v2/workoutsession/` (workoutsession_create) | body:WorkoutSessionRequest, resp:WorkoutSession
  - 🟢 `GET` `/api/v2/workoutsession/{id}/` (workoutsession_retrieve) | resp:WorkoutSession
  - 🟡 `PUT` `/api/v2/workoutsession/{id}/` (workoutsession_update) | body:WorkoutSessionRequest, resp:WorkoutSession
  - 🟡 `PATCH` `/api/v2/workoutsession/{id}/` (workoutsession_partial_update) | body:PatchedWorkoutSessionRequest, resp:WorkoutSession
  - 🔴 `DELETE` `/api/v2/workoutsession/{id}/` (workoutsession_destroy)
