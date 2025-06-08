import { siteConfig } from "./site";

export const searchConfig = {
  ...siteConfig,
  selectOptions: {
    ...siteConfig.selectOptions,
    period: [
      { value: "day", label: "Daily" },
      { value: "week", label: "Weekly" },
      { value: "month", label: "Up to 6 months" },
      { value: "year", label: "12 months plus" },
    ],
    sort: [
      { value: "new", label: "New to old" },
      { value: "old", label: "Old to new" },
      { value: "low", label: "Lower to higher" },
      { value: "high", label: "Higher to lower" },
    ],
  },
  priceRange: {
    min: 0,
    max: 1000000,
    step: 10000,
  },
};
