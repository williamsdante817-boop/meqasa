export type PropertiesAction = "search" | "loadMore";

export interface PropertiesQueryOptions {
  action: PropertiesAction;
  contract: string;
  locality: string;
  params?: Record<string, string | number | null | undefined>;
}

const RESERVED_KEYS = new Set(["type", "contract", "locality"]);

function isDefinedValue(
  value: string | number | null | undefined
): value is string | number {
  return value !== undefined && value !== null && value !== "";
}

export function buildPropertiesSearchParams(
  options: PropertiesQueryOptions
): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set("type", options.action);
  searchParams.set("contract", options.contract);
  searchParams.set("locality", options.locality);

  const extraEntries = Object.entries(options.params ?? {})
    .filter(([key, value]) => !RESERVED_KEYS.has(key) && isDefinedValue(value))
    .sort(([a], [b]) => a.localeCompare(b));

  for (const [key, value] of extraEntries) {
    searchParams.set(key, String(value));
  }

  return searchParams;
}

export function buildPropertiesQueryString(
  options: PropertiesQueryOptions
): string {
  return buildPropertiesSearchParams(options).toString();
}
