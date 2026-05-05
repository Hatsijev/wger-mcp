export interface ExerciseCategory {
  readonly id: number;
  readonly name: string;
}

export interface Muscle {
  readonly id: number;
  readonly name: string;
  readonly name_en?: string | undefined;
  readonly is_front?: boolean | undefined;
  readonly image_url_main: string;
  readonly image_url_secondary: string;
}

export interface Equipment {
  readonly id: number;
  readonly name: string;
}

export interface ExerciseInfoAlias {
  readonly id: number;
  readonly uuid: string;
  readonly alias: string;
}

export interface ExerciseComment {
  readonly id: number;
  readonly uuid: string;
  readonly translation: number;
  readonly comment: string;
}

export interface Nested {
  readonly id: number;
  readonly full_name: string;
  readonly short_name: string;
  readonly url?: string | null | undefined;
}

export interface ExerciseImage {
  readonly id: number;
  readonly uuid: string;
  readonly exercise: number;
  readonly exercise_uuid: string;
  readonly image: string;
  readonly is_main?: boolean | undefined;
  readonly style?: "1" | "2" | "3" | "4" | "5" | undefined;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
  readonly author_history: ReadonlyArray<string>;
  readonly is_ai_generated?: boolean | undefined;
}

export interface ExerciseVideoInfo {
  readonly id: number;
  readonly uuid: string;
  readonly exercise: number;
  readonly video: string;
  readonly is_main?: boolean | undefined;
  readonly size: number;
  readonly duration: string;
  readonly width: number;
  readonly height: number;
  readonly codec: string;
  readonly codec_long: string;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
  readonly author_history: ReadonlyArray<string>;
}

export interface ExerciseTranslationBaseInfo {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
  readonly exercise: number;
  readonly description: string;
  readonly created: string;
  readonly language: number;
  readonly aliases: ReadonlyArray<ExerciseInfoAlias>;
  readonly notes: ReadonlyArray<ExerciseComment>;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
  readonly author_history: ReadonlyArray<string>;
}

export interface ExerciseInfo {
  readonly id: number;
  readonly uuid: string;
  readonly created: string;
  readonly last_update: string;
  readonly last_update_global: string;
  readonly category: ExerciseCategory;
  readonly muscles: ReadonlyArray<Muscle>;
  readonly muscles_secondary: ReadonlyArray<Muscle>;
  readonly equipment: ReadonlyArray<Equipment>;
  readonly license: Nested;
  readonly license_author?: string | null | undefined;
  readonly images: ReadonlyArray<ExerciseImage>;
  readonly translations: ReadonlyArray<ExerciseTranslationBaseInfo>;
  readonly variation_group?: string | null | undefined;
  readonly videos: ReadonlyArray<ExerciseVideoInfo>;
  readonly author_history: ReadonlyArray<string>;
  readonly total_authors_history: ReadonlyArray<string>;
}

export interface ExerciseTranslationRequest {
  readonly name: string;
  readonly exercise: number;
  readonly description: string;
  readonly description_source?: string | undefined;
  readonly language: number;
  readonly license_author?: string | null | undefined;
}

export interface PatchedExerciseTranslationRequest {
  readonly name?: string | undefined;
  readonly exercise?: number | undefined;
  readonly description?: string | undefined;
  readonly description_source?: string | undefined;
  readonly language?: number | undefined;
  readonly license_author?: string | null | undefined;
}

export interface ExerciseAliasRequest {
  readonly translation: number;
  readonly alias: string;
}

export interface PatchedExerciseAliasRequest {
  readonly translation?: number | undefined;
  readonly alias?: string | undefined;
}

export interface ExerciseCommentRequest {
  readonly translation: number;
  readonly comment: string;
}

export interface PatchedExerciseCommentRequest {
  readonly translation?: number | undefined;
  readonly comment?: string | undefined;
}

export interface ExerciseImageRequest {
  readonly exercise: number;
  readonly image: string;
  readonly is_main?: boolean | undefined;
  readonly style?: "1" | "2" | "3" | "4" | "5" | undefined;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
}

export interface PatchedExerciseImageRequest {
  readonly exercise?: number | undefined;
  readonly image?: string | undefined;
  readonly is_main?: boolean | undefined;
  readonly style?: "1" | "2" | "3" | "4" | "5" | undefined;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
}

export interface ExerciseVideoRequest {
  readonly exercise: number;
  readonly video: string;
  readonly is_main?: boolean | undefined;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
}

export interface PatchedExerciseVideoRequest {
  readonly exercise?: number | undefined;
  readonly video?: string | undefined;
  readonly is_main?: boolean | undefined;
  readonly license?: number | undefined;
  readonly license_title?: string | undefined;
  readonly license_object_url?: string | undefined;
  readonly license_author?: string | null | undefined;
  readonly license_author_url?: string | undefined;
  readonly license_derivative_source_url?: string | undefined;
}

export interface ExerciseSubmissionRequest {
  readonly category: number;
  readonly muscles?: ReadonlyArray<number> | undefined;
  readonly muscles_secondary?: ReadonlyArray<number> | undefined;
  readonly equipment?: ReadonlyArray<number> | undefined;
  readonly variation_group?: string | null | undefined;
  readonly license?: number | undefined;
  readonly license_author?: string | null | undefined;
}
