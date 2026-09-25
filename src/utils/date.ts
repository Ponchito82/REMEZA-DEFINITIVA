import { Language } from "../types/app";

const LOCALES: Record<Language, string> = { es: "es-MX", en: "en-US" };

/** "12 de agosto de 2026" / "August 12, 2026" */
export function formatLongDate(value: number | Date, language: Language): string {
  return new Date(value).toLocaleDateString(LOCALES[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "14 sep 2026, 10:24 a.m." / "Sep 14, 2026, 10:24 AM" */
export function formatDateTime(value: number | Date, language: Language): string {
  return new Date(value).toLocaleString(LOCALES[language], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "24 septiembre 2026, 14:18:29" / "September 24, 2026, 2:18:29 PM" */
export function formatReceiptDate(value: number | Date, language: Language): string {
  return new Date(value)
    .toLocaleString(LOCALES[language], {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(" de ", " ")
    .replace(" de ", " ");
}

/** "10:24 a.m." / "10:24 AM" */
export function formatTime(value: number | Date, language: Language): string {
  return new Date(value).toLocaleTimeString(LOCALES[language], {
    hour: "numeric",
    minute: "2-digit",
  });
}
