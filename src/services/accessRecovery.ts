import { MOCK_EMAIL_CODE } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

// TODO API: enviar un codigo de verificacion al correo registrado.
export async function requestEmailRecoveryCode(_email: string): Promise<{ ok: boolean }> {
  await mockDelay(800);
  return { ok: true };
}

// TODO API: validar el codigo recibido por correo. El mock acepta MOCK_EMAIL_CODE.
export async function verifyEmailRecoveryCode(
  _email: string,
  code: string,
): Promise<{ ok: boolean }> {
  await mockDelay(700);
  return { ok: code === MOCK_EMAIL_CODE };
}

// TODO API: fijar el nuevo codigo de acceso tras validar el correo.
export async function resetAccessCodeByEmail(
  _email: string,
  _code: string,
  _newAccessCode: string,
): Promise<{ ok: boolean }> {
  await mockDelay(900);
  return { ok: true };
}
