import { apiPost } from "./client";

/**
 * Recuperacion del codigo de acceso, en dos pasos y sin token (quien llega
 * aqui es justo quien no puede iniciar sesion).
 *
 * El backend contesta igual exista o no la cuenta, asi que "enviado" no
 * confirma que el numero sea cliente; el codigo se valida hasta `confirm`.
 */
export function requestSecureCodeRecovery(phoneNumber: string): Promise<string> {
  return apiPost<string>("/api/v1/secure-code/recovery", { phoneNumber }, false);
}

export function confirmNewSecureCode(
  phoneNumber: string,
  code: string,
  newSecureCode: string,
): Promise<string> {
  return apiPost<string>(
    "/api/v1/secure-code/confirm",
    { phoneNumber, code, newSecureCode },
    false,
  );
}

/**
 * Cambiar el codigo de acceso con la sesion abierta. El cliente sale del token;
 * lo que autoriza el cambio es saber el codigo actual.
 */
export function changeSecureCode(currentSecureCode: string, newSecureCode: string): Promise<string> {
  return apiPost<string>("/api/v1/secure-code/change", { currentSecureCode, newSecureCode });
}
