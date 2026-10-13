import { isValidNationalPhone } from "./phone";
import { isValidPersonName } from "./validation";

/** Quien recibe siempre es de Mexico: la lada va fija en +52. */
export const BENEFICIARY_PHONE_COUNTRY = "MX";

export type BeneficiaryFields = {
  firstName: string;
  paternalLastName: string;
  phone: string;
  clabe: string;
};

/**
 * Reglas del formulario de beneficiario, en el formato de `useFormFocus`.
 * Las comparten el alta (33) y la edicion (38).
 */
export function beneficiaryRules(t: any, fields: BeneficiaryFields) {
  return [
    {
      key: "firstName",
      valid: isValidPersonName(fields.firstName),
      message: t.requiredFirstName,
    },
    {
      key: "paternalLastName",
      valid: isValidPersonName(fields.paternalLastName),
      message: t.requiredLastName,
    },
    {
      key: "phone",
      valid: isValidNationalPhone(fields.phone, BENEFICIARY_PHONE_COUNTRY),
      message: fields.phone.length === 0 ? t.requiredPhone : t.invalidPhoneForCountry,
    },
    {
      key: "clabe",
      valid: fields.clabe.replace(/\D/g, "").length === 18,
      message: t.requiredClabe,
    },
  ];
}

/** "+52 55 1234 5678" a partir de los 10 digitos nacionales */
export function formatMxPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length !== 10) return `+52 ${d}`;
  return `+52 ${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

/** Los 10 digitos nacionales de un telefono ya formateado con +52 */
export function mxPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^52/, "").slice(-10);
}
