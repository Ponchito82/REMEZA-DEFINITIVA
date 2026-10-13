import { apiGet, apiPatch } from "./client";

/** Por donde recibe el cliente sus codigos. */
export type VerificationMethods = {
  smsEnabled: boolean;
  emailEnabled: boolean;
  /** Si no hay correo registrado, el interruptor de correo no se puede prender. */
  emailAvailable: boolean;
};

export function getVerificationMethods(): Promise<VerificationMethods> {
  return apiGet<VerificationMethods>("/api/v1/verification-methods");
}

/** Lo que no se manda se queda como esta; devuelve como quedaron los dos. */
export function updateVerificationMethods(
  changes: Partial<Pick<VerificationMethods, "smsEnabled" | "emailEnabled">>,
): Promise<VerificationMethods> {
  return apiPatch<VerificationMethods>("/api/v1/verification-methods", changes);
}
