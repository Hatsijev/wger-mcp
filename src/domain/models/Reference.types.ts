export interface Language {
  readonly id: number;
  readonly short_name: string;
  readonly full_name: string;
  readonly full_name_en: string;
}

export interface License {
  readonly id: number;
  readonly full_name: string;
  readonly short_name: string;
  readonly url: string | null;
}

export interface RepetitionUnit {
  readonly id: number;
  readonly name: string;
  readonly unit_type: "REPETITIONS" | "TIME" | "DISTANCE";
  readonly multiplier: number | null;
}

export interface WeightUnit {
  readonly id: number;
  readonly name: string;
}

export type VersionResponse = string;

export type SchemaResponse = Record<string, unknown>;

export type MinVersionResponse = string;

export interface Measurement {
  readonly id: number;
  readonly category: number;
  readonly date?: string | undefined;
  readonly value: number;
  readonly notes?: string | undefined;
}

export interface MeasurementRequest {
  readonly category: number;
  readonly date?: string | undefined;
  readonly value: number;
  readonly notes?: string | undefined;
}

export interface PatchedMeasurementRequest {
  readonly category?: number | undefined;
  readonly date?: string | undefined;
  readonly value?: number | undefined;
  readonly notes?: string | undefined;
}

export interface MeasurementCategory {
  readonly id: number;
  readonly name: string;
  readonly unit: string;
}

export interface MeasurementCategoryRequest {
  readonly name: string;
  readonly unit: string;
}

export interface PatchedMeasurementCategoryRequest {
  readonly name?: string | undefined;
  readonly unit?: string | undefined;
}

// ── Trophy types ─────────────────────────────────────────────────────────

export type TrophyTypeEnum =
  | "time"
  | "volume"
  | "count"
  | "sequence"
  | "date"
  | "pr"
  | "other";

export interface Trophy {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly trophy_type: TrophyTypeEnum;
  readonly is_hidden: boolean;
  readonly is_progressive: boolean;
  readonly is_repeatable: boolean;
  readonly order: number;
}

export interface TrophyProgress {
  readonly trophy: Trophy;
  readonly is_earned: boolean;
  readonly earned_at: string | null;
  readonly progress: number;
  readonly current_value: string | null;
  readonly target_value: string | null;
  readonly progress_display: string | null;
}

export interface UserTrophy {
  readonly id: number;
  readonly trophy: Trophy;
  readonly earned_at: string;
  readonly progress: number;
  readonly is_notified: boolean;
  readonly context_data: unknown | null;
}

export interface UserStatistics {
  readonly id: number;
  readonly total_weight_lifted: string;
  readonly total_workouts: number;
  readonly current_streak: number;
  readonly longest_streak: number;
  readonly last_workout_date: string | null;
  readonly earliest_workout_time: string | null;
  readonly latest_workout_time: string | null;
  readonly weekend_workout_streak: number;
  readonly last_complete_weekend_date: string | null;
  readonly worked_out_jan_1: boolean;
  readonly last_updated: string;
}
