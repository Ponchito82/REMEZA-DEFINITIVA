/**
 * Los tres primeros digitos de una CLABE identifican al banco (catalogo de
 * Banxico). Solo se listan los mas comunes; el resto cae en `undefined`.
 */
const BANKS_BY_CODE: Record<string, string> = {
  "002": "Banamex",
  "012": "BBVA México",
  "014": "Santander",
  "021": "HSBC",
  "030": "BanBajío",
  "036": "Inbursa",
  "044": "Scotiabank",
  "058": "Banregio",
  "072": "Banorte",
  "127": "Banco Azteca",
  "137": "BanCoppel",
  "638": "Nu México",
};

export function bankFromClabe(clabe?: string): string | undefined {
  const digits = (clabe ?? "").replace(/\D/g, "");
  if (digits.length < 3) return undefined;
  return BANKS_BY_CODE[digits.slice(0, 3)];
}

/** "0123 4567 8901 2345 67" */
export function formatClabe(clabe?: string): string {
  return (clabe ?? "").replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Ultimos cuatro digitos */
export function last4(value?: string): string {
  return (value ?? "").replace(/\D/g, "").slice(-4);
}
