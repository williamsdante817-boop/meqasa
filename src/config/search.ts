import { siteConfig } from "./site";
import {
  MEQASA_RENT_PERIODS,
  MEQASA_SHORT_LET_DURATIONS,
  MEQASA_SORT_OPTIONS,
} from "@/lib/search/constants";

export const searchConfig = {
  ...siteConfig,
  selectOptions: {
    ...siteConfig.selectOptions,
    period: [
      { value: MEQASA_RENT_PERIODS[1], label: "Daily" },
      { value: MEQASA_RENT_PERIODS[1], label: "Weekly" },
      { value: MEQASA_RENT_PERIODS[2], label: "Up to 6 months" },
      { value: MEQASA_RENT_PERIODS[2], label: "12 months plus" },
    ] satisfies { value: (typeof MEQASA_RENT_PERIODS)[number]; label: string }[],
    sort: [
      { value: MEQASA_SORT_OPTIONS[0], label: "New to old" },
      { value: MEQASA_SORT_OPTIONS[1], label: "Old to new" },
      { value: MEQASA_SORT_OPTIONS[2], label: "Lower to higher" },
      { value: MEQASA_SORT_OPTIONS[3], label: "Higher to lower" },
    ] satisfies { value: (typeof MEQASA_SORT_OPTIONS)[number]; label: string }[],
    howShort: [
      { value: MEQASA_SHORT_LET_DURATIONS[0], label: "Daily" },
      { value: MEQASA_SHORT_LET_DURATIONS[1], label: "Weekly" },
      { value: MEQASA_SHORT_LET_DURATIONS[2], label: "Monthly" },
      { value: MEQASA_SHORT_LET_DURATIONS[3], label: "3 Months" },
      { value: MEQASA_SHORT_LET_DURATIONS[4], label: "6 Months" },
    ] satisfies {
      value: (typeof MEQASA_SHORT_LET_DURATIONS)[number];
      label: string;
    }[],
  },
  priceRange: {
    min: 0,
    max: 1000000,
    step: 10000,
  },
};
