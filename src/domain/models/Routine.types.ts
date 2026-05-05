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
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly created: string;
  readonly start: string;
  readonly end: string;
  readonly fit_in_week?: boolean | undefined;
  readonly is_template?: boolean | undefined;
  readonly is_public?: boolean | undefined;
}

export interface Day {
  readonly id: number;
  readonly routine: number;
  readonly order: number;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly is_rest?: boolean | undefined;
  readonly need_logs_to_advance?: boolean | undefined;
  readonly type?: DayTypeEnum | undefined;
  readonly config?: Config | null | undefined;
}

export interface Slot {
  readonly id: number;
  readonly day: number;
  readonly order: number;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface SlotEntry {
  readonly id: number;
  readonly slot: number;
  readonly exercise: number;
  readonly type?: SlotEntryTypeEnum | undefined;
  readonly repetition_unit?: number | null | undefined;
  readonly repetition_rounding?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight_rounding?: string | null | undefined;
  readonly order: number;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface WorkoutLog {
  readonly id: number;
  readonly date: string;
  readonly session: number;
  readonly routine?: number | null | undefined;
  readonly iteration?: number | null | undefined;
  readonly slot_entry?: number | null | undefined;
  readonly next_log?: number | null | undefined;
  readonly exercise: number;
  readonly repetitions_unit?: number | null | undefined;
  readonly repetitions?: string | null | undefined;
  readonly repetitions_target?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight?: string | null | undefined;
  readonly weight_target?: string | null | undefined;
  readonly rir?: string | null | undefined;
  readonly rir_target?: string | null | undefined;
  readonly rest?: number | null | undefined;
  readonly rest_target?: number | null | undefined;
}

export interface WorkoutSession {
  readonly id: number;
  readonly routine?: number | null | undefined;
  readonly day?: number | null | undefined;
  readonly date: string;
  readonly notes?: string | null | undefined;
  readonly impression?: ImpressionEnum | undefined;
  readonly time_start?: string | null | undefined;
  readonly time_end?: string | null | undefined;
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
  readonly description?: string | undefined;
  readonly height: number;
  readonly width: number;
}

// ── Request body types for POST (exact from wger.yaml *Request) ──────────

export interface RoutineRequest {
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly start: string;
  readonly end: string;
  readonly fit_in_week?: boolean | undefined;
  readonly is_template?: boolean | undefined;
  readonly is_public?: boolean | undefined;
}

export interface DayRequest {
  readonly routine: number;
  readonly order?: number | undefined;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly is_rest?: boolean | undefined;
  readonly need_logs_to_advance?: boolean | undefined;
  readonly type?: DayTypeEnum | undefined;
  readonly config?: Config | null | undefined;
}

export interface SlotRequest {
  readonly day: number;
  readonly order?: number | undefined;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface SlotEntryRequest {
  readonly slot: number;
  readonly exercise: number;
  readonly type?: SlotEntryTypeEnum | undefined;
  readonly repetition_unit?: number | null | undefined;
  readonly repetition_rounding?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight_rounding?: string | null | undefined;
  readonly order?: number | undefined;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface WorkoutLogRequest {
  readonly date?: string | undefined;
  readonly routine?: number | null | undefined;
  readonly iteration?: number | null | undefined;
  readonly slot_entry?: number | null | undefined;
  readonly next_log?: number | null | undefined;
  readonly exercise: number;
  readonly repetitions_unit?: number | null | undefined;
  readonly repetitions?: string | null | undefined;
  readonly repetitions_target?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight?: string | null | undefined;
  readonly weight_target?: string | null | undefined;
  readonly rir?: string | null | undefined;
  readonly rir_target?: string | null | undefined;
  readonly rest?: number | null | undefined;
  readonly rest_target?: number | null | undefined;
}

export interface WorkoutSessionRequest {
  readonly routine?: number | null | undefined;
  readonly day?: number | null | undefined;
  readonly date?: string | undefined;
  readonly notes?: string | null | undefined;
  readonly impression?: ImpressionEnum | undefined;
  readonly time_start?: string | null | undefined;
  readonly time_end?: string | null | undefined;
}

export interface WeightEntryRequest {
  readonly date: string;
  readonly weight: string;
}

export interface ImageRequest {
  readonly date: string;
  readonly image: string;
  readonly description?: string | undefined;
}

// ── PATCH body types (exact from wger.yaml Patched*Request) ──────────────

export interface PatchedRoutineRequest {
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly start?: string | undefined;
  readonly end?: string | undefined;
  readonly fit_in_week?: boolean | undefined;
  readonly is_template?: boolean | undefined;
  readonly is_public?: boolean | undefined;
}

export interface PatchedDayRequest {
  readonly routine?: number | undefined;
  readonly order?: number | undefined;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly is_rest?: boolean | undefined;
  readonly need_logs_to_advance?: boolean | undefined;
  readonly type?: DayTypeEnum | undefined;
  readonly config?: Config | null | undefined;
}

export interface PatchedSlotRequest {
  readonly day?: number | undefined;
  readonly order?: number | undefined;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface PatchedSlotEntryRequest {
  readonly slot?: number | undefined;
  readonly exercise?: number | undefined;
  readonly type?: SlotEntryTypeEnum | undefined;
  readonly repetition_unit?: number | null | undefined;
  readonly repetition_rounding?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight_rounding?: string | null | undefined;
  readonly order?: number | undefined;
  readonly comment?: string | undefined;
  readonly config?: Config | null | undefined;
}

export interface PatchedWorkoutLogRequest {
  readonly date?: string | undefined;
  readonly routine?: number | null | undefined;
  readonly iteration?: number | null | undefined;
  readonly slot_entry?: number | null | undefined;
  readonly next_log?: number | null | undefined;
  readonly exercise?: number | undefined;
  readonly repetitions_unit?: number | null | undefined;
  readonly repetitions?: string | null | undefined;
  readonly repetitions_target?: string | null | undefined;
  readonly weight_unit?: number | null | undefined;
  readonly weight?: string | null | undefined;
  readonly weight_target?: string | null | undefined;
  readonly rir?: string | null | undefined;
  readonly rir_target?: string | null | undefined;
  readonly rest?: number | null | undefined;
  readonly rest_target?: number | null | undefined;
}

export interface PatchedWorkoutSessionRequest {
  readonly routine?: number | null | undefined;
  readonly day?: number | null | undefined;
  readonly date?: string | undefined;
  readonly notes?: string | null | undefined;
  readonly impression?: ImpressionEnum | undefined;
  readonly time_start?: string | null | undefined;
  readonly time_end?: string | null | undefined;
}

export interface PatchedWeightEntryRequest {
  readonly date?: string | undefined;
  readonly weight?: string | undefined;
}

export interface PatchedImageRequest {
  readonly date?: string | undefined;
  readonly image?: string | undefined;
  readonly description?: string | undefined;
}
