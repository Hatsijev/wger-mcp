export interface ExerciseCategory {
  readonly id: number;
  readonly name: string;
}

export interface Muscle {
  readonly id: number;
  readonly name: string;
  readonly name_en?: string;
  readonly is_front?: boolean;
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
  readonly url?: string | null;
}

export interface ExerciseImage {
  readonly id: number;
  readonly uuid: string;
  readonly exercise: number;
  readonly exercise_uuid: string;
  readonly image: string;
  readonly is_main?: boolean;
  readonly style?: number;
  readonly license?: number;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
  readonly author_history: ReadonlyArray<string>;
  readonly is_ai_generated?: boolean;
}

export interface ExerciseVideoInfo {
  readonly id: number;
  readonly uuid: string;
  readonly exercise: number;
  readonly video: string;
  readonly is_main?: boolean;
  readonly size: number;
  readonly duration: string;
  readonly width: number;
  readonly height: number;
  readonly codec: string;
  readonly codec_long: string;
  readonly license?: number;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
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
  readonly license?: number;
  readonly license_title?: string;
  readonly license_object_url?: string;
  readonly license_author?: string | null;
  readonly license_author_url?: string;
  readonly license_derivative_source_url?: string;
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
  readonly license_author?: string | null;
  readonly images: ReadonlyArray<ExerciseImage>;
  readonly translations: ReadonlyArray<ExerciseTranslationBaseInfo>;
  readonly variation_group?: string | null;
  readonly videos: ReadonlyArray<ExerciseVideoInfo>;
  readonly author_history: ReadonlyArray<string>;
  readonly total_authors_history: ReadonlyArray<string>;
}
