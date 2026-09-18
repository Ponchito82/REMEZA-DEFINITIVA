import { CountryCode } from "../services/geo";

export const PHONE_NATIONAL_LENGTH: Record<CountryCode, number> = {
  MX: 10,
  US: 10,
};

export const PHONE_EXAMPLES: Record<CountryCode, string> = {
  MX: "+52 246 123 4567",
  US: "+1 (555) 123-4567",
};

const DIAL_CODES: { country: CountryCode; dial: string }[] = [
  { country: "MX", dial: "52" },
  { country: "US", dial: "1" },
];

export function detectCountryFromInput(input: string): CountryCode | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("+")) return null;

  const digits = trimmed.slice(1).replace(/\D/g, "");
  if (!digits) return null;

  const match = DIAL_CODES.find(({ dial }) => digits.startsWith(dial));
  return match ? match.country : null;
}

export function extractNationalDigits(input: string, country: CountryCode): string {
  const trimmed = input.trim();
  let digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    const dial = DIAL_CODES.find((item) => item.country === country)?.dial ?? "";
    if (dial && digits.startsWith(dial)) {
      digits = digits.slice(dial.length);
    }
  }

  return digits.slice(0, PHONE_NATIONAL_LENGTH[country]);
}

export function formatNationalPhone(digits: string, country: CountryCode): string {
  const clean = digits.replace(/\D/g, "").slice(0, PHONE_NATIONAL_LENGTH[country]);
  if (!clean) return "";

  if (country === "MX") {
    const parts = [clean.slice(0, 3), clean.slice(3, 6), clean.slice(6, 10)];
    return parts.filter(Boolean).join(" ");
  }

  const area = clean.slice(0, 3);
  const prefix = clean.slice(3, 6);
  const line = clean.slice(6, 10);

  if (clean.length <= 3) return `(${area}`;
  if (clean.length <= 6) return `(${area}) ${prefix}`;
  return `(${area}) ${prefix}-${line}`;
}

export function isValidNationalPhone(digits: string, country: CountryCode): boolean {
  const clean = digits.replace(/\D/g, "");
  if (clean.length !== PHONE_NATIONAL_LENGTH[country]) return false;
  return !/^[01]/.test(clean);
}

export function toE164(digits: string, country: CountryCode): string {
  const dial = DIAL_CODES.find((item) => item.country === country)?.dial ?? "";
  return `+${dial}${digits.replace(/\D/g, "")}`;
}

export function dialCodeLabel(country: CountryCode): string {
  const dial = DIAL_CODES.find((item) => item.country === country)?.dial ?? "";
  return `+${dial}`;
}
