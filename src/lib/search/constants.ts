export const ANY_SENTINEL = "- Any -" as const;

export const MEQASA_RENT_PERIODS = [
  ANY_SENTINEL,
  "shortrent",
  "longrent",
] as const;
export type MeqasaRentPeriod = (typeof MEQASA_RENT_PERIODS)[number];

export const MEQASA_SORT_OPTIONS = [
  "date",
  "date2",
  "price",
  "price2",
] as const;
export type MeqasaSortOption = (typeof MEQASA_SORT_OPTIONS)[number];

export const MEQASA_SHORT_LET_DURATIONS = [
  "day",
  "week",
  "month",
  "month3",
  "month6",
] as const;
export type MeqasaShortLetDuration =
  (typeof MEQASA_SHORT_LET_DURATIONS)[number];
