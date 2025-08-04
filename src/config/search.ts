import { siteConfig } from "./site";

export const searchConfig = {
  ...siteConfig,
  selectOptions: {
    ...siteConfig.selectOptions,
    period: [
      { value: "shortrent", label: "Daily" },
      { value: "shortrent", label: "Weekly" },
      { value: "longrent", label: "Up to 6 months" },
      { value: "longrent", label: "12 months plus" },
    ],
    sort: [
      { value: "date", label: "New to old" },
      { value: "date2", label: "Old to new" },
      { value: "price", label: "Lower to higher" },
      { value: "price2", label: "Higher to lower" },
    ],
    howShort: [
      { value: "day", label: "Daily" },
      { value: "week", label: "Weekly" },
      { value: "month", label: "Monthly" },
      { value: "month3", label: "3 Months" },
      { value: "month6", label: "6 Months" },
    ],
  },
  priceRange: {
    min: 0,
    max: 1000000,
    step: 10000,
  },
};
