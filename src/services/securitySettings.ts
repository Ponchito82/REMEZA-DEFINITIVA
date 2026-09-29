import {
  MOCK_NOTIFICATION_PREFERENCES,
  NotificationPreferences,
} from "../mocks/remeza";
import { MOCK_EMAIL_CODE } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";
import { authenticateWithBiometrics, BiometricsResult } from "./biometrics";

export type TwoFactorMethod = "sms" | "email";

let twoFactorMethods: Record<TwoFactorMethod, boolean> = { sms: true, email: false };
let biometricsEnabled = false;
let notificationPreferences: NotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };

// TODO API: metodos activos de verificacion (SMS y correo, independientes entre si).
export async function getTwoFactorMethods(): Promise<Record<TwoFactorMethod, boolean>> {
  await mockDelay(150);
  return { ...twoFactorMethods };
}

// TODO API: enviar el codigo de verificacion al telefono (SMS) o al correo.
export async function sendTwoFactorCode(
  _method: TwoFactorMethod,
  _destination: string,
): Promise<{ ok: boolean }> {
  await mockDelay(800);
  return { ok: true };
}

// TODO API: validar el codigo recibido. El mock acepta MOCK_EMAIL_CODE.
export async function verifyTwoFactorCode(
  _method: TwoFactorMethod,
  _destination: string,
  code: string,
): Promise<{ ok: boolean }> {
  await mockDelay(700);
  return { ok: code === MOCK_EMAIL_CODE };
}

// TODO API: activar o desactivar un metodo de verificacion.
export async function setTwoFactorMethod(
  method: TwoFactorMethod,
  enabled: boolean,
): Promise<Record<TwoFactorMethod, boolean>> {
  await mockDelay(300);
  twoFactorMethods = { ...twoFactorMethods, [method]: enabled };
  return { ...twoFactorMethods };
}

// TODO API: cambiar el codigo de acceso con sesion iniciada.
export async function changeAccessCode(
  _currentCode: string,
  _newCode: string,
): Promise<{ ok: boolean }> {
  await mockDelay(900);
  return { ok: true };
}

/**
 * Activa la biometria pidiendo la verificacion real al sistema: Face ID en
 * iOS y huella digital en Android. Solo se marca activa si el usuario la pasa.
 * TODO API: registrar en el backend que el dispositivo tiene biometria activa.
 */
export async function enableBiometrics(
  promptMessage: string,
  cancelButtonText: string,
): Promise<BiometricsResult> {
  const result = await authenticateWithBiometrics(promptMessage, cancelButtonText);
  if (result.ok) biometricsEnabled = true;
  return result;
}

export function isBiometricsEnabled(): boolean {
  return biometricsEnabled;
}

// TODO API: preferencias de notificaciones.
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await mockDelay(150);
  return notificationPreferences;
}

// TODO API: guardar preferencias de notificaciones.
export async function saveNotificationPreferences(
  preferences: NotificationPreferences,
): Promise<{ ok: boolean }> {
  await mockDelay(400);
  notificationPreferences = { ...preferences };
  return { ok: true };
}
