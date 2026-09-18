export function formatUsPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  return [part1, part2, part3].filter(Boolean).join(" ");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidE164Phone(phone: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(phone);
}

export function isValidPersonName(name: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,50}$/.test(name.trim());
}

export function isValidForeignId(id: string): boolean {
  const trimmed = id.trim();
  return trimmed.length >= 1 && trimmed.length <= 50;
}

export function isValidSsnLast4(ssn: string): boolean {
  return ssn.length === 0 || ssn.length === 4;
}

export function isValidAddressLine(address: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-,.#/]{5,100}$/.test(address);
}

export function isValidCityOrState(value: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/.test(value.trim());
}

export function isValidZipCode(value: string): boolean {
  return /^[A-Z0-9\s-]{3,10}$/.test(value);
}

export function isValidCountryCode(value: string): boolean {
  return /^[A-Z]{2}$/.test(value);
}

export function isWeakPasscode(code: string): boolean {
  if (code.length !== 6) return true;

  const allSameDigit = code.split("").every((digit) => digit === code[0]);
  if (allSameDigit) return true;

  const digits = code.split("").map(Number);
  const ascending = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
  const descending = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);

  return ascending || descending;
}

export const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const day = String(i + 1).padStart(2, "0");
  return { label: day, value: day };
});

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { label: month, value: month };
});

export function buildYearOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const mostRecentAdultYear = currentYear - 16;
  const oldestYear = currentYear - 100;
  const years: { label: string; value: string }[] = [];
  for (let year = mostRecentAdultYear; year >= oldestYear; year--) {
    years.push({ label: String(year), value: String(year) });
  }
  return years;
}

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "unspecified" },
];

export const GENDER_OPTIONS_ES = [
  { label: "Masculino", value: "male" },
  { label: "Femenino", value: "female" },
  { label: "Otro", value: "other" },
  { label: "Prefiero no decir", value: "unspecified" },
];

export const FOREIGN_ID_TYPE_OPTIONS = [
  { label: "Passport", value: "passport" },
  { label: "Consular ID (Matrícula Consular)", value: "matricula_consular" },
  { label: "National ID / INE", value: "national_id" },
  { label: "Driver's License", value: "drivers_license" },
  { label: "Other", value: "other" },
];

export const FOREIGN_ID_TYPE_OPTIONS_ES = [
  { label: "Pasaporte", value: "passport" },
  { label: "Matrícula Consular", value: "matricula_consular" },
  { label: "INE / Identificación Nacional", value: "national_id" },
  { label: "Licencia de conducir", value: "drivers_license" },
  { label: "Otro", value: "other" },
];

export const NATIONALITY_OPTIONS = [
  "Mexico",
  "United States",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Colombia",
  "Venezuela",
  "Peru",
  "Ecuador",
  "Dominican Republic",
  "Cuba",
  "Argentina",
  "Chile",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "Other",
].map((label) => ({ label, value: label }));

export const NATIONALITY_OPTIONS_ES = [
  "México",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Colombia",
  "Venezuela",
  "Perú",
  "Ecuador",
  "República Dominicana",
  "Cuba",
  "Argentina",
  "Chile",
  "Nicaragua",
  "Costa Rica",
  "Panamá",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "Otro",
].map((label) => ({ label, value: label }));
