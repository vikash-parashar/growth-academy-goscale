/** Stable value keys for application and eligibility forms (labels come from i18n messages). */

export const APPLY_SITUATION_VALUES = [
  "employed",
  "freelance",
  "studying",
  "gap",
  "resting",
  "other",
] as const;

export type ApplySituationValue = (typeof APPLY_SITUATION_VALUES)[number];
