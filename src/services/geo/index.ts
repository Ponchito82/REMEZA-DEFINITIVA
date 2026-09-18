import { MX_STATES } from "./mexico";
import { US_STATES } from "./unitedStates";
import { CountryCode, GeoOption, GeoProvider, StateRecord } from "./types";

export * from "./types";

const DATASETS: Record<CountryCode, StateRecord[]> = {
  MX: MX_STATES,
  US: US_STATES,
};

export const COUNTRY_NAMES: Record<CountryCode, { en: string; es: string }> = {
  MX: { en: "Mexico", es: "México" },
  US: { en: "United States", es: "Estados Unidos" },
};

export const COUNTRY_DIAL_CODES: Record<CountryCode, string> = {
  MX: "+52",
  US: "+1",
};

function toNumericPostalCode(postalCode: string): number | null {
  const digits = postalCode.replace(/\D/g, "").slice(0, 5);
  if (digits.length !== 5) return null;
  return Number(digits);
}

function findStateRecord(country: CountryCode, postalCode: string): StateRecord | null {
  const numeric = toNumericPostalCode(postalCode);
  if (numeric === null) return null;

  return (
    DATASETS[country].find((state) =>
      state.postalRanges.some(([min, max]) => numeric >= min && numeric <= max),
    ) ?? null
  );
}

function toOption(state: StateRecord): GeoOption {
  return { label: state.name, value: state.code };
}

export const localGeoProvider: GeoProvider = {
  async getStates(country) {
    return DATASETS[country].map(toOption);
  },

  async getCities(country, stateCode) {
    const state = DATASETS[country].find((item) => item.code === stateCode);
    if (!state) return [];
    return state.cities.map((city) => ({ label: city, value: city }));
  },

  async getStateByPostalCode(country, postalCode) {
    const state = findStateRecord(country, postalCode);
    return state ? toOption(state) : null;
  },

  async detectCountry(postalCode) {
    if (/^\d{5}-\d{4}$/.test(postalCode.trim())) {
      return { status: "detected", country: "US" };
    }

    const candidates = (Object.keys(DATASETS) as CountryCode[]).filter(
      (country) => findStateRecord(country, postalCode) !== null,
    );

    if (candidates.length === 1) return { status: "detected", country: candidates[0] };
    if (candidates.length > 1) return { status: "ambiguous", candidates };
    return { status: "unknown" };
  },
};

export const geo: GeoProvider = localGeoProvider;

export function countryOptions(language: "en" | "es"): GeoOption[] {
  return (Object.keys(COUNTRY_NAMES) as CountryCode[]).map((code) => ({
    label: COUNTRY_NAMES[code][language],
    value: code,
  }));
}

export function stateNameByCode(country: CountryCode, stateCode: string): string {
  return DATASETS[country].find((state) => state.code === stateCode)?.name ?? stateCode;
}

export function isCountryCode(value: string): value is CountryCode {
  return value === "MX" || value === "US";
}
