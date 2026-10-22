import { Beneficiary } from "../types/app";
import { formatMxPhone, mxPhoneDigits } from "../utils/beneficiary";
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";

/** Un beneficiario como lo entrega el backend: la CLABE viene enmascarada. */
export type BeneficiaryData = {
  id: string;
  firstName: string;
  lastName: string;
  maskedClabe: string;
  phoneNumber: string;
  favorite: boolean;
  /** Epoch en ms de cuando se creo */
  createdAtMs?: number;
};

export type CreateBeneficiaryInput = {
  firstName: string;
  lastName: string;
  /** Los 18 digitos */
  clabe: string;
  /** Los 10 digitos nacionales; la lada +52 se agrega aqui */
  phoneDigits: string;
};

/**
 * El backend guarda nombre, un apellido, CLABE, telefono y favorito. Ciudad,
 * estado y correo no existen alla: aqui quedan vacios y la app los conserva
 * solo en memoria.
 */
export function toBeneficiary(data: BeneficiaryData): Beneficiary {
  return {
    id: data.id,
    firstName: data.firstName,
    paternalLastName: data.lastName,
    fullName: `${data.firstName} ${data.lastName}`.trim(),
    phone: formatMxPhone(mxPhoneDigits(data.phoneNumber)),
    city: "",
    state: "",
    clabe: data.maskedClabe,
    favorite: data.favorite === true,
    createdAt: data.createdAtMs ?? 0,
  };
}

export async function listBeneficiaries(): Promise<Beneficiary[]> {
  const data = await apiGet<BeneficiaryData[]>("/api/v1/beneficiaries");
  return (data ?? []).map(toBeneficiary);
}

/** El backend no devuelve el beneficiario creado: hay que volver a listar. */
export function createBeneficiary(input: CreateBeneficiaryInput): Promise<unknown> {
  return apiPost("/api/v1/beneficiaries", {
    firstName: input.firstName,
    lastName: input.lastName,
    clabe: input.clabe,
    phoneNumber: `+52${input.phoneDigits}`,
  });
}

export function deleteBeneficiaryById(id: string): Promise<unknown> {
  return apiDelete(`/api/v1/beneficiaries/${id}`);
}

export type UpdateBeneficiaryInput = {
  firstName?: string;
  lastName?: string;
  /** Solo si el usuario escribio la CLABE completa (18 digitos) */
  clabe?: string;
};

/** Lo que no se manda se queda igual en el backend. */
export function updateBeneficiaryById(id: string, input: UpdateBeneficiaryInput): Promise<unknown> {
  return apiPatch(`/api/v1/beneficiaries/${id}`, input);
}

/** Manda el estado que se quiere dejar, no un "alternar": repetirlo no cambia nada. */
export function setBeneficiaryFavorite(id: string, favorite: boolean): Promise<unknown> {
  return apiPatch(`/api/v1/beneficiaries/${id}/favorite`, { favorite });
}
