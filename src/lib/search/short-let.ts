import { ANY_SENTINEL, MEQASA_RENT_PERIODS } from "./constants";

const SHORT_LET_SENTINEL = ANY_SENTINEL;
export const SHORT_LET_RENT_PERIOD = MEQASA_RENT_PERIODS[1];

type NullableString = string | null | undefined;

interface ShortLetLike {
  frentperiod?: NullableString;
  fhowshort?: NullableString;
}

/**
 * Detect whether the provided params represent a short-let query.
 * Accepts loose shapes so it can be reused both server- and client-side.
 */
export function isShortLetQuery(params: ShortLetLike): boolean {
  const rentPeriod = params.frentperiod?.toString().toLowerCase();
  const howShortRaw = params.fhowshort?.toString().trim();

  const hasShortRentPeriod = rentPeriod === SHORT_LET_RENT_PERIOD;
  const hasDuration = Boolean(
    howShortRaw && howShortRaw !== "" && howShortRaw !== SHORT_LET_SENTINEL
  );

  return hasShortRentPeriod || hasDuration;
}
