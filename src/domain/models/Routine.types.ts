export type DayTypeEnum =
  | "custom"
  | "enom"
  | "amrap"
  | "hiit"
  | "tabata"
  | "edt"
  | "rft"
  | "afap";

export type SlotEntryTypeEnum =
  | "normal"
  | "warmup"
  | "dropset"
  | "myo"
  | "partial"
  | "forced"
  | "tut"
  | "iso"
  | "jump";

export type ImpressionEnum = "1" | "2" | "3";

// ── Config type (wger.yaml defines config as nullable with no schema) ────

export type ConfigPrimitive = string | number | boolean | null;

export interface Config {
  readonly [key: string]:
    | ConfigPrimitive
    | Config
    | ReadonlyArray<ConfigPrimitive | Config>;
}

// ── Response types (exact from wger.yaml) ───────────────────────────────

export interface Routine {
  readonly id: number;
  readonly name?: string;
  readonly description?: string;
  readonly created: string;
  readonly start: string;
  readonly end: string;
  readonly fit_in_week?: boolean;
  readonly is_template?: boolean;
  readonly is_public?: boolean;
}

export interface Day {
  readonly id: number;
  readonly routine: number;
  readonly order: number;
  readonly name?: string;
  readonly description?: string;
  readonly is_rest?: boolean;
  readonly need_logs_to_advance?: boolean;
  readonly type?: DayTypeEnum;
  readonly config?: Config | null;
}

export interface Slot {
  readonly id: number;
  readonly day: number;
  readonly order: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface SlotEntry {
  readonly id: number;
  readonly slot: number;
  readonly exercise: number;
  readonly type?: SlotEntryTypeEnum;
  readonly repetition_unit?: number | null;
  readonly repetition_rounding?: string | null;
  readonly weight_unit?: number | null;
  readonly weight_rounding?: string | null;
  readonly order: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface WorkoutLog {
  readonly id: number;
  readonly date: string;
  readonly session: number;
  readonly routine?: number | null;
  readonly iteration?: number | null;
  readonly slot_entry?: number | null;
  readonly next_log?: number | null;
  readonly exercise: number;
  readonly repetitions_unit?: number | null;
  readonly repetitions?: string | null;
  readonly repetitions_target?: string | null;
  readonly weight_unit?: number | null;
  readonly weight?: string | null;
  readonly weight_target?: string | null;
  readonly rir?: string | null;
  readonly rir_target?: string | null;
  readonly rest?: number | null;
  readonly rest_target?: number | null;
}

export interface WorkoutSession {
  readonly id: number;
  readonly routine?: number | null;
  readonly day?: number | null;
  readonly date: string;
  readonly notes?: string | null;
  readonly impression?: ImpressionEnum;
  readonly time_start?: string | null;
  readonly time_end?: string | null;
}

export interface WeightEntry {
  readonly id: number;
  readonly date: string;
  readonly weight: string;
  readonly user: number;
}

export interface GalleryImage {
  readonly id: number;
  readonly date: string;
  readonly image: string;
  readonly description?: string;
  readonly height: number;
  readonly width: number;
}

// ── Request body types for POST (exact from wger.yaml *Request) ──────────

export interface RoutineRequest {
  readonly name?: string;
  readonly description?: string;
  readonly start: string;
  readonly end: string;
  readonly fit_in_week?: boolean;
  readonly is_template?: boolean;
  readonly is_public?: boolean;
}

export interface DayRequest {
  readonly routine: number;
  readonly order?: number;
  readonly name?: string;
  readonly description?: string;
  readonly is_rest?: boolean;
  readonly need_logs_to_advance?: boolean;
  readonly type?: DayTypeEnum;
  readonly config?: Config | null;
}

export interface SlotRequest {
  readonly day: number;
  readonly order?: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface SlotEntryRequest {
  readonly slot: number;
  readonly exercise: number;
  readonly type?: SlotEntryTypeEnum;
  readonly repetition_unit?: number | null;
  readonly repetition_rounding?: string | null;
  readonly weight_unit?: number | null;
  readonly weight_rounding?: string | null;
  readonly order?: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface WorkoutLogRequest {
  readonly date?: string;
  readonly routine?: number | null;
  readonly iteration?: number | null;
  readonly slot_entry?: number | null;
  readonly next_log?: number | null;
  readonly exercise: number;
  readonly repetitions_unit?: number | null;
  readonly repetitions?: string | null;
  readonly repetitions_target?: string | null;
  readonly weight_unit?: number | null;
  readonly weight?: string | null;
  readonly weight_target?: string | null;
  readonly rir?: string | null;
  readonly rir_target?: string | null;
  readonly rest?: number | null;
  readonly rest_target?: number | null;
}

export interface WorkoutSessionRequest {
  readonly routine?: number | null;
  readonly day?: number | null;
  readonly date?: string;
  readonly notes?: string | null;
  readonly impression?: ImpressionEnum;
  readonly time_start?: string | null;
  readonly time_end?: string | null;
}

export interface WeightEntryRequest {
  readonly date: string;
  readonly weight: string;
}

export interface ImageRequest {
  readonly date: string;
  readonly image: string;
  readonly description?: string;
}

// ── PATCH body types (exact from wger.yaml Patched*Request) ──────────────

export interface PatchedRoutineRequest {
  readonly name?: string;
  readonly description?: string;
  readonly start?: string;
  readonly end?: string;
  readonly fit_in_week?: boolean;
  readonly is_template?: boolean;
  readonly is_public?: boolean;
}

export interface PatchedDayRequest {
  readonly routine?: number;
  readonly order?: number;
  readonly name?: string;
  readonly description?: string;
  readonly is_rest?: boolean;
  readonly need_logs_to_advance?: boolean;
  readonly type?: DayTypeEnum;
  readonly config?: Config | null;
}

export interface PatchedSlotRequest {
  readonly day?: number;
  readonly order?: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface PatchedSlotEntryRequest {
  readonly slot?: number;
  readonly exercise?: number;
  readonly type?: SlotEntryTypeEnum;
  readonly repetition_unit?: number | null;
  readonly repetition_rounding?: string | null;
  readonly weight_unit?: number | null;
  readonly weight_rounding?: string | null;
  readonly order?: number;
  readonly comment?: string;
  readonly config?: Config | null;
}

export interface PatchedWorkoutLogRequest {
  readonly date?: string;
  readonly routine?: number | null;
  readonly iteration?: number | null;
  readonly slot_entry?: number | null;
  readonly next_log?: number | null;
  readonly exercise?: number;
  readonly repetitions_unit?: number | null;
  readonly repetitions?: string | null;
  readonly repetitions_target?: string | null;
  readonly weight_unit?: number | null;
  readonly weight?: string | null;
  readonly weight_target?: string | null;
  readonly rir?: string | null;
  readonly rir_target?: string | null;
  readonly rest?: number | null;
  readonly rest_target?: number | null;
}

export interface PatchedWorkoutSessionRequest {
  readonly routine?: number | null;
  readonly day?: number | null;
  readonly date?: string;
  readonly notes?: string | null;
  readonly impression?: ImpressionEnum;
  readonly time_start?: string | null;
  readonly time_end?: string | null;
}

export interface PatchedWeightEntryRequest {
  readonly date?: string;
  readonly weight?: string;
}

export interface PatchedImageRequest {
  readonly date?: string;
  readonly image?: string;
  readonly description?: string;
}
