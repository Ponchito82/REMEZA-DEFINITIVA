import { CountryCode } from "../services/geo";

export const POSTAL_CODE_EXAMPLES: Record<CountryCode, string> = {
  MX: "90000",
  US: "78701 / 78701-1234",
};

export const POSTAL_CODE_MAX_LENGTH: Record<CountryCode, number> = {
  MX: 5,
  US: 10,
};

export function sanitizePostalCodeInput(input: string, country: CountryCode | null): string {
  const digits = input.replace(/\D/g, "");

  if (country === "MX") return digits.slice(0, 5);

  const base = digits.slice(0, 5);
  const plus4 = digits.slice(5, 9);
  return plus4 ? `${base}-${plus4}` : base;
}

export function isValidPostalCode(postalCode: string, country: CountryCode | null): boolean {
  const value = postalCode.trim();

  if (country === "MX") return /^\d{5}$/.test(value);
  if (country === "US") return /^\d{5}(-\d{4})?$/.test(value);

  return /^\d{5}(-\d{4})?$/.test(value);
}

export function postalCodeBase(postalCode: string): string {
  return postalCode.replace(/\D/g, "").slice(0, 5);
}
