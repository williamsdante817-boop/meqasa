import type {
  MeqasaRentPeriod,
  MeqasaSortOption,
} from "./constants";

export interface LabeledOption<T extends string> {
  value: T;
  label: string;
}

export const FALLBACK_SORT_OPTIONS = [
  { value: "date", label: "New to old" },
  { value: "date2", label: "Old to new" },
  { value: "price", label: "Lower to higher" },
  { value: "price2", label: "Higher to lower" },
] satisfies ReadonlyArray<LabeledOption<MeqasaSortOption>>;

export const FALLBACK_RENT_PERIOD_OPTIONS = [
  { value: "shortrent", label: "Daily" },
  { value: "shortrent", label: "Weekly" },
  { value: "longrent", label: "Up to 6 months" },
  { value: "longrent", label: "12 months plus" },
] satisfies ReadonlyArray<
  LabeledOption<Exclude<MeqasaRentPeriod, "- Any -">>
>;
